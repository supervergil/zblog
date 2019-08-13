import http from "@/plugins/http";

const nav = {
  getList(params) {
    return http("get", "/api/nav/getList", { params });
  },
  remove(data) {
    return http("post", "/api/nav/remove", { data });
  },
  add(data) {
    return http("post", "/api/nav/add", { data });
  },
  getDetail(params) {
    return http("get", "/api/nav/getDetail", { params });
  },
  save(data) {
    return http("post", "/api/nav/save", { data });
  },
  move(data) {
    return http("post", "/api/nav/move", { data });
  }
};

export default nav;
