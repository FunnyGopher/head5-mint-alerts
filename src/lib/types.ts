export type Transaction = {
  blockNumber: string
  timeStamp: string
  hash: string
  nonce: string
  blockHash: string
  transactionIndex: string
  from: string
  to: string
  value: string
  gas: string
  gasPrice: string
  isError: string
  txreceipt_status: string
  input: string
  contractAddress: string
  cumulativeGasUsed: string
  gasUsed: string
  confirmations: string
}

export type TransactionList = Transaction[]

export type ListTransactionsResponse = {
  status: string
  message: string
  result: TransactionList
}

export type Head5Mint = {
  address: string
  headIds: string[]
  blockNumber: string
}