module.exports = class extends think.Model {
  async getList() {
    return await this.select();
  }
};
