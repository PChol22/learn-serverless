import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import path from 'path'

export class LearnServerlessStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Provision a simple Lambda function
    new cdk.aws_lambda_nodejs.NodejsFunction(this, 'myFirstLambdaFunction', {
      entry: path.join(__dirname, 'myFirstLambda', 'handler.ts'),
      handler: 'handler',
    });

    // Provision a new Lambda function
    // Put the result inside a variable so we can use it later
    const rollADiceFunction = new cdk.aws_lambda_nodejs.NodejsFunction(this, 'rollADiceFunction', {
      entry: path.join(__dirname, 'rollADice', 'handler.ts'),
      handler: 'handler',
    });

    // Provision a new REST API Gateway
    const myFirstApi = new cdk.aws_apigateway.RestApi(this, 'myFirstApi', {});

    // Add a new GET /dice resource to the API Gateway
    // Corresponding to the invocation of the rollADice function
    const diceResource = myFirstApi.root.addResource('dice');
    diceResource.addMethod('GET', new cdk.aws_apigateway.LambdaIntegration(rollADiceFunction));

    // Provision a new Lambda function
    // Put the result inside a variable so we can use it later
    const rollDicesFunction = new cdk.aws_lambda_nodejs.NodejsFunction(this, 'rollDicesFunction', {
      entry: path.join(__dirname, 'rollManyDices', 'handler.ts'),
      handler: 'handler',
    });

    // Add a new GET /dice/:nbOfDices resource to the API Gateway
    // Corresponding to the invocation of the rollManyDices function
    diceResource.addResource('{nbOfDices}').addMethod('GET', new cdk.aws_apigateway.LambdaIntegration(rollDicesFunction));

    const database = new cdk.aws_dynamodb.Table(this, 'myFirstDatabase', {
      partitionKey: {
        name: 'PK',
        type: cdk.aws_dynamodb.AttributeType.STRING,
      },
      sortKey: {
        name: 'SK',
        type: cdk.aws_dynamodb.AttributeType.STRING,
      },
      billingMode: cdk.aws_dynamodb.BillingMode.PAY_PER_REQUEST,
    });

    const createNote = new cdk.aws_lambda_nodejs.NodejsFunction(this, 'createNote', {
      entry: path.join(__dirname, 'createNote', 'handler.ts'),
      handler: 'handler',
      environment: {
        TABLE_NAME: database.tableName,
      },
    });

    database.grantWriteData(createNote);

    const getNote = new cdk.aws_lambda_nodejs.NodejsFunction(this, 'getNote', {
      entry: path.join(__dirname, 'getNote', 'handler.ts'),
      handler: 'handler',
      environment: {
        TABLE_NAME: database.tableName,
      },
    });

    database.grantReadData(getNote);

    const userResource = myFirstApi.root.addResource('users').addResource('{userId}');
    const notesResource = userResource.addResource('notes');
    notesResource.addMethod('POST', new cdk.aws_apigateway.LambdaIntegration(createNote));
    notesResource.addResource('{id}').addMethod('GET', new cdk.aws_apigateway.LambdaIntegration(getNote));
  }
}
