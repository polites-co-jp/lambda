import type { AWS } from "@serverless/typescript";

import hello from "@functions/hello";
import slackPost from "@functions/slack-post";
import dynamo from "@functions/dynamo";
import sfAuth from "@functions/sf-auth";

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
    //       "arn:aws:dynamodb:${opt:region, self:provider.region}:*:table/chatUsersTable",
    //   },
    // ],
  },
  // import the function via paths
  functions: { hello, slackPost, dynamo, sfAuth },
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
      chatUsersTable: {
        Type: "AWS::DynamoDB::Table",
        Properties: {
          TableName: "chatUsersTable",
          // PrimaryKey:{
          //     AttributeName: "username",
          //     AttributeType: "S",
          //   },
          // },
          // Primary KeyとSort Key(あれば)の型を指定
          AttributeDefinitions: [
            {
              AttributeName: "username",
              AttributeType: "S",
            },
            // {
            //   AttributeName: "email",
            //   AttributeType: "S",
            // },
            // {
            //   AttributeName: "slack_token",
            //   AttributeType: "S",
            // },
            // {
            //   AttributeName: "sf_client_id",
            //   AttributeType: "S",
            // },
            // {
            //   AttributeName: "sf_oauth_seq_key",
            //   AttributeType: "S",
            // },
          ],
          // # キーの種類を指定（ハッシュorレンジキー）
          // ハッシュ＝Primary Key, レンジキー=Sort Key
          KeySchema: [
            {
              //  PrimayKey
              AttributeName: "username",
              KeyType: "HASH",
            },
            // {
            //   AttributeName: "email",
            //   KeyType: "RANGE",
            // },
            // {
            //   AttributeName: "slack_token",
            //   KeyType: "RANGE",
            // },
            // {
            //   AttributeName: "sf_client_id",
            //   KeyType: "RANGE",
            // },
            // {
            //   AttributeName: "sf_oauth_seq_key",
            //   KeyType: "RANGE",
            // },
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
