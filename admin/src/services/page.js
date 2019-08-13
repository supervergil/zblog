import http from "@/plugins/http";

const page = {
  getList(params) {
    return http("get", "/api/page/getList", { params });
  },
  remove(data) {
    return http("post", "/api/page/remove", { data });
  },
  add(data) {
    return http("post", "/api/page/add", { data });
  },
  getDetail(params) {
    return http("get", "/api/page/getDetail", { params });
  },
  save(data) {
    return http("post", "/api/page/save", { data });
  },
  getLayout(params) {
    return http("get", "/api/page/getLayout", { params });
  }
};

export default page;
