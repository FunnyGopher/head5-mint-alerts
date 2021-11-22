import Head5Abi from '../abi/Head5.json';
import getMint from '../lib/get-mint';
import { getLatestBlock, saveLatestBlock } from '../lib/latest-block';
import getTransactions from '../lib/get-transactions';
import sendDiscordMessage from '../lib/send-discord-message';
import { wait } from '../lib/util';

import abiDecoder from 'abi-decoder';
import { DynamoDB } from 'aws-sdk';
import Eth from 'web3-eth';

const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;
if(CONTRACT_ADDRESS === undefined) throw Error('CONTRACT_ADDRESS environment variable is undefined.');

const DEFAULT_START_BLOCK = process.env.DEFAULT_START_BLOCK;
if(DEFAULT_START_BLOCK === undefined) throw Error('DEFAULT_START_BLOCK environment variable is undefined.');

const START_BLOCK_TABLE_NAME = process.env.START_BLOCK_TABLE_NAME;
if(START_BLOCK_TABLE_NAME === undefined) throw Error('START_BLOCK_TABLE_NAME environment variable is undefined.');

const DISCORD_WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL;
if(DISCORD_WEBHOOK_URL === undefined) throw Error('DISCORD_WEBHOOK_URL environment variable is undefined.');

const dynamodb = new DynamoDB.DocumentClient();
// @ts-ignore
const web3 = new Eth('https://rpc-mainnet.maticvigil.com');
abiDecoder.addABI(Head5Abi);

exports.handler = async () => {
  const startBlock = await getLatestBlock(DEFAULT_START_BLOCK, { dynamodb, tablename: START_BLOCK_TABLE_NAME });

  let transactions;
  try {
    transactions = await getTransactions(CONTRACT_ADDRESS, startBlock);
  } catch(err) {
    console.error('Could not get transactions.');
    throw err;
  }

  let latestBlockNumber = startBlock;
  let mintCount = 0;
  for(const tx of transactions) {
    if(tx.blockNumber > latestBlockNumber) latestBlockNumber = tx.blockNumber;

    let mint;
    try {
      mint = await getMint(CONTRACT_ADDRESS, tx, { web3, abiDecoder });
    } catch(err) {
      console.error('Could not get mint from transction.', { transaction: tx, err });
      continue;
    }
    if(mint === undefined) continue;

    await sendDiscordMessage(mint, DISCORD_WEBHOOK_URL);
    mintCount++;
    await wait(500);
  }

  if(mintCount > 0) {
    latestBlockNumber = (parseInt(latestBlockNumber) + 1).toString()
  }

  await saveLatestBlock(latestBlockNumber, { dynamodb, tablename: START_BLOCK_TABLE_NAME });
}