import jsforce from "jsforce";

/**
 * Salesforceオブジェクト
 */
export default class Salesforce {
  /**
   * アプリケーションのクライアントIＤ
   */
  private clientId: string;

  /**
   * アプリケーションのシークレットキー
   */
  private secretKey: string;

  /**
   * コンストラクタ
   * @param clientId
   * @param secretKey
   */
  constructor(clientId: string, secretKey: string) {
    this.clientId = clientId;
    this.secretKey = secretKey;
  }

  /**
   * 接続初期化
   */
  async init() {
    // const oauth2 = new jsforce.OAuth2({
    //   // you can change loginUrl to connect to sandbox or prerelease env.
    //   // loginUrl : 'https://test.salesforce.com',
    //   clientId: "<your Salesforce OAuth2 client ID is here>",
    //   clientSecret: "<your Salesforce OAuth2 client secret is here>",
    //   redirectUri: "<callback URI is here>",
    // });
    // app.get("/oauth2/auth", function (req, res) {
    //   res.redirect(oauth2.getAuthorizationUrl({ scope: "api id web" }));
    // });
    // const oauth2 = new jsforce.OAuth2({
    //   clientId: this.clientId,
    //   clientSecret: this.secretKey,
    //   redirectUri: `http://example.com`,
    // });
    // const conn = new jsforce.Connection({ oauth2: oauth2 });
    // conn.authorize(req.query.code, function (err, userInfo) {
    //   if (err) {
    //     return console.error(err);
    //   }
    //   const conn2 = new jsforce.Connection({
    //     instanceUrl: conn.instanceUrl,
    //     accessToken: conn.accessToken,
    //   });
    //   conn2.identity(function (err, res) {
    //     if (err) {
    //       return console.error(err);
    //     }
    //     console.log("user ID: " + res.user_id);
    //     console.log("organization ID: " + res.organization_id);
    //     console.log("username: " + res.username);
    //     console.log("display name: " + res.display_name);
    //   });
    // });
  }
}
