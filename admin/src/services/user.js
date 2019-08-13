import http from "@/plugins/http";

const user = {
  getList(params) {
    return http("get", "/api/user/getList", { params });
  },
  freeze(data) {
    return http("post", "/api/user/freeze", { data });
  },
  shutup(data) {
    return http("post", "/api/user/shutup", { data });
  }
};

export default user;
