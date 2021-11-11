import * as AWS from "aws-sdk";
import { DynamoDB } from "aws-sdk";

const dynamoDB = new AWS.DynamoDB.DocumentClient({ apiVersion: "2012-08-10" });

/**
 * DynamoDbアクセサ
 */
export default class Dynamo {
  /**
   * DBクライアント
   */
  private client: DynamoDB;

  /**
   * コンストラクタ
   */
  constructor() {
    //  クライアントの初期化
    this.client = process.env.IS_OFFLINE
      ? new DynamoDB({
          region: "localhost",
          endpoint: "http://localhost:8123",
          apiVersion: "2012-08-10",
        })
      : new DynamoDB({ apiVersion: "2012-08-10" });
  }

  /**
   * 値を登録
   * @param tableName
   * @param item
   */
  async putValue(tableName, item) {
    return new Promise((resolve, reject) => {
      this.client.putItem(
        { TableName: tableName, Item: item },
        function (err, data) {
          if (err) {
            return reject(err);
          } else {
            return resolve(data);
          }
        }
      );
    });
  }

  /**
   * 値取得
   * @param tableName
   * @returns
   */
  async getValue(tableName, key) {
    return new Promise((resolve, reject) => {
      this.client.getItem(
        {
          TableName: tableName,
          Key: key,
          ProjectionExpression: "ATTRIBUTE_NAME",
        },
        function (err, data) {
          if (err) {
            return reject(err);
          } else {
            return resolve(data);
          }
        }
      );
    });
  }

  /**
   * ドキュメントクエリの実行
   * @param tableName
   * @param query
   */
  async select(tableName, where, param) {
    const documentClient = new AWS.DynamoDB.DocumentClient();

    const tmpParamKey = where
      .split("$")
      .map((v) =>
        v
          .split("=")
          .map((v) => v.split(" "))
          .flat()
          .filter((v) => !!v)
      )
      .map((v) => v[v.length - 1]);
    const paramKeys = {};
    let wherePhrase = where;

    tmpParamKey.slice(0, tmpParamKey.length - 1).forEach((key, idx) => {
      paramKeys[`:${key}`] = [param].flat()[idx];
      wherePhrase = wherePhrase.replace(`$${idx + 1}`, `:${key}`);
    });

    return new Promise(async (resolve, reject) => {
      const queryParam = {
        TableName: tableName,
        KeyConditionExpression: wherePhrase, //"id = :id",
        ExpressionAttributeValues: paramKeys,
      };

      const data = await documentClient
        .query(queryParam)
        .promise()
        .catch((err) => {
          console.error(JSON.stringify(err));
        });

      return resolve(data);
    });
  }
}
