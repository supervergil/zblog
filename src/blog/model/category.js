module.exports = class extends think.Model {
  async getCateDetailByPathname(pathname) {
    return await this.where({
      pathname,
      is_del: 0
    }).find();
  }
};
