const path = require("path");
const marked = require("marked");
const nunjucks = require("nunjucks");
const axios = require("axios");
const md5 = require("crypto-js/md5");
const sha1 = require("crypto-js/sha1");

module.exports = class extends think.Controller {
  async __before() {
    this.THEME_PATH = path.join(think.ROOT_PATH, "www", "theme", "default");

    // 传入所需函数
    // this.assign("foo", {
    //   min(list) {
    //     return Math.min.apply(Math, list);
    //   },
    //   max(list) {
    //     return Math.max.apply(Math, list);
    //   }
    // });

    // url路径
    this.assign("currentPath", this.ctx.path);
    this.assign("activePath", this.ctx.path);

    // 配置变量
    let options = {};
    const originOptions = await this.model("options").getAllOptions();
    for (let item of originOptions) {
      options[item.key] = item.value;
    }
    options.wechat_enabled = !!Number(options.wechat_enabled);
    this.assign("options", options);

    // 导航
    const nav = await this.model("nav").getAllNav();
    this.assign("navigation", nav.filter(item => item.type == 0));
    this.assign("subNavigation", nav.filter(item => item.type == 1));

    // 侧边栏
    let sidebar = "";
    let ptype = "";

    if (this.ctx.path === "/") {
      ptype = "index";
    } else if (this.ctx.path.startsWith("/cate")) {
      ptype = "cate";
    } else if (this.ctx.path.startsWith("/tag")) {
      ptype = "tag";
    } else if (this.ctx.path.startsWith("/page")) {
      ptype = "page";
    } else if (this.ctx.path.startsWith("/search")) {
      ptype = "search";
    }

    const widgetList = await this.model("sidebar").getSidebar(ptype);

    for (let item of widgetList) {
      const options = {
        widget_title: item.title
      };
      const self_custom_style = item.self_custom_style
        ? `<style>${item.self_custom_style}</style>`
        : "";
      const widget_custom_style = item.widget_custom_style
        ? `<style>${item.widget_custom_style}</style>`
        : "";
      const self_custom_script = item.self_custom_script
        ? `<script>${item.self_custom_script}</script>`
        : "";
      const widget_custom_script = item.widget_custom_script
        ? `<script>${item.widget_custom_script}</script>`
        : "";
      switch (item.widget_mark) {
        case "WIDGET_TAG":
          options.tagList = await this.model("tag").getTagList();
          break;
        case "WIDGET_COMMENT":
          const recentCommentList = await this.model("comment").getRecentList();
          options.recentCommentList = await this.model(
            "comment"
          ).getRecentList();
          break;
      }

      sidebar +=
        nunjucks.renderString(item.widget_content, options) +
        widget_custom_style +
        self_custom_style +
        widget_custom_script +
        self_custom_script;
    }

    this.assign("sidebar", sidebar);

    // 如果微信接入开启
    if (options.wechat_enabled) {
      const wechat_access_token = await this.getWechatAccessToken(options);
      const wechat_js_api_ticket = await this.getWechatJsApiTicket(
        options,
        wechat_access_token
      );
      // 签名
      const url = this.ctx.href;
      const timestamp = new Date()
        .getTime()
        .toString()
        .substr(0, 10);
      const noncestr = md5(timestamp).toString();
      const signOriginal = `jsapi_ticket=${wechat_js_api_ticket}&noncestr=${noncestr}&timestamp=${timestamp}&url=${url}`;
      const signature = sha1(signOriginal).toString();
      options.timestamp = timestamp;
      options.nonceStr = noncestr;
      options.signature = signature;
    }
  }
  async getWechatAccessToken(options) {
    try {
      const wechat_access_token = await this.cache("wechat_access_token");
      if (!think.isEmpty(wechat_access_token)) {
        return wechat_access_token;
      }
      const { status, data } = await axios.get(
        `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${
          options.wechat_appid
        }&secret=${options.wechat_appsecret}`
      );
      if (status.toString().startsWith("20")) {
        //  此处存储access_token一天
        await this.cache("wechat_access_token", data.access_token, {
          timeout: 24 * 60 * 60 * 1000
        });
        return data.access_token;
      }
    } catch (e) {
      this.ctx.status = 500;
      return this.fail(5000, "服务器内部错误！");
    }
  }
  async getWechatJsApiTicket(options, wechat_access_token) {
    try {
      const wechat_js_api_ticket = await this.cache("wechat_js_api_ticket");
      if (!think.isEmpty(wechat_js_api_ticket)) {
        return wechat_js_api_ticket;
      }
      const { status, data } = await axios.get(
        `https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=${wechat_access_token}&type=jsapi`
      );
      if (status.toString().startsWith("20")) {
        if (data.errcode === 0) {
          //  此处存储一天
          await this.cache("wechat_js_api_ticket", data.ticket, {
            timeout: 24 * 60 * 60 * 1000
          });
          return data.ticket;
        }
      }
    } catch (e) {
      this.ctx.status = 500;
      return this.fail(5000, "服务器内部错误！");
    }
  }
  __call() {
    this.ctx.status = 404;
    return this.display(path.join(this.THEME_PATH, "404.njk"));
  }
};
