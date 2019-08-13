module.exports = class extends think.Model {
  async removeById(id) {
    return await this.where({ id }).delete();
  }
  async getDetail(id) {
    return await this.where({ id }).find();
  }
  async save(info) {
    return await this.update(info);
  }
  async addRelation(info) {
    return await this.add(info);
  }
};
