const path = require("path");
const Base = require("./base.js");

module.exports = class extends Base {
  async indexAction() {
    this.ctx.status = 404;
    return this.display(path.join(this.THEME_PATH, "404.njk"));
  }
};
