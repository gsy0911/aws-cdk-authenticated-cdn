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
  deps: [
    'aws-sdk',
    'aws-jwt-verify',
  ],
  stability: 'experimental',
  appEntrypoint: 'index.ts',
  // description: undefined,  /* The description is just a string that helps people understand the purpose of the package. */
  devDeps: [
    '@types/aws-lambda',
    '@types/cookie',
    '@types/fs-extra',
    '@biomejs/biome',
  ],
  eslint: false,
  // packageName: undefined,  /* The "name" in package.json. */
});
project.addTask('format', {
  description: 'format by biome',
  exec: 'npx biome format --write ./src ./test',
});
// Lambda@Edge config contains secrets (clientSecret, nonceSigningSecret)
project.gitignore.exclude('/src/lambda/edge/shared/configuration.json');
project.synth();
