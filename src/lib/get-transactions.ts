import type { ListTransactionsResponse, TransactionList } from './types';
import phin from 'phin';

/**
 * Requests a list of transactions from an address
 * @param contractAddress The contract address to list transactions for
 * @param startBlock The block number to start listing from
 */
export default async function getTransactions(contractAddress: string, startBlock: string): Promise<TransactionList> {
  const getTxs = `https://api.polygonscan.com/api?module=account&action=txlist&address=${contractAddress}&startblock=${startBlock}&endblock=99999999&sort=asc`;
  const response = await phin({
    url: getTxs,
    method: 'GET',
    parse: 'json'
  });

  const body = response.body as ListTransactionsResponse;
  if(body.status !== '1') {
    // If there are no results
    if(body.message === 'No transactions found') return body.result;

    throw Error('Request responded with a non-1 status.');
  }

  return body.result;
}

