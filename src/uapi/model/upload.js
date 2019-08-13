module.exports = class extends think.Model {
  async addUpload(info) {
    return await this.add(info);
  }
  async getList(current, type) {
    const condition = { is_del: 0 };
    if (type != -1) {
      condition.type = type;
    }
    return await this.where(condition)
      .order({
        created_date: "DESC"
      })
      .page(current, 10)
      .countSelect();
  }
  async getPreviewList(current, contentType) {
    let condition = { is_del: 0 };
    if (contentType === "attachment") {
      condition.extension = [
        `notlike`,
        [`%image%`, `%video%`, `%audio%`],
        "and"
      ];
    } else {
      condition.extension = ["like", `%${contentType}%`];
    }
    return await this.where(condition)
      .order({
        created_date: "DESC"
      })
      .page(current, 24)
      .countSelect();
  }
  async removeById(id) {
    await this.where({ id }).update({ is_del: 1 });
  }
};
