import http from "@/plugins/http";

const user = {
  modifyPassword(data) {
    return http("post", "/uapi/user/modifyPassword", { data });
  },
  getDetail(params) {
    return http("get", "/uapi/user/getDetail", { params });
  },
  save(data) {
    return http("post", "/uapi/user/save", { data });
  }
};

export default user;
