export const handler = async (): Promise<{ statusCode: number, body: number }> => {
  const randomNumber = Math.floor(Math.random() * 6) + 1;

  return Promise.resolve({ statusCode: 200, body: randomNumber });
}