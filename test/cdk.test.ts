import { App, Stack } from 'aws-cdk-lib';
// import { Template } from 'aws-cdk-lib/assertions';
import { AuthenticatedCdn } from '../src';

const mockApp = new App();
const stack = new Stack(mockApp);
new AuthenticatedCdn(stack, 'testing-stack');
// const template = Template.fromStack(stack);

test('hello', () => {
});