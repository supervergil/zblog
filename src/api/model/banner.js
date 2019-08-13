module.exports = class extends think.Model {
  async getList(current) {
    return await this.where({
      is_del: 0
    })
      .order({
        index: "ASC"
      })
      .page(current, 10)
      .countSelect();
  }
  async getDetailById(id) {
    return await this.where({
      id,
      is_del: 0
    }).find();
  }
  async saveBanner(info) {
    await this.update(info);
  }
  async addBanner(info) {
    await this.add(info);
  }
  async removeById(id) {
    await this.where({ id }).update({ is_del: 1 });
  }
  async moveUp(id) {
    const current = await this.where({ id }).find();
    const prev = await this.where({ index: ["<", current.index] })
      .order({ index: "desc" })
      .find();
    if (!think.isEmpty(prev)) {
      await this.updateMany([
        {
          id: current.id,
          index: prev.index
        },
        {
          id: prev.id,
          index: current.index
        }
      ]);
    }
  }
  async moveDown(id) {
    const current = await this.where({ id }).find();
    const next = await this.where({ index: [">", current.index] })
      .order({ index: "asc" })
      .find();
    if (!think.isEmpty(next)) {
      await this.updateMany([
        {
          id: current.id,
          index: next.index
        },
        {
          id: next.id,
          index: current.index
        }
      ]);
    }
  }
};
