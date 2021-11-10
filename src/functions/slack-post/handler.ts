import type { ValidatedEventAPIGatewayProxyEvent } from "@libs/apiGateway";
import { formatJSONResponse } from "@libs/apiGateway";
import { middyfy } from "@libs/lambda";

import schema from "./schema";

import Slack from "@libs/slack";

const hello: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (
  event
) => {
  console.log(process.env.SLACK_ACCESS_TOKEN);

  const slack = new Slack(
    process.env.SLACK_ACCESS_TOKEN,
    process.env.CHANNEL_ID
  );

  // return formatJSONResponse({
  //   message: JSON.stringify("afeasdf"),
  //   event,
  // });
  const res = await slack.postMessage("Lambdaからの送信");

  return formatJSONResponse({
    message: JSON.stringify(res),
    event,
  });
};

export const main = middyfy(hello);
