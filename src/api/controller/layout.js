const Base = require("./base.js");

module.exports = class extends Base {
  async getGeneralAction() {
    try {
      return this.success(await this.model("layout").getDetail());
    } catch (e) {
      this.status = 500;
      return this.fail(5000, `服务器内部错误！`);
    }
  }
  async saveGeneralAction() {
    try {
      await this.model("layout").saveGeneral(this.post("options"));
      return this.success();
    } catch (e) {
      this.status = 500;
      return this.fail(5000, `服务器内部错误！`);
    }
  }
  async getBannerAction() {
    try {
      const current = this.get("page") || 1;
      return this.success(await this.model("banner").getList(current));
    } catch (e) {
      this.status = 500;
      return this.fail(5000, `服务器内部错误！`);
    }
  }
  async getBannerDetailAction() {
    try {
      return this.success(
        await this.model("banner").getDetailById(this.get("id"))
      );
    } catch (e) {
      this.status = 500;
      return this.fail(5000, `服务器内部错误！`);
    }
  }
  async saveBannerAction() {
    try {
      await this.model("banner").saveBanner({
        id: this.post("id"),
        title: this.post("title"),
        cover: this.post("cover"),
        url: this.post("url"),
        status: this.post("status")
      });
      return this.success();
    } catch (e) {
      this.status = 500;
      return this.fail(5000, `服务器内部错误！`);
    }
  }
  async addBannerAction() {
    try {
      await this.model("banner").addBanner({
        title: this.post("title"),
        cover: this.post("cover"),
        url: this.post("url"),
        status: this.post("status"),
        index: (await this.model("banner").max("index"))+1
      });
      return this.success();
    } catch (e) {
      this.status = 500;
      return this.fail(5000, `服务器内部错误！`);
    }
  }
  async removeBannerAction() {
    try {
      await this.model("banner").removeById(this.post("id"));
      return this.success();
    } catch (e) {
      this.status = 500;
      return this.fail(5000, `服务器内部错误！`);
    }
  }
  async moveUpBannerAction() {
    try {
      await this.model("banner").moveUp(this.post("id"));
      return this.success();
    } catch (e) {
      this.status = 500;
      return this.fail(5000, `服务器内部错误！`);
    }
  }
  async moveDownBannerAction() {
    try {
      await this.model("banner").moveDown(this.post("id"));
      return this.success();
    } catch (e) {
      this.status = 500;
      return this.fail(5000, `服务器内部错误！`);
    }
  }
};
