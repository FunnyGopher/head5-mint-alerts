import type { Transaction } from './types';
import type { Head5Mint } from './types';
// import type Eth from 'web3-eth';
import type abiDecoder from 'abi-decoder';

export default async function getMint(contractAddress: string, transaction: Transaction, props: GetMintProps): Promise<Head5Mint | undefined> {
  const receipt = await props.web3.getTransactionReceipt(transaction.hash);
  const logs = props.abiDecoder.decodeLogs(receipt.logs);
  const filtered = logs.filter(log => log.name === 'Transfer' && log.address === contractAddress && log.events[0].value === '0x0000000000000000000000000000000000000000');

  if(filtered.length > 0) {
    let address: string = filtered[0].events[1].value;
    let headIds: string[] = [];

    filtered.forEach(log => {
      headIds.push(log.events[2].value);
    });

    return {
      address,
      headIds,
      blockNumber: transaction.blockNumber
    };
  }

  return undefined;
};

type GetMintProps = {
  web3: any,
  abiDecoder: typeof abiDecoder
}