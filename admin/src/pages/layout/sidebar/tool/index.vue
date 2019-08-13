<template>
  <div class="page-layout-sidebar-tool">
    <h2>
      小工具管理
      <router-link to="/layout/sidebar/tool/add" class="page-layout-sidebar-tool__btn-add">
        <el-button type="success" size="mini">新增</el-button>
      </router-link>
      <el-button size="mini" @click="$router.go(-1)" class="page-layout-sidebar-tool__btn-back">返回</el-button>
    </h2>
    <el-table :data="tData" v-loading="loading" element-loading-text="数据加载中..." stripe>
      <el-table-column prop="name" label="名称"></el-table-column>
      <el-table-column prop="mark" label="工具标识"></el-table-column>
      <el-table-column label="所属">
        <template slot-scope="scope">
          <el-tag type="info" v-if="scope.row.is_system===1">系统预置</el-tag>
          <el-tag type="success" v-else>自定义</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <router-link :to="'/layout/sidebar/tool/'+scope.row.id" class="page-layout-sidebar-tool__btn">
            <el-button type="primary" size="mini">编辑</el-button>
          </router-link>
          <el-button
            type="danger"
            :disabled="scope.row.is_system===1"
            size="mini"
            @click="remove(scope.row)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import services from "@/services";

export default {
  name: "layout-sidebar-tool",
  data() {
    return {
      loading: false,
      tData: []
    };
  },
  async created() {
    this.getList();
  },
  methods: {
    async remove(item) {
      try {
        if (item.is_system === 1) {
          return this.$message.warning("系统预置工具不可删除！");
        }
        await this.$confirm("是否删除该小工具?", "提示", {
          confirmButtonText: "删除",
          cancelButtonText: "取消",
          type: "warning"
        });
        const { status } = await services.sidebar.remove({ id: item.id });
        if (status === 1) {
          this.$message.success("删除成功!");
          this.getList();
        }
      } catch (e) {
        throw e;
      }
    },
    async getList() {
      this.loading = true;
      const { status, data } = await services.sidebar.getToolList();
      if (status === 1) {
        this.tData = [...data];
      }
      this.loading = false;
    }
  }
};
</script>

<style lang="scss" scoped>
.page-layout-sidebar-tool {
  &__btn {
    margin-right: 8px;
    &-add {
      position: absolute;
      margin-left: 16px;
      margin-top: -3px;
    }
    &-back {
      position: absolute;
      margin-left: 85px;
      margin-top: 3px;
    }
  }
}
</style>
