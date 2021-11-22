import { Construct, Duration, Stack, StackProps } from '@aws-cdk/core';
import { Code, Function, Runtime } from '@aws-cdk/aws-lambda';
import { AttributeType, Table } from '@aws-cdk/aws-dynamodb';
import { Rule, Schedule } from '@aws-cdk/aws-events';
import { LambdaFunction } from '@aws-cdk/aws-events-targets';

export class Head5MintAlertStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const table = new Table(this, 'LatestBlockTable', {
      partitionKey: {
        name: 'type',
        type: AttributeType.STRING
      }
    });

    const messageNewHeads = new Function(this, 'MessageNewHeads', {
      code: Code.fromAsset('dist/lambdas/MessageNewHeads'),
      handler: 'index.handler',
      runtime: Runtime.NODEJS_14_X,
      environment: {
        CONTRACT_ADDRESS: '0x89d2e41408EAcBBCC5eEBeffAAa27Fd2A01Ff88b',
        DEFAULT_START_BLOCK: '21656608',
        DISCORD_WEBHOOK_URL: '',
        START_BLOCK_TABLE_NAME: table.tableName
      }
    });
    table.grantReadWriteData(messageNewHeads);

    const scheduledRule = new Rule(this, 'ScheduledHead5Message', {
      description: 'Periodically checks for new head5 mints',
      schedule: Schedule.rate(Duration.minutes(5)),
      targets: [ new LambdaFunction(messageNewHeads) ]
    });
  }
}
