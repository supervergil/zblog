import http from "@/plugins/http";

const common = {
  upload(req) {
    return http("post", "/uapi/upload", req);
  },
  uploadToQiniu(req) {
    return http("post", "/uapi/upload/send2Qiniu", req);
  }
};

export default common;
