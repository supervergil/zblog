import http from "@/plugins/http";

const general = {
  getInfo(params) {
    return http("get", "/api/general/getInfo", { params });
  }
};

export default general;
