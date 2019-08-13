<template>
  <div class="page-plugin">
    <h2>
      插件管理
      <router-link to="/plugin/add" class="page-plugin__btn-add">
        <el-button type="success" size="mini">新增插件</el-button>
      </router-link>
    </h2>
    <div>开发中，敬请期待</div>
  </div>
</template>

<script>
import services from "@/services";

export default {
  name: "plugin",
  data() {
    return {};
  },
  async created() {},
  methods: {}
};
</script>

<style lang="scss" scoped>
.page-plugin {
  &__btn {
    margin-right: 8px;
    &-add {
      position: absolute;
      margin-left: 16px;
      margin-top: -3px;
    }
  }
  &__pagination {
    margin-top: 20px;
    text-align: center;
  }
}
</style>
