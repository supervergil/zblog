module.exports = class extends think.Model {
  async addRelation(post_id, tags) {
    return await this.addMany(
      tags.map(item => {
        return {
          post_id,
          tag_id: item
        };
      })
    );
  }
  async removeByPostId(post_id) {
    return await this.where({ post_id }).delete();
  }
  async getTagListByPostId(post_id) {
    return await this.where({ post_id }).select();
  }
};
