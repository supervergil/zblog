const qiniu = require("qiniu");
const fs = require("fs");
const path = require("path");
const rename = think.promisify(fs.rename, fs);
const Base = require("./base.js");

const QINIU_CONF = new qiniu.conf.Config();
const formUploader = new qiniu.form_up.FormUploader(QINIU_CONF);
// 是否使用https域名
// QINIU_CONF.useHttpsDomain = true;
// 上传是否使用cdn加速
QINIU_CONF.useCdnDomain = true;

module.exports = class extends Base {
  async send2QiniuAction() {
    try {
      const file = this.file("file");
      const options = await this.getQiniuOptions();
      if (!options.qiniu_enabled) {
        return this.fail(4000, "请至 ‘系统设置-上传设置’ 中开启七牛云！");
      }
      const MAC = new qiniu.auth.digest.Mac(
        options.qiniu_access_key,
        options.qiniu_secret_key
      );
      const putPolicy = new qiniu.rs.PutPolicy({ scope: options.qiniu_bucket });
      const putExtra = new qiniu.form_up.PutExtra();

      const suffix = file.name.slice(file.name.lastIndexOf("."));
      const fileName = think.uuid("v4");

      await new Promise((resolve, reject) => {
        formUploader.putFile(
          putPolicy.uploadToken(MAC),
          `${fileName}${suffix}`,
          file.path,
          putExtra,
          (err, body, info) => {
            if (err) {
              reject(err);
            } else {
              resolve(body);
            }
          }
        );
      });
      return this.success(`${options.qiniu_domain}/${fileName}${suffix}`);
    } catch (e) {
      this.status = 500;
      return this.fail(5000, `服务器内部错误！`);
    }
  }

  async getQiniuOptions() {
    try {
      const options = {};
      const optionsList = await this.model("options").getUploadOptions();
      for (let item of optionsList) {
        if (item.key === "qiniu_enabled") {
          options[item.key] = !!Number(item.value);
        } else {
          options[item.key] = item.value;
        }
      }
      return options;
    } catch (e) {
      this.status = 500;
      return this.fail(5000, `服务器内部错误！`);
    }
  }
};
