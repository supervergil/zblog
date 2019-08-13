module.exports = class extends think.Model {
  async findUserByNickName(nick_name) {
    return await this.where({ nick_name }).find();
  }
  async findUserByEmail(email) {
    return await this.where({ email }).find();
  }
  async addUser({ nick_name, email, password }) {
    return await this.add({
      nick_name,
      email,
      password,
      created_date: think.datetime(new Date())
    });
  }
  async getUserByAccount(email) {
    return await this.where({
      email
    }).find();
  }
  async setToken({ id, access_token, token_expired_date }) {
    return await this.where({ id }).update({
      access_token,
      token_expired_date
    });
  }
  async getUserById(id) {
    return await this.where({ id }).find();
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
