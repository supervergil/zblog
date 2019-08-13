module.exports = class extends think.Model {
  async getValidCode() {
    return await this.where({ mark: "VALID_CODE" }).find();
  }
};
