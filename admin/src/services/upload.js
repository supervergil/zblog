import http from "@/plugins/http";

const upload = {
  getList(params) {
    return http("get", "/api/upload/getList", { params });
  },
  remove(data) {
    return http("post", "/api/upload/remove", { data });
  },
  add(data) {
    return http("post", "/api/upload/add", { data });
  },
  getDetail(params) {
    return http("get", "/api/upload/getDetail", { params });
  },
  save(data) {
    return http("post", "/api/upload/save", { data });
  },
  getPreviewList(params) {
    return http("get", "/api/upload/getPreviewList", { params });
  }
};

export default upload;
