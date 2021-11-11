import type { ValidatedEventAPIGatewayProxyEvent } from "@libs/apiGateway";
import { formatJSONResponse } from "@libs/apiGateway";
import { middyfy } from "@libs/lambda";

import schema from "./schema";

import Dynamo from "@libs/dynamo";

const handlerObj: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (
  event
) => {
  const dynamo = new Dynamo();
  const putres = await dynamo.putValue("usersTable", {
    id: { S: "123" },
    name: { S: "田中2" },
  });
  console.log(putres);

  const res = await dynamo.select("usersTable", `id = $1`, "123");
  // const res = await dynamo.getValue("usersTable", { id: "123" });

  return formatJSONResponse({
    message: JSON.stringify(res),
    event,
  });
};

export const main = middyfy(handlerObj);
