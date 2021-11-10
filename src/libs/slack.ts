import { WebClient } from "@slack/web-api";

/**
 * Slackライブラリ
 */
export default class Slack {
  /**
   * Webクライアント
   */
  private webClient: WebClient;

  /**
   * チャンネルID
   */
  private channelId: string;

  /**
   * コンストラクタ
   * @param accessKey アクセスキー
   * @param channelId チャンネルID
   */
  constructor(accessKey: string, channelId: string) {
    this.channelId = channelId;
    this.webClient = new WebClient(accessKey);
  }

  /**
   * メッセージを送信
   * @param message
   */
  public async postMessage(message) {
    console.log("postMessage");
    const res = await this.webClient.chat.postMessage({
      channel: this.channelId,
      text: message,
    });
    console.log(res);
    return res;
  }
}
