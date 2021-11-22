import DynamoDB from 'aws-sdk/clients/dynamodb';

export async function getLatestBlock(defaultStartBlock: string, props: GetStartBlockProps): Promise<string> {
  let result;
  try {
    result = await props.dynamodb.get({
      TableName: props.tablename,
      Key: { type: 'LATEST_BLOCK' },
      AttributesToGet: [ 'block_number' ]
    }).promise();
  } catch(err) {
    console.error('Could not get latest block.', { err });
  }

  if(!result?.Item) {
    console.warn('Query for latest start block returned empty. Using default start block.');
    return defaultStartBlock;
  }

  return result.Item.block_number;
}

export async function saveLatestBlock(latestBlock: string, props: SaveStartBlockProps) {
  try {
    await props.dynamodb.put({
      TableName: props.tablename,
      Item: {
        type: 'LATEST_BLOCK',
        block_number: latestBlock
      }
    }).promise()
  } catch(err) {
    console.error('Could not save latest block.', { latestBlock, err });
  }
}

type GetStartBlockProps = {
  dynamodb: DynamoDB.DocumentClient,
  tablename: string
}

type SaveStartBlockProps = {
  dynamodb: DynamoDB.DocumentClient,
  tablename: string
}