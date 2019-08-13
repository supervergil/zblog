<template>
  <div class="page-user">
    <h2>用户管理</h2>
    <el-table :data="tData" v-loading="loading" element-loading-text="数据加载中..." stripe>
      <el-table-column label="用户" width="200px">
        <template slot-scope="scope">
          <el-image
            fit="fill"
            style="width: 40px;height: 40px;vertical-align: middle;margin-right: 10px;"
            :src="scope.row.avatar || '/static/images/default-avatar.jpeg'"
          ></el-image>
          <span style="text-align: center;width: 80px;font-weight: bolder;">{{scope.row.nick_name}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="email" label="邮箱" width="200px"></el-table-column>
      <el-table-column label="状态" align="center">
        <template slot-scope="scope">
          <el-tag type="danger" v-if="scope.row.status===0">冻结</el-tag>
          <el-tag type="success" v-else-if="scope.row.status===1">正常</el-tag>&nbsp;
          <el-tag type="success" v-if="scope.row.allow_comment===1">可发言</el-tag>
          <el-tag type="danger" v-else-if="scope.row.allow_comment===0">禁言中</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="created_date" label="注册时间"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            type="danger"
            size="mini"
            v-if="scope.row.status===1"
            @click="freeze(scope.row.id,0)"
          >冻结</el-button>
          <el-button
            type="primary"
            size="mini"
            v-else-if="scope.row.status===0"
            @click="freeze(scope.row.id,1)"
          >解冻</el-button>
          <el-button
            type="warning"
            size="mini"
            v-if="scope.row.allow_comment===1"
            @click="shutup(scope.row.id,0)"
          >禁言</el-button>
          <el-button
            type="warning"
            size="mini"
            v-else-if="scope.row.allow_comment===0"
            @click="shutup(scope.row.id,1)"
          >解除禁言</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="page-user__pagination">
      <el-pagination
        background
        layout="prev, pager, next"
        :total="page.total"
        :page-size.sync="page.size"
        @current-change="changePage"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
import services from "@/services";

export default {
  name: "user",
  data() {
    return {
      loading: false,
      page: {
        current: 1,
        size: 10,
        total: 0
      },
      tData: []
    };
  },
  async created() {
    this.getList();
  },
  methods: {
    async freeze(id, stats) {
      const tip = stats === 0 ? "是否冻结该用户?" : "是否解冻该用户?";
      const tip2 = stats === 0 ? "冻结" : "解冻";
      try {
        await this.$confirm(tip, "提示", {
          confirmButtonText: tip2,
          cancelButtonText: "取消",
          type: "warning"
        });
        const { status } = await services.user.freeze({ id, status: stats });
        if (status === 1) {
          this.$message.success(tip2 + "成功!");
          this.getList();
        }
      } catch (e) {
        throw e;
      }
    },
    async shutup(id, stats) {
      const tip = stats === 0 ? "是否禁言该用户?" : "是否解禁该用户?";
      const tip2 = stats === 0 ? "禁言" : "解禁";
      try {
        await this.$confirm(tip, "提示", {
          confirmButtonText: tip2,
          cancelButtonText: "取消",
          type: "warning"
        });
        const { status } = await services.user.shutup({
          id,
          allow_comment: stats
        });
        if (status === 1) {
          this.$message.success(tip2 + "成功!");
          this.getList();
        }
      } catch (e) {
        throw e;
      }
    },
    async getList() {
      this.loading = true;
      const { status, data } = await services.user.getList({
        page: this.page.current
      });
      if (status === 1) {
        if (data.totalPages < data.currentPage && data.totalPages > 0) {
          this.page.current = data.totalPages;
          return this.getList();
        }
        this.page.current = data.currentPage;
        this.page.total = data.count;
        this.tData = [...data.data];
      }
      this.loading = false;
    },
    changePage(page) {
      this.page.current = page;
      this.getList();
    }
  }
};
</script>

<style lang="scss" scoped>
.page-user {
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
