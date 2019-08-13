module.exports = class extends think.Model {
  async getDetail() {
    return await this.where({
      type: 0
    }).select();
  }
  async saveGeneral(options) {
    return await this.updateMany(options);
  }
};
