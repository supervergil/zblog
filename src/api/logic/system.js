const Base = require("./base.js");

module.exports = class extends Base {
  getGeneralAction() {
    this.allowMethods = "get";
  }
  saveGeneralAction() {
    this.allowMethods = "post";
  }
  getUploadAction() {
    this.allowMethods = "get";
  }
  saveUploadAction() {
    this.allowMethods = "post";
  }
  getWechatAction() {
    this.allowMethods = "get";
  }
  saveWechatAction() {
    this.allowMethods = "post";
  }
  getEmailAction() {
    this.allowMethods = "get";
  }
  saveEmailAction() {
    this.allowMethods = "post";
  }
  getEmailTemplateListAction() {
    this.allowMethods = "get";
  }
  getEmailTemplateDetailAction() {
    this.allowMethods = "get";
  }
  saveEmailTemplateAction() {
    this.allowMethods = "post";
  }
  getCalculatorAction() {
    this.allowMethods = "get";
  }
  saveCalculatorAction() {
    this.allowMethods = "post";
  }
  getCustomAction() {
    this.allowMethods = "get";
  }
  saveCustomAction() {
    this.allowMethods = "post";
  }
};
