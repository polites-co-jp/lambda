import type { ValidatedEventAPIGatewayProxyEvent } from "@libs/apiGateway";
import { formatJSONResponse } from "@libs/apiGateway";
import { middyfy } from "@libs/lambda";

import schema from "./schema";

const chromium = require("chrome-aws-lambda");

const coingeckoCandy: ValidatedEventAPIGatewayProxyEvent<typeof schema> =
  async (event) => {
    // 今日のコインボタン押下
    // document.querySelector("button.today-box").click();

    // let browser = null;
    // let elems = [];

    // try {
    //   browser = await chromium.puppeteer.launch({
    //     args: chromium.args,
    //     defaultViewport: chromium.defaultViewport,
    //     executablePath: await chromium.executablePath,
    //     headless: chromium.headless,
    //   });

    //   let page = await browser.newPage();

    //   await page.goto("https://www.coingecko.com/ja/");
    //   const selector = ".of-ItemLink_header-title";
    //   elems = await page.$$eval(selector, (es) =>
    //     es.map((e) => [e.textContent, e.href])
    //   );
    // } catch (error) {
    //   return context.fail(error);
    // } finally {
    //   if (browser !== null) {
    //     await browser.close();
    //   }
    // }

    // return context.succeed(elems);

    return formatJSONResponse({
      message: `はろわ!!`,
      event,
    });
  };

export const main = middyfy(coingeckoCandy);
