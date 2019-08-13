import http from "@/plugins/http";

const post = {
  getList(params) {
    return http("get", "/api/post/getList", { params });
  },
  remove(data) {
    return http("post", "/api/post/remove", { data });
  },
  add(data) {
    return http("post", "/api/post/add", { data });
  },
  getDetail(params) {
    return http("get", "/api/post/getDetail", { params });
  },
  save(data) {
    return http("post", "/api/post/save", { data });
  }
};

export default post;
