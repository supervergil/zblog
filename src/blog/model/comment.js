module.exports = class extends think.Model {
  async getListByPathName({ pathname, page }) {
    const adminList = await this.model("author")
      .where("1=1")
      .select();
    const result = await this.alias("a")
      .field(
        `
      a.id,
      a.comment_id,
      a.user_id,
      a.pathname,
      a.markdown,
      a.richtext,
      a.created_date,
      a.is_admin,
      d.nick_name,
      d.avatar,
      e.user_id as reply_user_id,
      e.richtext as reply_content,
      e.is_admin as reply_is_admin,
      f.nick_name as reply_name,
      e.is_del as reply_is_del
      `
      )
      .join({
        table: "register_user",
        as: "d",
        on: ["user_id", "id"]
      })
      .join({
        table: "comment",
        as: "e",
        on: ["comment_id", "id"]
      })
      .join({
        table: "register_user",
        as: "f",
        on: ["e.user_id", "id"]
      })
      .where({
        "a.pathname": pathname,
        "a.is_del": 0
      })
      .order({
        created_date: "DESC"
      })
      .page(page, 10)
      .countSelect();
    result.data = result.data.map(item => {
      if (item.is_admin) {
        const adminInfo = adminList.filter(
          item2 => item2.id === item.user_id
        )[0];
        item.nick_name = adminInfo.name;
        item.avatar = adminInfo.avatar_url;
      }
      if (item.reply_is_admin && item.comment_id) {
        const adminInfo = adminList.filter(
          item2 => item2.id === item.reply_user_id
        )[0];
        item.reply_name = adminInfo.name;
      }
      if (item.reply_is_del) {
        item.reply_content = "该评论已经删除！";
      }
      return item;
    });
    return result;
  }

  async addComment(data) {
    try {
      await this.add(data);
    } catch (e) {
      throw e;
    }
  }

  async removeComment(data) {
    try {
      await this.where({ id: data.id }).update({
        is_del: 1
      });
    } catch (e) {
      throw e;
    }
  }
  async checkComment(id, userId) {
    try {
      const comment = await this.where({
        id
      }).find();
      return comment.user_id === userId;
    } catch (e) {
      throw e;
    }
  }

  async getRecentList() {
    const adminList = await this.model("author").select();
    let result = await this.alias("a")
      .field(
        `
        a.id,
        a.comment_id,
        a.user_id,
        a.pathname,
        a.markdown,
        a.richtext,
        a.created_date,
        a.is_admin,
        d.nick_name,
        d.avatar,
        d.allow_comment,
        d.status,
        e.user_id as reply_user_id,
        e.richtext as reply_content,
        e.is_admin as reply_is_admin,
        f.nick_name as reply_name,
        e.is_del as reply_is_del
        `
      )
      .join({
        table: "register_user",
        as: "d",
        on: ["user_id", "id"]
      })
      .join({
        table: "comment",
        as: "e",
        on: ["comment_id", "id"]
      })
      .join({
        table: "register_user",
        as: "f",
        on: ["e.user_id", "id"]
      })
      .where({
        "a.is_del": 0
      })
      .order({
        created_date: "DESC"
      })
      .limit(5)
      .select();
    if (result.length === 0) {
      return result;
    }
    result = result.map(item => {
      if (item.is_admin) {
        const adminInfo = adminList.filter(
          item2 => item2.id === item.user_id
        )[0];
        item.nick_name = adminInfo.name;
        item.avatar = adminInfo.avatar_url;
      }
      if (item.reply_is_admin && item.comment_id) {
        const adminInfo = adminList.filter(
          item2 => item2.id === item.reply_user_id
        )[0];
        item.reply_name = adminInfo.name;
      }
      if (item.reply_is_del) {
        item.reply_content = "该评论已经删除！";
      }
      return item;
    });

    const pathList = result.map(
      item => item.pathname.match(/^\/(post|page)\/([^/]+)\.html$/i)[2]
    );

    const postList = await this.model("post")
      .where({ pathname: ["IN", pathList], is_del: 0, status: 1 })
      .select();
    const pageList = await this.model("page")
      .where({ pathname: ["IN", pathList], is_del: 0, status: 1 })
      .select();
    result.forEach(item => {
      if (item.pathname.startsWith("/post")) {
        for (let pItem of postList) {
          if (
            item.pathname.match(/^\/(post|page)\/([^/]+)\.html$/i)[2] ===
            pItem.pathname
          ) {
            item.postInfo = {
              title: pItem.title
            };
            break;
          }
        }
      } else if (item.pathname.startsWith("/page")) {
        for (let pItem of pageList) {
          if (
            item.pathname.match(/^\/(post|page)\/([^/]+)\.html$/i)[2] ===
            pItem.pathname
          ) {
            item.postInfo = {
              title: pItem.title
            };
            break;
          }
        }
      }
    });
    return result;
  }
};
