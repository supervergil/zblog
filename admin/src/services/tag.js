import http from "@/plugins/http";

const tag = {
  getList(params) {
    return http("get", "/api/tag/getList", { params });
  },
  getAll(params) {
    return http("get", "/api/tag/getAll", { params });
  },
  remove(data) {
    return http("post", "/api/tag/remove", { data });
  },
  add(data) {
    return http("post", "/api/tag/add", { data });
  },
  getDetail(params) {
    return http("get", "/api/tag/getDetail", { params });
  },
  save(data) {
    return http("post", "/api/tag/save", { data });
  }
};

export default tag;
