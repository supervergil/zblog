module.exports = class extends think.Model {
  async getUserByAccount(account) {
    return await this.where({
      account
    }).find();
  }
  async getUserById(id) {
    return await this.where({
      id
    }).find();
  }
  async modifyPassword(id, password) {
    return await this.update({
      id,
      password
    });
  }
  async save(id, info) {
    return await this.where({ id }).update(info);
  }
};
