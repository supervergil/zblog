module.exports = class extends think.Model {
  async getUserById(id) {
    return await this.where({ id }).find();
  }
};
