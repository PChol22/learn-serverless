import { DynamoDBClient, QueryCommand } from "@aws-sdk/client-dynamodb";

const client = new DynamoDBClient({});

export const handler = async (): Promise<{ statusCode: number, body: string }> => {
  const { Items } = await client.send(new QueryCommand({
    TableName: process.env.TABLE_NAME,
    KeyConditionExpression: 'PK = :pk',
    ExpressionAttributeValues: {
      ':pk': { S: 'article' },
    },
  }));

  if (Items === undefined) {
    return { statusCode: 500, body: 'No articles found' };
  }

  const articles = Items.map(item => ({
    id: item.SK?.S,
    title: item.title?.S,
  }));

  return {
    statusCode: 200,
    body: JSON.stringify({ articles }),
  };
}