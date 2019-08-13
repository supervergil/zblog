import http from "@/plugins/http";

const post = {
  getList(params) {
    return http("get", "/uapi/post/getList", { params });
  },
  remove(params) {
    return http("post", "/uapi/post/remove", { params });
  },
  add(data) {
    return http("post", "/uapi/post/add", { data });
  },
  getDetail(params) {
    return http("get", "/uapi/post/getDetail", { params });
  },
  save(data) {
    return http("post", "/uapi/post/save", { data });
  }
};

export default post;
