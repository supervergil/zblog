const sha256 = require("crypto-js/sha256");
const md5 = require("crypto-js/md5");
const nodemailer = require("nodemailer");

const Base = require("./base.js");

module.exports = class extends Base {
  async signinAction() {
    try {
      const account = this.post("account");
      const password = sha256(
        `${this.post("password")}:zblog-${account}`
      ).toString();
      const user = await this.model("register_user").getUserByAccount(account);
      if (think.isEmpty(user)) {
        return this.fail(3000, "当前用户不存在！");
      }
      if (user.status === 0) {
        return this.fail(3000, "该用户已被冻结！");
      }
      if (password !== user.password) {
        return this.fail(3000, "密码错误！");
      }
      const token = md5(
        `${user.id}${Math.random()}${user.password}`
      ).toString();

      const now = new Date();
      const nextMonth = now.setMonth(now.getMonth() + 1);
      const token_expired_date = think.datetime(nextMonth);

      await this.model("register_user").setToken({
        id: user.id,
        access_token: token,
        token_expired_date
      });

      await this.session("user-info", {
        uid: user.id,
        token,
        token_expired_date: nextMonth,
        status: user.status
      });
      return this.success({
        userInfo: {
          id: user.id,
          name: user.nick_name,
          avatar: user.avatar,
          email: user.email
        },
        token
      });
    } catch (e) {
      this.status = 500;
      return this.fail(5000, `服务器内部错误！`);
    }
  }
  async signupAction() {
    try {
      const nick_name = this.post("nick_name");
      const email = this.post("email");
      const password = sha256(
        `${this.post("password")}:zblog-${email}`
      ).toString();

      await this.model("register_user").addUser({
        nick_name,
        email,
        password
      });

      return this.success();
    } catch (e) {
      this.status = 500;
      return this.fail(5000, `服务器内部错误！`);
    }
  }
  async getValidCodeAction() {
    try {
      const signalCode = this.post("signalCode");
      const email = this.post("email");
      const validCode = Math.ceil(Math.random().toFixed(8) * Math.pow(10, 8))
        .toString()
        .padStart(8, "0");

      const opts = await this.model("options").getEmailOptions();
      const emailOptions = {};
      for (let item of opts) {
        emailOptions[item.key] = item.value;
      }
      emailOptions.email_enabled = !!Number(emailOptions.email_enabled);
      emailOptions.email_secure = !!Number(emailOptions.email_secure);

      const template = await this.model("email_template").getValidCode();

      try {
        const transporter = nodemailer.createTransport({
          host: emailOptions.email_host,
          port: emailOptions.email_port,
          secure: emailOptions.email_secure,
          auth: {
            user: emailOptions.email_user,
            pass: emailOptions.email_password
          }
        });
        const info = await transporter.sendMail({
          from: `"${emailOptions.email_show_name}" <${
            emailOptions.email_user
          }>`,
          to: email,
          subject: template.subject,
          text: template.text.replace("${validCode}", validCode),
          html: template.html.replace("${validCode}", validCode)
        });

        await this.cache(`email-${signalCode}-code`, validCode, {
          timeout: 10 * 60 * 1000
        });

        return this.success();
      } catch (e) {
        return this.fail(3000, "邮件发送失败，请稍后再试");
      }
    } catch (e) {
      this.status = 500;
      return this.fail(5000, `服务器内部错误！`);
    }
  }
};
