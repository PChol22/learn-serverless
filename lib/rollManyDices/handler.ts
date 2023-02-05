type LambdaInput = { pathParameters: { nbOfDices: string } };

export const handler = async ({ pathParameters: { nbOfDices } }: LambdaInput): Promise<{ statusCode: number, body?: number }> => {
  if (Number.isNaN(+nbOfDices)) {
    return Promise.resolve({ statusCode: 400 });
  }

  let total = 0;

  for (let i = 0; i < +nbOfDices; i++) {
    total += Math.floor(Math.random() * 6) + 1;
  }

  return Promise.resolve({ statusCode: 200, body: total });
}