import { DynamoDBClient, GetItemCommand } from '@aws-sdk/client-dynamodb';

const client = new DynamoDBClient({});

export const handler = async (event: { pathParameters: { userId?: string, id?: string }}): Promise<{ statusCode: number, body: string }> => {
  const { userId, id: noteId } = event.pathParameters ?? {};

  if (userId === undefined || noteId === undefined) {
    return {
      statusCode: 400,
      body: "bad request"
    }
  }

  const { Item } = await client.send(new GetItemCommand({
    TableName: process.env.TABLE_NAME,
    Key: {
      PK: { S: userId },
      SK: { S: noteId },
    },
  }));

  if (Item === undefined) {
    return {
      statusCode: 404,
      body: "not found"
    }
  }

  return {
    statusCode: 200,
    body: JSON.stringify({
      id: noteId,
      content: Item.noteContent.S,
    }),
  };
}