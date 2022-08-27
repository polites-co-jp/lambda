import type { ValidatedEventAPIGatewayProxyEvent } from "@libs/apiGateway";
import { formatJSONResponse } from "@libs/apiGateway";
import { middyfy } from "@libs/lambda";

import jsforce from "jsforce";
import schema from "./schema";

const sfAuth: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (
  event
) => {
  console.log("Lambda Start");
  const conn = new jsforce.Connection({
    loginUrl: "https://login.salesforce.com", // 本番なら'https://login.salesforce.com'
    // clientId:
    //   "3MVG95mg0lk4batgHEmxZJ_dfO7epl758mljXaVzdRMCiipLLcKsjsdNs5TAEph94Q2y6bvy2waE0zUycvUI9",
    // clientSecret:
    //   "0F67D71BB86BC3E5BD9363BCF72E482C2E76845326B15B17258EF552A28D3BC4",

    clientId:
      "3MVG95mg0lk4batjyxOwX38wIVvLhV1eyk.Tnjd9atS675ZLBI5cgTOdPWweregarrifdrqBKZaFTqiJQL..z",
    clientSecret:
      "927583141F5963CA34EA2DBD1C885F016E47C580E1AF7D9984CD62937AE13B86",

    redirectUri: "https://login.salesforce.com/services/oauth2/success",
  });
  // const username = "dev@polites.co.jp";
  // const password = "gatono01";
  const username = "tslaboagrexuser2@teamspirit.com2";
  const password = "agx_ts_addon@202110";
  conn.login(username, password, (err: any, userInfo: any) => {
    if (!err) {
      // SELECT
      conn.query(
        "SELECT Id, Name FROM Account",
        undefined,
        (err: any, result: any) => {
          if (!err) {
            console.log(result);
          } else {
            console.log(err);
          }
        }
      );
      // INSERT
      conn
        .sobject("Account")
        .create({ Name: "Lambda of jsforce" }, (err: any, result: any) => {
          if (!err) {
            console.log(result);
          } else {
            console.log(err);
          }
        });
    } else {
      console.log(err);
    }
  });
  console.log("Lambda End");
};

export const main = middyfy(sfAuth);
