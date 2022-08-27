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
  async putValue(tableName: string, item: any) {
    let items = {};
    Object.keys(item).forEach((k) => {
      items[k] = { [this.getValueType(item[k])]: item[k] };
    });
    // console.log(items);

    return new Promise((resolve, reject) => {
      this.client.putItem(
        { TableName: tableName, Item: items },
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
  async getValue(tableName: string, key) {
    let items = {};
    Object.keys(key).forEach((k) => {
      items[k] = { [this.getValueType(key[k])]: key[k] };
    });

    console.log(items);

    const changeResultValue = (val) => {
      let res = {};
      Object.keys(val).forEach((k) => {
        res[k] = Object.keys(val[k]).map((kv) => val[k][kv])[0];
      });
      return res;
    };

    return new Promise((resolve, reject) => {
      this.client.getItem(
        {
          TableName: tableName,
          Key: items,
          // ProjectionExpression: "ATTRIBUTE_NAME",
        },
        function (err, data) {
          if (err) {
            return reject(err);
          } else {
            return resolve(changeResultValue(data.Item ?? {}));
          }
        }
      );
    });
  }

  /**
   * データ更新
   * @param tableName
   * @param key
   * @param updateValues
   */
  async update(tableName: string, key: any, updateValue: any) {
    let items = {};
    Object.keys(key).forEach((k) => {
      items[k] = { [this.getValueType(key[k])]: key[k] };
    });

    let ExpressionAttributeNames = {};
    let ExpressionAttributeValues = {};
    let tmpUpdateExpression = [];

    Object.keys(updateValue).forEach((k, idx) => {
      ExpressionAttributeNames[`#v${idx}`] = k;
      ExpressionAttributeValues[`:v${idx}`] = {
        [this.getValueType(updateValue[k])]: updateValue[k],
      };
      tmpUpdateExpression.push({ sharp: `#v${idx}`, newv: `:v${idx}` });
    });
    const UpdateExpression = `SET ${tmpUpdateExpression
      .map((v) => v.sharp + "=" + v.newv)
      .join(", ")}`;

    console.log(items);

    console.log({
      TableName: tableName,
      Key: items,
      ExpressionAttributeNames,
      ExpressionAttributeValues,
      UpdateExpression,
    });
    return new Promise((resolve, reject) => {
      this.client.updateItem(
        {
          TableName: tableName,
          Key: items,
          ExpressionAttributeNames,
          ExpressionAttributeValues,
          UpdateExpression,
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
   * Dynamo更新
   * @param tableName
   */
  async update2(
    tableName: string,
    whereKey: any,
    setParamPhrase: string,
    param: any[]
  ) {
    const documentClient = new AWS.DynamoDB.DocumentClient();

    const { phrase, paramKeys } = this.createParamElement(
      setParamPhrase,
      param
    );

    var params = {
      TableName: tableName,
      Key: whereKey,
      UpdateExpression: phrase,
      ExpressionAttributeValues: paramKeys,
      ReturnValues: "UPDATED_NEW",
    };

    return new Promise((resolve, reject) => {
      documentClient.update(params, function (err, data) {
        if (err) {
          return reject(err);
        } else {
          return resolve(data);
        }
      });
    });
  }

  /**
   * ドキュメントクエリの実行
   * @param tableName
   * @param query
   */
  async select(tableName: string, where, param) {
    const documentClient = new AWS.DynamoDB.DocumentClient();

    const { phrase, paramKeys } = this.createParamElement(where, param);
    return new Promise(async (resolve, reject) => {
      const queryParam = {
        TableName: tableName,
        KeyConditionExpression: phrase, //"id = :id",
        ExpressionAttributeValues: paramKeys,
      };

      console.log(queryParam);

      const data = await documentClient
        .query(queryParam)
        .promise()
        .catch((err) => {
          console.error(JSON.stringify(err));
        });

      return resolve(data);
    });
  }

  //  Chore ＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝

  /**
   * パラメータの型に応じてDynamoの型文字を返す
   * @param value
   */
  getValueType(value: Number | String | Boolean | Date) {
    switch ((typeof value).toLowerCase()) {
      case "number":
        return "N";
      case "string":
        return "S";
      case "boolean":
        return "BOOL";
      case "object":
        return "S";
      default:
        "S";
    }
  }

  /**
   * paramPhrase句とパラメータからDynamoDbに接続できるフレーズを作成
   * @param paramPhrase
   * @param param
   */
  createParamElement(paramPhrase: string, param: Array<any>) {
    const tmpParamKey = paramPhrase
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
    let phrase = paramPhrase;

    tmpParamKey.slice(0, tmpParamKey.length - 1).forEach((key, idx) => {
      paramKeys[`:${key}`] = [param].flat()[idx];
      phrase = phrase.replace(`$${idx + 1}`, `:${key}`);
    });
    return {
      paramKeys: paramKeys,
      phrase: phrase,
    };
  }
}
