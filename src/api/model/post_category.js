module.exports = class extends think.Model {
  async addRelation(post_id, category_id) {
    return await this.add({
      post_id,
      category_id
    });
  }
  async updateRelation(post_id, category_id) {
    return await this.where({
      post_id
    }).update({
      category_id
    });
  }
  async removeByPostId(post_id) {
    return await this.where({ post_id }).delete();
  }
};
