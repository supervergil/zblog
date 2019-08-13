import http from "@/plugins/http";

const post = {
  getList(params) {
    return http("get", "/uapi/comment/getList", { params });
  },
  remove(data) {
    return http("post", "/uapi/comment/remove", { data });
  }
};

export default post;
