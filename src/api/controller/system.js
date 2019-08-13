const Base = require("./base.js");

module.exports = class extends Base {
  async getGeneralAction() {
    try {
      const options = await this.model("options").getGeneralOptions();
      return this.success(options);
    } catch (e) {
      this.status = 500;
      return this.fail(5000, `服务器内部错误！`);
    }
  }
  async saveGeneralAction() {
    try {
      const options = await this.model("options").saveAllOptions(
        this.post("options")
      );
      return this.success();
    } catch (e) {
      this.status = 500;
      return this.fail(5000, `服务器内部错误！`);
    }
  }
  async getUploadAction() {
    try {
      const options = await this.model("options").getUploadOptions();
      return this.success(options);
    } catch (e) {
      this.status = 500;
      return this.fail(5000, `服务器内部错误！`);
    }
  }
  async saveUploadAction() {
    try {
      const options = await this.model("options").saveAllOptions(
        this.post("options")
      );
      return this.success();
    } catch (e) {
      this.status = 500;
      return this.fail(5000, `服务器内部错误！`);
    }
  }
  async getWechatAction() {
    try {
      const options = await this.model("options").getWechatOptions();
      return this.success(options);
    } catch (e) {
      this.status = 500;
      return this.fail(5000, `服务器内部错误！`);
    }
  }
  async saveWechatAction() {
    try {
      const options = await this.model("options").saveAllOptions(
        this.post("options")
      );
      return this.success();
    } catch (e) {
      this.status = 500;
      return this.fail(5000, `服务器内部错误！`);
    }
  }
  async getEmailAction() {
    try {
      const options = await this.model("options").getEmailOptions();
      return this.success(options);
    } catch (e) {
      this.status = 500;
      return this.fail(5000, `服务器内部错误！`);
    }
  }
  async saveEmailAction() {
    try {
      const options = await this.model("options").saveAllOptions(
        this.post("options")
      );
      return this.success();
    } catch (e) {
      this.status = 500;
      return this.fail(5000, `服务器内部错误！`);
    }
  }
  async getEmailTemplateListAction() {
    try {
      return this.success(await this.model("email_template").getList());
    } catch (e) {
      this.status = 500;
      return this.fail(5000, `服务器内部错误！`);
    }
  }
  async getEmailTemplateDetailAction() {
    try {
      return this.success(
        await this.model("email_template").getDetailById(this.get("id"))
      );
    } catch (e) {
      this.status = 500;
      return this.fail(5000, `服务器内部错误！`);
    }
  }

  async saveEmailTemplateAction() {
    try {
      await this.model("email_template").save({
        id: this.post("id"),
        subject: this.post("subject"),
        text: this.post("text"),
        html: this.post("html")
      });
      return this.success();
    } catch (e) {
      this.status = 500;
      return this.fail(5000, `服务器内部错误！`);
    }
  }

  async getCalculatorAction() {
    try {
      const options = await this.model("options").getCalculatorOptions();
      return this.success(options);
    } catch (e) {
      this.status = 500;
      return this.fail(5000, `服务器内部错误！`);
    }
  }

  async saveCalculatorAction() {
    try {
      const options = await this.model("options").saveAllOptions(
        this.post("options")
      );
      return this.success();
    } catch (e) {
      this.status = 500;
      return this.fail(5000, `服务器内部错误！`);
    }
  }

  async getCustomAction() {
    try {
      const options = await this.model("options").getCustomOptions();
      return this.success(options);
    } catch (e) {
      this.status = 500;
      return this.fail(5000, `服务器内部错误！`);
    }
  }

  async saveCustomAction() {
    try {
      const options = await this.model("options").saveAllOptions(
        this.post("options")
      );
      return this.success();
    } catch (e) {
      this.status = 500;
      return this.fail(5000, `服务器内部错误！`);
    }
  }
};
