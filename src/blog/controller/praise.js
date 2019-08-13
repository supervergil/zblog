module.exports = class extends think.Controller {
  async addPraiseAction() {
    try {
      const user_id = this.post("userId");
      const post_id = this.post("postId");
      await this.model("praise").add({
        user_id,
        post_id
      });
      return this.success(
        await this.model("praise")
          .where({ post_id })
          .count("*")
      );
    } catch (e) {
      this.status = 500;
      return this.fail(5000, "服务器内部错误！");
    }
  }
};
