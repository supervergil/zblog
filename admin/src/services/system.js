import http from "@/plugins/http";

const system = {
  getGeneral(params) {
    return http("get", "/api/system/getGeneral", { params });
  },
  saveGeneral(data) {
    return http("post", "/api/system/saveGeneral", { data });
  },
  getUpload(params) {
    return http("get", "/api/system/getUpload", { params });
  },
  saveUpload(data) {
    return http("post", "/api/system/saveGeneral", { data });
  },
  getWechat(params) {
    return http("get", "/api/system/getWechat", { params });
  },
  saveWechat(data) {
    return http("post", "/api/system/saveWechat", { data });
  },
  getEmail(params) {
    return http("get", "/api/system/getEmail", { params });
  },
  saveEmail(data) {
    return http("post", "/api/system/saveEmail", { data });
  },
  getEmailTemplateList(params) {
    return http("get", "/api/system/getEmailTemplateList", { params });
  },
  getEmailTemplateDetail(params) {
    return http("get", "/api/system/getEmailTemplateDetail", { params });
  },
  saveEmailTemplate(data) {
    return http("post", "/api/system/saveEmailTemplate", { data });
  },
  getCalculator(params) {
    return http("get", "/api/system/getCalculator", { params });
  },
  saveCalculator(data) {
    return http("post", "/api/system/saveCalculator", { data });
  },
  getCustom(params) {
    return http("get", "/api/system/getCustom", { params });
  },
  saveCustom(data) {
    return http("post", "/api/system/saveCustom", { data });
  }
};

export default system;
