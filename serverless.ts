import type { AWS } from "@serverless/typescript";

import hello from "@functions/hello";
import slackPost from "@functions/slack-post";
import dynamo from "@functions/dynamo";

const serverlessConfiguration: AWS = {
  service: "lambda",
  frameworkVersion: "2",
  plugins: [
    "serverless-esbuild",
    "serverless-dotenv-plugin",
    "serverless-dynamodb-local",
    "serverless-offline",
  ],
  provider: {
    name: "aws",
    runtime: "nodejs14.x",
    region: "ap-northeast-1",
    iam: { role: "arn:aws:iam::834536471981:role/lambda-dev" },
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: "1",
      NODE_OPTIONS: "--enable-source-maps --stack-trace-limit=1000",
    },
    lambdaHashingVersion: "20201221",
    // iamRoleStatements: [
    //   {
    //     Effect: "Allow",
    //     // 許可する処理を設定
    //     Action: ["dynamodb:PutItem", "dynamodb:GetItem"],
    //     // 処理を許可するリソースを設定
    //     Resource:
    //       "arn:aws:dynamodb:${opt:region, self:provider.region}:*:table/usersTable",
    //   },
    // ],
  },
  // import the function via paths
  functions: { hello, slackPost, dynamo },
  package: { individually: true },
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ["aws-sdk"],
      target: "node14",
      define: { "require.resolve": undefined },
      platform: "node",
      concurrency: 10,
    },
    dynamodb: {
      stages: ["dev"],
      start: {
        port: 8123,
        inMemory: true,
        migrate: true,
        seed: false,
      },
    },
  },
  resources: {
    // aws dynamodb create-table
    //   --table-name test
    //   --attribute-definitions '[{"AttributeName": "id", "AttributeType": "S"}]'
    //   --key-schema '[{"AttributeName": "id", "KeyType": "HASH"}]'
    //   --provisioned-throughput '{"ReadCapacityUnits": 5, "WriteCapacityUnits": 5}'

    Resources: {
      // ResourceとしてDynamoDBを設定
      usersTable: {
        Type: "AWS::DynamoDB::Table",
        Properties: {
          TableName: "usersTable",
          // Primary KeyとSort Key(あれば)の型を指定
          AttributeDefinitions: [
            {
              AttributeName: "id",
              AttributeType: "S",
            },
            {
              AttributeName: "name",
              AttributeType: "S",
            },
          ],
          // # キーの種類を指定（ハッシュorレンジキー）
          // ハッシュ＝Primary Key, レンジキー=Sort Key
          KeySchema: [
            {
              //  PrimayKey
              KeyType: "HASH",
              AttributeName: "id",
            },
            {
              //  ソートキー
              KeyType: "RANGE",
              AttributeName: "name",
            },
          ],
          // プロビジョニングするキャパシティーユニットの設定
          ProvisionedThroughput: {
            ReadCapacityUnits: 5,
            WriteCapacityUnits: 5,
          },
        },
      },
    },
  },
};

module.exports = serverlessConfiguration;
