module.exports = class extends think.Model {
  async getList() {
    return await this.where({
      is_del: 0
    })
      .order({
        is_system: "desc"
      })
      .select();
  }
  async getDetail(id) {
    return await this.where({
      id,
      is_del: 0
    }).find();
  }
  async removeById(id) {
    return await this.where({ id }).update({
      is_del: 1
    });
  }
  async addTool(info) {
    return await this.add(info);
  }
  async save(info) {
    return await this.update(info);
  }
  async getToolByPID(id) {
    const result = await this.model("ptype")
      .alias("a")
      .join({
        join: "left",
        table: "ptype_sidebar",
        as: "c",
        on: ["id", "ptype_id"]
      })
      .join({
        join: "right",
        table: "sidebar",
        as: "d",
        on: ["c.sidebar_id", "id"]
      })
      .field(
        `
        c.id,
        c.title,
        c.custom_style as self_custom_style,
        c.custom_script as self_custom_script,
        c.index,
        d.name as widget_name,
        d.content as widget_content,
        d.mark as widget_mark,
        d.custom_style as widget_custom_style,
        d.custom_script as widget_custom_script
        `
      )
      .where({
        "a.id": id,
        "d.is_del": 0
      })
      .order({
        "c.index": "asc"
      })
      .select();

    return result;
  }
};
