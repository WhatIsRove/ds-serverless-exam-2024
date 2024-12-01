import * as cdk from "aws-cdk-lib";
import * as lambdanode from "aws-cdk-lib/aws-lambda-nodejs";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as events from "aws-cdk-lib/aws-lambda-event-sources";
import * as sqs from "aws-cdk-lib/aws-sqs";
import * as sns from "aws-cdk-lib/aws-sns";
import * as subs from "aws-cdk-lib/aws-sns-subscriptions";
import * as iam from "aws-cdk-lib/aws-iam";
import { Construct } from "constructs";

export class EDAAppStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Integration infrastructure

    const ordersQ = new sqs.Queue(this, "mailer-queue", {
      receiveMessageWaitTime: cdk.Duration.seconds(10),
    });

    const ordersTopic = new sns.Topic(this, "NewImageTopic", {
      displayName: "New Image topic",
    });

    // Lambda functions

    // Generate test data
    const generateOrdersFn = new lambdanode.NodejsFunction(
      this,
      "GenerateOrdersFn",
      {
        architecture: lambda.Architecture.ARM_64,
        runtime: lambda.Runtime.NODEJS_18_X,
        entry: `${__dirname}/../lambdas/generateOrders.ts`,
        timeout: cdk.Duration.seconds(10),
        memorySize: 128,
        environment: {
          TOPIC_ARN: ordersTopic.topicArn,
        },
      }
    );

    const processOrdersFn = new lambdanode.NodejsFunction(
      this,
      "ProcessOrdersFn",
      {
        architecture: lambda.Architecture.ARM_64,
        runtime: lambda.Runtime.NODEJS_18_X,
        entry: `${__dirname}/../lambdas/processOrders.ts`,
        timeout: cdk.Duration.seconds(10),
        memorySize: 128,
      }
    );

    const mailerFn = new lambdanode.NodejsFunction(this, "mailer-function", {
      runtime: lambda.Runtime.NODEJS_18_X,
      memorySize: 1024,
      timeout: cdk.Duration.seconds(3),
      entry: `${__dirname}/../lambdas/mailer.ts`,
    });

    // Subscriptions

    ordersTopic.addSubscription(new subs.SqsSubscription(ordersQ));

    // Event sources

    const newOrdersEventSource = new events.SqsEventSource(ordersQ, {
      batchSize: 5,
      maxBatchingWindow: cdk.Duration.seconds(10),
    });

    // Lambda triggers

    processOrdersFn.addEventSource(newOrdersEventSource);

    // Permissions

    ordersTopic.grantPublish(generateOrdersFn);

    // Output

    new cdk.CfnOutput(this, "Generator Lambda name", {
      value: generateOrdersFn.functionName,
    });
  }
}
