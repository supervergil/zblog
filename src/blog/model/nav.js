module.exports = class extends think.Model {
  async getAllNav() {
    return await this.where({
      is_del: 0
    })
      .order({
        index: "asc"
      })
      .select();
  }
};
