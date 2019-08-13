module.exports = class extends think.Model {
  async findPage(pathname) {
    return await this.where({
      status: 1,
      is_del: 0,
      pathname
    }).find();
  }
  async findPageById(id) {
    return await this.where({
      status: 1,
      is_del: 0,
      id
    }).find();
  }
  async getPageDetail(pathname) {
    const result = await this.field(
      `
        id,
        title,
        layout,
        created_date,
        meta_keywords,
        meta_description,
        script_list,
        script_custom,
        style_list,
        style_custom,
        cover_url,
        richtext,
        pathname,
        allow_comment
        `
    )
      .where({
        pathname,
        is_del: 0,
        status: 1
      })
      .find();
    return result;
  }
};
