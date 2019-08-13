module.exports = class extends think.Model {
  async getAllOptions() {
    return await this.select();
  }
};
