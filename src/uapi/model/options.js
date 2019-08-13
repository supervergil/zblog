module.exports = class extends think.Model {
  async getAllOptions() {
    return await this.select();
  }
  async getGeneralOptions() {
    return await this.where({
      type: 0
    }).select();
  }
  async getUploadOptions() {
    return await this.where({
      type: 1
    }).select();
  }
  async getEmailOptions() {
    return await this.where({
      type: 2
    }).select();
  }
  async saveAllOptions(options) {
    return await this.updateMany(options);
  }
};
