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
    const userInfo = await this.session("admin-info");
    const accessToken = this.header("access-token");
    const secret = this.header("secret");
    if (think.isEmpty(userInfo)) {
      this.ctx.status = 401;
      return this.fail(4000, "登录失效，请重新登录！");
    } else {
      const { token } = userInfo;
      if (think.isEmpty(token) || token !== accessToken) {
        this.ctx.status = 401;
        return this.fail(4000, "授权失败，请重新登录！");
      } else {
        if (secret !== "ZBLOG") {
          this.ctx.status = 401;
          return this.fail(4000, "授权失败，请重新登录！");
        }
      }
    }

    return true;
  }
};
