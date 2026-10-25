import {
  aws_cloudfront_origins,
  aws_certificatemanager as acm,
  aws_route53,
  aws_route53_targets,
  aws_cloudfront,
  aws_s3,
} from "aws-cdk-lib";
import { Construct } from "constructs";
import { NodeLambdaEdge } from "./constructs/lambda-edge";

export interface AuthenticatedCdnProps {
  s3BucketName: string;
  route53DomainName: string;
  route53RecordName: string;
}

export class AuthenticatedCdn extends Construct {
  constructor(scope: Construct, id: string, props: AuthenticatedCdnProps) {
    super(scope, id);

    const { s3BucketName, route53DomainName, route53RecordName } = props;

    // == Lambda@Edge ==
    const checkAuthEdge = new NodeLambdaEdge(this, "CheckAuthEdge", {
      dirName: "check-auth",
    });
    const setCookieEdge = new NodeLambdaEdge(this, "SetCookieEdge", {
      dirName: "set-cookie",
    });
    const expireCookieEdge = new NodeLambdaEdge(this, "ExpireCookieEdge", {
      dirName: "expire-cookie",
    });
    const redirectEdge = new NodeLambdaEdge(this, "RedirectEdge", {
      dirName: "redirect",
    });

    // Route 53 for cloudfront
    const hostedZone = aws_route53.HostedZone.fromLookup(this, "HostedZone", {
      domainName: route53DomainName,
    });

    const certificate = new acm.Certificate(this, "Certificate", {
      domainName: route53RecordName,
      validation: acm.CertificateValidation.fromDns(hostedZone),
    });
    const s3Bucket = aws_s3.Bucket.fromBucketName(this, "S3", s3BucketName);
    const s3Origin = new aws_cloudfront_origins.S3Origin(s3Bucket);
    const distribution = new aws_cloudfront.Distribution(this, "CloudFrontDistribution", {
      defaultBehavior: {
        origin: s3Origin,
        edgeLambdas: [
          {
            functionVersion: checkAuthEdge.edgeFunction.latestVersion,
            eventType: aws_cloudfront.LambdaEdgeEventType.VIEWER_REQUEST,
          },
          // {
          //   functionVersion: nextCompatibilityVersion,
          //   eventType: aws_cloudfront.LambdaEdgeEventType.ORIGIN_REQUEST,
          // },
        ],
        viewerProtocolPolicy: aws_cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        // responseHeadersPolicy: responseHeaderPolicy,
      },
      additionalBehaviors: {
        "/cookie": {
          origin: s3Origin,
          edgeLambdas: [
            {
              functionVersion: setCookieEdge.edgeFunction.latestVersion,
              eventType: aws_cloudfront.LambdaEdgeEventType.VIEWER_REQUEST,
            },
          ],
          viewerProtocolPolicy: aws_cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        },
        "/expire-cookie": {
          origin: s3Origin,
          edgeLambdas: [
            {
              functionVersion: expireCookieEdge.edgeFunction.latestVersion,
              eventType: aws_cloudfront.LambdaEdgeEventType.VIEWER_REQUEST,
            },
          ],
          viewerProtocolPolicy: aws_cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        },
        "/redirect/*": {
          origin: s3Origin,
          edgeLambdas: [
            {
              functionVersion: redirectEdge.edgeFunction.latestVersion,
              eventType: aws_cloudfront.LambdaEdgeEventType.VIEWER_REQUEST,
            },
          ],
          viewerProtocolPolicy: aws_cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        },
      },
      defaultRootObject: "index.html",
      certificate,
      domainNames: [route53RecordName],
      sslSupportMethod: aws_cloudfront.SSLMethod.SNI,
      minimumProtocolVersion: aws_cloudfront.SecurityPolicyProtocol.TLS_V1_2_2021,
    });

    new aws_route53.ARecord(this, "ARecord", {
      zone: hostedZone,
      recordName: route53RecordName,
      target: aws_route53.RecordTarget.fromAlias(new aws_route53_targets.CloudFrontTarget(distribution)),
    });
  }
}
