import http from "@/plugins/http";

const layout = {
  getGeneral(params) {
    return http("get", "/api/layout/getGeneral", { params });
  },
  saveGeneral(data) {
    return http("post", "/api/layout/saveGeneral", { data });
  },
  getBanner(params) {
    return http("get", "/api/layout/getBanner", { params });
  },
  saveBanner(data) {
    return http("post", "/api/layout/saveBanner", { data });
  },
  addBanner(data) {
    return http("post", "/api/layout/addBanner", { data });
  },
  getBannerDetail(params) {
    return http("get", "/api/layout/getBannerDetail", { params });
  },
  removeBanner(data) {
    return http("post", "/api/layout/removeBanner", { data });
  },
  moveUpBanner(data) {
    return http("post", "/api/layout/moveUpBanner", { data });
  },
  moveDownBanner(data) {
    return http("post", "/api/layout/moveDownBanner", { data });
  }
};

export default layout;
