import { GetObjectCommand, GetObjectCommandOutput, S3Client } from "@aws-sdk/client-s3";

const client = new S3Client({})

export const handler = async ({ pathParameters: { id } }: { pathParameters: { id: string }}): Promise<{ statusCode: number, body: string }> => {
  let result: GetObjectCommandOutput | undefined;
  
  try {
    result = await client.send(new GetObjectCommand({
      Bucket: process.env.BUCKET_NAME,
      Key: id,
    }));
  } catch {
    result = undefined;
  }

  if (result?.Body === undefined) {
    return { statusCode: 404, body: 'Article not found' };
  }

  const content = await result.Body.transformToString();

  return {
    statusCode: 200,
    body: JSON.stringify({ content })
  };
}