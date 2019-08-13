const Base = require("./base.js");

module.exports = class extends Base {
  signinAction() {
    this.allowMethods = "post";

    let rules = {
      account: {
        required: true
      },
      password: {
        required: true
      }
    };
    let flag = this.validate(rules);
    if (!flag) {
      return this.fail(3000, JSON.stringify(this.validateErrors.data));
    }
  }
  async signupAction() {
    this.allowMethods = "post";

    let rules = {
      nick_name: {
        required: true
      },
      email: {
        required: true
      },
      password: {
        required: true
      },
      validCode: {
        required: true
      },
      signalCode: {
        required: true
      }
    };
    let flag = this.validate(rules);
    if (!flag) {
      return this.fail(3000, JSON.stringify(this.validateErrors.data));
    }

    const email = this.post("email");
    const nick_name = this.post("nick_name");
    const validCode = this.post("validCode");
    const signalCode = this.post("signalCode");

    const user = await this.model("register_user").findUserByNickName(
      nick_name
    );
    const user2 = await this.model("register_user").findUserByEmail(email);

    if (!think.isEmpty(user)) {
      return this.fail(3000, "用户昵称已存在，请重新取名！");
    }

    if (!think.isEmpty(user2)) {
      return this.fail(3000, "该邮箱已被注册过，请更换邮箱！");
    }

    if (validCode !== (await this.cache(`email-${signalCode}-code`))) {
      return this.fail(3000, "验证码不正确！");
    }
  }
  async getValidCodeAction() {
    this.allowMethods = "post";

    let rules = {
      email: {
        required: true
      },
      signalCode: {
        required: true
      }
    };
    let flag = this.validate(rules);
    if (!flag) {
      return this.fail(3000, JSON.stringify(this.validateErrors.data));
    }

    const opts = await this.model("options").getEmailOptions();
    const emailOptions = {};
    for (let item of opts) {
      emailOptions[item.key] = item.value;
    }
    emailOptions.email_enabled = !!Number(emailOptions.email_enabled);
    if (!emailOptions.email_enabled) {
      return this.fail(3000, "该系统尚未开启邮箱服务，请联系管理员解决！");
    }
    const email = this.post("email");
    const user = await this.model("register_user").findUserByEmail(email);
    if (!think.isEmpty(user)) {
      return this.fail(3000, "该邮箱已被注册过，请更换邮箱！");
    }
  }
};
