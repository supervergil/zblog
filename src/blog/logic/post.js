module.exports = class extends think.Logic {
  async detailAction() {
    this.allowMethods = "get";
    const result = await this.model("post").findPost(this.get("post"));
    if (think.isEmpty(result)) {
      return this.action("404", "index");
    }
  }
};
