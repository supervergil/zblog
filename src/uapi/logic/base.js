const sha256 = require("crypto-js/sha256");
const Consts = require("./consts");

module.exports = class extends think.Logic {
  async __before() {
    // 跳过无需验证的api
    for (let { controller, actions } of Consts.skipAdminCheckList) {
      if (
        this.ctx.controller.endsWith(controller) &&
        actions.includes(this.ctx.action)
      ) {
        return true;
      }
    }

    // 验证token

    const userId = this.header("user-id") || "";
    const accessToken = this.header("access-token") || "";
    const secret = this.header("secret") || "";

    if (secret !== "ZBLOG") {
      this.ctx.status = 401;
      return this.fail(4000, "授权失败，请重新登录！");
    }

    const user = await this.model("register_user").getUserById(userId);

    if (think.isEmpty(user)) {
      this.ctx.status = 401;
      return this.fail(4000, "当前用户不存在！");
    }

    if (user.status != 1) {
      this.ctx.status = 401;
      return this.fail(4000, "当前用户已被冻结！");
    }

    if (user.access_token !== accessToken) {
      this.ctx.status = 401;
      return this.fail(4000, "登录失效，请重新登录！");
    }

    if (new Date(user.token_expired_date).getTime() < new Date().getTime()) {
      this.ctx.status = 401;
      return this.fail(4000, "token已过期，请重新登录！");
    }

    return true;
  }
};
