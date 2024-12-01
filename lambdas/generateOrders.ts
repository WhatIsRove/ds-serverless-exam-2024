import { Handler } from "aws-lambda";
import { v4 } from "uuid";
import { Order } from "../shared/types";
import { OrderMix, BadOrder } from "../shared/types";
import { strict } from "assert";
import { stringify } from "querystring";
import { SNSClient,  PublishCommand } from "@aws-sdk/client-sns";
import { LegendPosition } from "aws-cdk-lib/aws-cloudwatch";

const snsClient = new SNSClient({ region: process.env.AWS_REGION });

const orders: OrderMix[] = [];
for (let i = 0; i < 6; i++) {
  orders.push({
    customerName: `User${i}`,
    customerAddress: "1 Main Street",
    items: [],
  });
}

orders.splice(3, 1, {
  // No address property - Bad.
  customerName: "UserX",
  items: [],
});

export const handler: Handler = async (event) => {
  try {
    let publishCommand = new PublishCommand({
      TopicArn: process.env.TOPIC_ARN,
      Message: JSON.stringify(orders[0]),
    })
    await snsClient.send(publishCommand);   
    publishCommand = new PublishCommand({
      TopicArn: process.env.TOPIC_ARN,
      Message: JSON.stringify(orders[1]),
    })
    await snsClient.send(publishCommand);
    publishCommand = new PublishCommand({
      TopicArn: process.env.TOPIC_ARN,
      Message: JSON.stringify(orders[2]),
    })
    await snsClient.send(publishCommand);
    publishCommand = new PublishCommand({
      TopicArn: process.env.TOPIC_ARN,
      Message: JSON.stringify(orders[3]),
    })
    await snsClient.send(publishCommand);
    publishCommand = new PublishCommand({
      TopicArn: process.env.TOPIC_ARN,
      Message: JSON.stringify(orders[4]),
    })
    await snsClient.send(publishCommand);
    publishCommand = new PublishCommand({
      TopicArn: process.env.TOPIC_ARN,
      Message: JSON.stringify(orders[5]),
    })
    await snsClient.send(publishCommand);

    return {
        statusCode: 200,
        headers: {
            "content-type": "application/json",
        },
        body: "All orders queued for processing",
    };
} catch (error) {
    console.log(JSON.stringify(error));
    return {
        statusCode: 500,
        headers: {
            "content-type": "application/json",
        },
        body: JSON.stringify({ error }),
    };
}
};
