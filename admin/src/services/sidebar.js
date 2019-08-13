import http from "@/plugins/http";

const sidebar = {
  getToolList(params) {
    return http("get", "/api/sidebar/getToolList", { params });
  },
  getTool(params) {
    return http("get", "/api/sidebar/getTool", { params });
  },
  addTool(data) {
    return http("post", "/api/sidebar/addTool", { data });
  },
  remove(data) {
    return http("post", "/api/sidebar/removeTool", { data });
  },
  saveTool(data) {
    return http("post", "/api/sidebar/saveTool", { data });
  },
  getPtypeList(params) {
    return http("get", "/api/sidebar/getPtypeList", { params });
  },
  getToolByPID(params) {
    return http("get", "/api/sidebar/getToolByPID", { params });
  },
  removeRelation(data) {
    return http("post", "/api/sidebar/removeRelation", { data });
  },
  getRelationDetail(params) {
    return http("get", "/api/sidebar/getRelationDetail", { params });
  },
  saveRelation(data) {
    return http("post", "/api/sidebar/saveRelation", { data });
  },
  addRelation(data) {
    return http("post", "/api/sidebar/addRelation", { data });
  },
  moveRelation(data){
    return http("post", "/api/sidebar/moveRelation", { data });
  }
};

export default sidebar;
