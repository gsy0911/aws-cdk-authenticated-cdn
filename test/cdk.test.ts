import { App, Stack } from "aws-cdk-lib";
// import { Template } from 'aws-cdk-lib/assertions';
import { AuthenticatedCdn } from "../src";

test("synth", () => {
  const mockApp = new App();
  const stack = new Stack(mockApp, "test-stack", {
    env: { region: "ap-northeast-1" },
  });
  new AuthenticatedCdn(stack, "test-authenticated-cdn", {
    s3BucketName: "example-bucket",
    route53DomainName: "example.com",
    route53RecordName: "app.example.com",
  });
  // const template = Template.fromStack(stack);
  mockApp.synth();
});
