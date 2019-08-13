import http from "@/plugins/http";

const user = {
  getList(params) {
    return http("get", "/api/comment/getList", { params });
  },
  remove(data) {
    return http("post", "/api/comment/remove", { data });
  }
};

export default user;
