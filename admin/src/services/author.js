import http from "@/plugins/http";

const author = {
  modifyPassword(data) {
    return http("post", "/api/author/modifyPassword", { data });
  },
  getDetail(params) {
    return http("get", "/api/author/getDetail", { params });
  },
  save(data) {
    return http("post", "/api/author/save", { data });
  }
};

export default author;
