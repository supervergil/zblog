import http from "@/plugins/http";

const category = {
  getList(params) {
    return http("get", "/api/category/getList", { params });
  },
  getAll(params) {
    return http("get", "/api/category/getAll", { params });
  },
  remove(data) {
    return http("post", "/api/category/remove", { data });
  },
  add(data) {
    return http("post", "/api/category/add", { data });
  },
  getDetail(params) {
    return http("get", "/api/category/getDetail", { params });
  },
  save(data) {
    return http("post", "/api/category/save", { data });
  }
};

export default category;
