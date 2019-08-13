module.exports = class extends think.Logic {
  async detailAction() {
    this.allowMethods = "get";
    const result = await this.model("page").findPage(this.get("page"));
    console.log(result);
    if (think.isEmpty(result)) {
      return this.action("404", "index");
    }
  }
};
