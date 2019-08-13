const Base = require("./base.js");

module.exports = class extends Base {
  getGeneralAction() {
    this.allowMethods = "get";
  }
  saveGeneralAction() {
    this.allowMethods = "post";
  }
  getBannerAction() {
    this.allowMethods = "get";
  }
  getBannerDetailAction() {
    this.allowMethods = "get";
  }
  addBannerAction() {
    this.allowMethods = "post";
  }
  removeBannerAction() {
    this.allowMethods = "post";
  }
  moveUpBannerAction() {
    this.allowMethods = "post";
  }
  moveDownBannerAction() {
    this.allowMethods = "post";
  }
};
