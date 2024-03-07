import * as cdk from 'aws-cdk-lib';
import { AuthenticatedCdn } from './index';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'MyStack');

new AuthenticatedCdn(stack, 'sample');

app.synth();
