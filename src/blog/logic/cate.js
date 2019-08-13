module.exports = class extends think.Logic {
  async detailAction() {
    this.allowMethods = "get";
  }
};
