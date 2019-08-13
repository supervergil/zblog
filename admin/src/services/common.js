import http from "@/plugins/http";

const common = {
  upload(req) {
    return http("post", "/api/upload", req);
  },
  uploadToQiniu(req) {
    return http("post", "/api/upload/send2Qiniu", req);
  }
};

export default common;
