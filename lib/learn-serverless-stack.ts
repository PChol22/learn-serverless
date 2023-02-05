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

    // example resource
    // const queue = new sqs.Queue(this, 'LearnServerlessQueue', {
    //   visibilityTimeout: cdk.Duration.seconds(300)
    // });
  }
}
