<template>
  <div class="page-layout-theme">
    <h2>
      主题管理
      <el-button type="success" size="mini" class="page-layout-theme__btn-add">导入</el-button>
    </h2>
  </div>
</template>

<script>
import services from "@/services";

export default {
  name: "layout-theme",
  data() {
    return {
      baseUrl: process.env.VUE_APP_HTTP_BASE_URI
    };
  },
  async created() {},
  methods: {}
};
</script>

<style lang="scss" scoped>
.page-layout-theme {
  &__btn {
    margin-right: 8px;
    &-add {
      position: absolute;
      margin-left: 16px;
      margin-top: 3px;
    }
  }
}
</style>
