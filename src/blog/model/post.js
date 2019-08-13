module.exports = class extends think.Model {
  async findPost(pathname) {
    return await this.where({
      status: 1,
      is_del: 0,
      pathname
    }).find();
  }
  async findPostById(id) {
    return await this.where({
      status: 1,
      is_del: 0,
      id
    }).find();
  }
  async getPostDetail(pathname) {
    const result = await this.alias("a")
      .join({
        table: "post_category",
        as: "c",
        on: ["id", "post_id"]
      })
      .join({
        table: "category",
        as: "d",
        on: ["c.category_id", "id"]
      })
      .join({
        table: "author",
        as: "e",
        on: ["author_id", "id"]
      })
      .join({
        table: "praise",
        as: "f",
        on: ["id", "post_id"]
      })
      .field(
        `
        a.id,
        a.title,
        a.created_date,
        a.read_count,
        a.comment_count,
        a.summary,
        a.cover_url,
        a.richtext,
        a.pathname as article_path,
        a.allow_comment,
        a.type,
        a.reproduce_url,
        a.reproduce_name,
        a.pathname,
        a.reproduce_richtext,
        d.pathname as cate_path,
        d.name as cate_name,
        e.avatar_url as author_avatar,
        e.name as author_name,
        e.description as author_description,
        e.about_url as author_index,
        e.wechat_qrcode,
        e.reward_title,
        e.reward_qrcode,
        count(f.id) as like_count
        `
      )
      .where({
        "a.pathname": pathname,
        "a.is_del": 0,
        "a.status": 1,
        "d.is_del": 0
      })
      .find();

    const tags = await this.alias("a")
      .join({
        table: "post_tag",
        as: "c",
        on: ["id", "post_id"]
      })
      .join({
        table: "tag",
        as: "d",
        on: ["c.tag_id", "id"]
      })
      .field(
        `
        d.name,
        d.pathname
        `
      )
      .where({
        "a.pathname": pathname,
        "d.is_del": 0
      })
      .select();
    const prevPost = await this.where({
      created_date: ["<", result.created_date],
      is_del: 0,
      status: 1
    })
      .order({ created_date: "desc" })
      .find();
    const nextPost = await this.where({
      created_date: [">", result.created_date],
      is_del: 0,
      status: 1
    })
      .order({ created_date: "asc" })
      .find();
    result.created_date = think.datetime(result.created_date, "YYYY年MM月DD日");
    result.tags = tags;
    result.prevPost = prevPost;
    result.nextPost = nextPost;

    // 阅读量加1
    this.where({ id: result.id }).increment("read_count", 1);

    return result;
  }
  async getPostList(current) {
    const result = await this.alias("a")
      .join({
        table: "author",
        as: "c",
        on: ["author_id", "id"]
      })
      .join({
        table: "post_category",
        as: "d",
        on: ["id", "post_id"]
      })
      .join({
        table: "category",
        as: "e",
        on: ["d.category_id", "id"]
      })
      .field(
        `
        a.id,
        a.title,
        a.created_date,
        a.read_count,
        a.summary,
        a.cover_url,
        a.pathname as article_path,
        a.type,
        a.reproduce_url,
        a.reproduce_name,
        c.name as author_name,
        e.name as cate_name,
        e.pathname as cate_path
        `
      )
      .where({
        "a.is_del": 0,
        "e.is_del": 0,
        "a.status": 1
      })
      .page(current, 10)
      .order({ "a.created_date": "desc" })
      .countSelect();
    if (result.data.length === 0) {
      return result;
    }
    result.data = result.data.map(item => {
      return {
        ...item,
        created_date: think.datetime(item.created_date, "YYYY年MM月DD日")
      };
    });

    const postPathList = result.data.map(item => {
      item.comment_count = 0;
      return `/post/${item.article_path}.html`;
    });

    const postCountList = await this.model("comment")
      .where({
        pathname: ["IN", postPathList],
        is_del: 0
      })
      .group("pathname")
      .field(
        `
          pathname,
          count('pathname') as count
        `
      )
      .select();

    for (let item of postCountList) {
      for (let pItem of result.data) {
        if (item.pathname === `/post/${pItem.article_path}.html`) {
          pItem.comment_count = item.count;
        }
      }
    }

    return result;
  }
  async getPostListByTag(current, pathname) {
    const result = await this.alias("a")
      .join({
        table: "author",
        as: "c",
        on: ["author_id", "id"]
      })
      .join({
        table: "post_category",
        as: "d",
        on: ["id", "post_id"]
      })
      .join({
        table: "category",
        as: "e",
        on: ["d.category_id", "id"]
      })
      .join({
        table: "post_tag",
        as: "f",
        on: ["id", "post_id"]
      })
      .join({
        table: "tag",
        as: "g",
        on: ["f.tag_id", "id"]
      })
      .field(
        `
        a.id,
        a.title,
        a.created_date,
        a.read_count,
        a.comment_count,
        a.summary,
        a.cover_url,
        a.pathname as article_path,
        a.type,
        a.reproduce_url,
        a.reproduce_name,
        c.name as author_name,
        e.name as cate_name,
        e.pathname as cate_path
        `
      )
      .where({
        "a.is_del": 0,
        "a.status": 1,
        "e.is_del": 0,
        "g.pathname": pathname
      })
      .page(current, 10)
      .order({ "a.created_date": "desc" })
      .countSelect();
    if (result.data.length === 0) {
      return result;
    }
    result.data = result.data.map(item => {
      return {
        ...item,
        created_date: think.datetime(item.created_date, "YYYY年MM月DD日")
      };
    });

    const postPathList = result.data.map(item => {
      item.comment_count = 0;
      return `/post/${item.article_path}.html`;
    });

    const postCountList = await this.model("comment")
      .where({
        pathname: ["IN", postPathList],
        is_del: 0
      })
      .group("pathname")
      .field(
        `
          pathname,
          count('pathname') as count
        `
      )
      .select();

    for (let item of postCountList) {
      for (let pItem of result.data) {
        if (item.pathname === `/post/${pItem.article_path}.html`) {
          pItem.comment_count = item.count;
        }
      }
    }

    return result;
  }
  async getPostListByCate(current, pathname) {
    const result = await this.alias("a")
      .join({
        table: "author",
        as: "c",
        on: ["author_id", "id"]
      })
      .join({
        table: "post_category",
        as: "d",
        on: ["id", "post_id"]
      })
      .join({
        table: "category",
        as: "e",
        on: ["d.category_id", "id"]
      })
      .field(
        `
        a.id,
        a.title,
        a.created_date,
        a.read_count,
        a.comment_count,
        a.summary,
        a.cover_url,
        a.pathname as article_path,
        a.type,
        a.reproduce_url,
        a.reproduce_name,
        c.name as author_name,
        e.name as cate_name,
        e.pathname as cate_path
        `
      )
      .where({
        "a.is_del": 0,
        "a.status": 1,
        "e.is_del": 0,
        "e.pathname": pathname
      })
      .page(current, 10)
      .order({ "a.created_date": "desc" })
      .countSelect();
    if (result.data.length === 0) {
      return result;
    }
    result.data = result.data.map(item => {
      return {
        ...item,
        created_date: think.datetime(item.created_date, "YYYY年MM月DD日")
      };
    });
    const postPathList = result.data.map(item => {
      item.comment_count = 0;
      return `/post/${item.article_path}.html`;
    });

    const postCountList = await this.model("comment")
      .where({
        pathname: ["IN", postPathList],
        is_del: 0
      })
      .group("pathname")
      .field(
        `
          pathname,
          count('pathname') as count
        `
      )
      .select();

    for (let item of postCountList) {
      for (let pItem of result.data) {
        if (item.pathname === `/post/${pItem.article_path}.html`) {
          pItem.comment_count = item.count;
        }
      }
    }

    return result;
  }
  async getPostListBySearch(current, keyword) {
    const result = await this.alias("a")
      .join({
        table: "author",
        as: "c",
        on: ["author_id", "id"]
      })
      .join({
        table: "post_category",
        as: "d",
        on: ["id", "post_id"]
      })
      .join({
        table: "category",
        as: "e",
        on: ["d.category_id", "id"]
      })
      .field(
        `
        a.id,
        a.title,
        a.created_date,
        a.read_count,
        a.comment_count,
        a.summary,
        a.cover_url,
        a.pathname as article_path,
        a.type,
        a.reproduce_url,
        a.reproduce_name,
        c.name as author_name,
        e.name as cate_name,
        e.pathname as cate_path
        `
      )
      .where({
        "a.is_del": 0,
        "a.status": 1,
        "a.title|a.richtext": ["like", `%${keyword}%`],
        "e.is_del": 0
      })
      .page(current, 10)
      .order({ "a.created_date": "desc" })
      .countSelect();

    if (result.data.length === 0) {
      return result;
    }

    result.data = result.data.map(item => {
      return {
        ...item,
        created_date: think.datetime(item.created_date, "YYYY年MM月DD日")
      };
    });

    const postPathList = result.data.map(item => {
      item.comment_count = 0;
      return `/post/${item.article_path}.html`;
    });

    const postCountList = await this.model("comment")
      .where({
        pathname: ["IN", postPathList],
        is_del: 0
      })
      .group("pathname")
      .field(
        `
            pathname,
            count('pathname') as count
          `
      )
      .select();

    for (let item of postCountList) {
      for (let pItem of result.data) {
        if (item.pathname === `/post/${pItem.article_path}.html`) {
          pItem.comment_count = item.count;
        }
      }
    }

    return result;
  }
};
