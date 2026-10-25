import { Construct } from "constructs";
import { aws_cloudfront, aws_lambda } from "aws-cdk-lib";

export interface NodeLambdaEdgeProps {
  dirName: string;
}

export class NodeLambdaEdge extends Construct {
  readonly edgeFunction: aws_cloudfront.experimental.EdgeFunction;
  constructor(scope: Construct, id: string, props: NodeLambdaEdgeProps) {
    super(scope, id);
    const { dirName } = props;

    const functionProps: aws_cloudfront.experimental.EdgeFunctionProps = {
      code: aws_lambda.Code.fromAsset(`./lib/lambda/${dirName}`, {
        bundling: {
          image: aws_lambda.Runtime.NODEJS_20_X.bundlingImage,
          command: [""]
        }
      }),
      handler: "index.handler",
      runtime: aws_lambda.Runtime.NODEJS_20_X,
      functionName: `${id}-${dirName}`,
    };

    this.edgeFunction = new aws_cloudfront.experimental.EdgeFunction(this, "edge-basic-auth", functionProps);
  }
}
