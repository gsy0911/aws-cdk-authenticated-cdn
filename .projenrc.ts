import { awscdk } from 'projen';

const cdkVersion = '2.131.0';

const project = new awscdk.AwsCdkTypeScriptApp({
  authorName: 'gsy0911',
  cdkVersion,
  defaultReleaseBranch: 'main',
  name: '@mdrskn/aws-cdk-authenticated-cdn',
  repository: 'https://github.com/gsy0911/aws-cdk-authenticated-cdn.git',
  keywords: ['cdk'],
  license: 'Apache-2.0',
  projenrcTs: true,
  deps: [],
  stability: 'experimental',
  appEntrypoint: 'index.ts',
  // description: undefined,  /* The description is just a string that helps people understand the purpose of the package. */
  // devDeps: [],             /* Build dependencies for this module. */
  // packageName: undefined,  /* The "name" in package.json. */
});
project.synth();