module.exports = class extends think.Model {
  async getBasicLayoutOptions() {
    return await this.where({ type: 0 }).select();
  }
};
