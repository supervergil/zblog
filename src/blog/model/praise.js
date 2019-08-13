module.exports = class extends think.Model {
  async getPraiseByUserAndPost(user_id, post_id) {
    return await this.where({ user_id, post_id }).find();
  }
};
