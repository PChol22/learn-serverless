import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { v4 as uuidv4 } from 'uuid';

const dynamoDBClient = new DynamoDBClient({});
const s3Client = new S3Client({});

export const handler = async (event: { body: string }): Promise<{ statusCode: number, body: string }> => {
  const { title, content, author } = JSON.parse(event.body) as { title?: string, content?: string, author?: string };

  if (title === undefined || content === undefined || author === undefined) {
    return Promise.resolve({ statusCode: 400, body: 'Missing title, content or author' });
  }

  const id = uuidv4();

  await dynamoDBClient.send(new PutItemCommand({
    TableName: process.env.TABLE_NAME,
    Item: {
      PK: { S: `article` },
      SK: { S: id },
      title: { S: title },
      author: { S: author },
    }
  }));

  await s3Client.send(new PutObjectCommand({
    Bucket: process.env.BUCKET_NAME,
    Key: id,
    Body: content,
  }));

  return { statusCode: 200, body: JSON.stringify({ id }) };
}