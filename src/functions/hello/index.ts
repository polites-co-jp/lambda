// import schema from "./schema";
import { handlerPath } from "@libs/handlerResolver";

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,

  events: [
    // {
    //   cloudwatchLog: {
    //     logGroup: "/aws/lambda/hello",
    //     filter: "Info",
    //   },
    // },
    {
      //       - http:
      //           path: hello
      //           method: get

      http: {
        method: "get",
        path: "hello",
        // request: {
        //   schema: {
        //     "application/json": schema,
        //   },
        // },
      },
    },
  ],
};
