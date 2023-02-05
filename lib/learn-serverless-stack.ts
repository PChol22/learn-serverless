import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
// import * as sqs from 'aws-cdk-lib/aws-sqs';

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
  }
}
