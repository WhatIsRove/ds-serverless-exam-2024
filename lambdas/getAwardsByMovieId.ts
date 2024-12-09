import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { MovieAward } from "../shared/types";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
    DynamoDBDocumentClient,
    QueryCommand,
    QueryCommandInput,
    GetCommand,
} from "@aws-sdk/lib-dynamodb";
import Ajv from "ajv";
import schema from "../shared/types.schema.json";

type ResponseBody = {
    data: {
        awards?: MovieAward[];
    };
};

const ddbDocClient = createDDbDocClient();

export const handler: APIGatewayProxyHandlerV2 = async (event, context) => {
    try {
        console.log("Event: ", JSON.stringify(event));
        const parameters = event?.pathParameters;
        const awardBody = parameters?.awardBody ? parameters.awardBody : undefined;
        const movieId = parameters?.movieId
            ? parseInt(parameters.movieId)
            : undefined;

        if (!awardBody) {
            return {
                statusCode: 404,
                headers: {
                    "content-type": "application/json",
                },
                body: JSON.stringify({ Message: "Missing award body" }),
            };
        }

        if (!movieId) {
            return {
                statusCode: 404,
                headers: {
                    "content-type": "application/json",
                },
                body: JSON.stringify({ Message: "Missing movie Id" }),
            };
        }

        let body: ResponseBody = {
            data: { awards: [] },
        };

        let queryCommandInput: QueryCommandInput = {
            TableName: process.env.AWARDS_TABLE_NAME,
        };
        queryCommandInput = {
            ...queryCommandInput,
            KeyConditionExpression: "movieId = :m and awardBody = :a",
            ExpressionAttributeValues: {
                ":m": movieId,
                ":a": awardBody
            },
        };
        const queryCommandOutput = await ddbDocClient.send(
            new QueryCommand(queryCommandInput)
        );
        body.data.awards = queryCommandOutput.Items as MovieAward[];

        // Return Response
        return {
            statusCode: 200,
            headers: {
                "content-type": "application/json",
            },
            body: JSON.stringify(body),
        };
    } catch (error: any) {
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

function createDDbDocClient() {
    const ddbClient = new DynamoDBClient({ region: process.env.REGION });
    const marshallOptions = {
        convertEmptyValues: true,
        removeUndefinedValues: true,
        convertClassInstanceToMap: true,
    };
    const unmarshallOptions = {
        wrapNumbers: false,
    };
    const translateConfig = { marshallOptions, unmarshallOptions };
    return DynamoDBDocumentClient.from(ddbClient, translateConfig);
}
