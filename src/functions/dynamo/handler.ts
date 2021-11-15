import type { ValidatedEventAPIGatewayProxyEvent } from "@libs/apiGateway";
import { formatJSONResponse } from "@libs/apiGateway";
import { middyfy } from "@libs/lambda";

import schema from "./schema";

import Dynamo from "@libs/dynamo";

const handlerObj: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (
  event
) => {
  try {
    const dynamo = new Dynamo();
    const putres = await dynamo.putValue("chatUsersTable", {
      username: "idname0002",
      sf_client_id: "とーく22222",
      sf_oauth_seq_key: "sf_oauth_seq_keysf_oauth_seq_keysf_oauth_seq_key",
    });
    console.log("putres----------");
    console.log(putres);

    // const res2 = await dynamo.update(
    //   "chatUsersTable",
    //   { username: "idname" },
    //   `set slack_token=$1`,
    //   ["changed-token"]
    // );
    // const res = await dynamo.select(
    //   "chatUsersTable",
    //   `username = $1`,
    //   "idname"
    // );

    const res2 = await dynamo.update(
      "chatUsersTable",
      { username: "idname0002" },
      { sf_client_id: "sf_client22222", slack_token: "gundam" }
    );
    console.log(res2);

    const res = await dynamo.getValue("chatUsersTable", {
      username: "idname0002",
    });

    return formatJSONResponse({
      message: JSON.stringify(res),
      event,
    });
  } catch (e) {
    console.log(e);
    throw e;
    return formatJSONResponse({
      message: JSON.stringify(e),
      event,
    });
  }
};

export const main = middyfy(handlerObj);
