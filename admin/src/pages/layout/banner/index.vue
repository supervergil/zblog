<template>
  <div class="page-layout-banner">
    <h2>
      轮播图管理
      <router-link to="/layout/banner/add" class="page-layout-banner__btn-add">
        <el-button type="success" size="mini">新增</el-button>
      </router-link>
      <el-button
        type="default"
        size="mini"
        class="page-layout-banner__btn-back"
        @click="$router.go(-1)"
      >返回</el-button>
    </h2>
    <el-table :data="tData" v-loading="loading" element-loading-text="数据加载中..." stripe>
      <el-table-column prop="title" label="标题"></el-table-column>
      <el-table-column prop="cover" label="封面">
        <template slot-scope="scope">
          <el-image style="width: 200px; height: 50px" :src="scope.row.cover" fit="cover"></el-image>
        </template>
      </el-table-column>
      <el-table-column prop="url" label="链接地址">
        <template slot-scope="scope">
          <el-link :href="scope.row.url" target="_blank">{{scope.row.url}}</el-link>
        </template>
      </el-table-column>
      <el-table-column prop="status" label="状态" width="100">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status===1" type="success">展示中</el-tag>
          <el-tag v-else type="danger">已下架</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <router-link :to="'/layout/banner/'+scope.row.id" class="page-layout-banner__btn">
            <el-button type="primary" size="mini">编辑</el-button>
          </router-link>
          <el-button type="danger" size="mini" @click="remove(scope.row.id)">删除</el-button>
          <el-button
            type="success"
            size="mini"
            icon="el-icon-top"
            circle
            @click="moveUp(scope.row.id)"
          ></el-button>
          <el-button
            type="warning"
            size="mini"
            icon="el-icon-bottom"
            circle
            @click="moveDown(scope.row.id)"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="page-layout-banner__pagination">
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
  name: "layout-banner",
  data() {
    return {
      baseUrl: process.env.VUE_APP_HTTP_BASE_URI,
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
    async remove(id) {
      try {
        await this.$confirm("是否删除该项目?", "提示", {
          confirmButtonText: "删除",
          cancelButtonText: "取消",
          type: "warning"
        });
        const { status } = await services.layout.removeBanner({ id });
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
      const { status, data } = await services.layout.getBanner({
        page: this.page.current
      });
      if (status === 1) {
        if (data.totalPages < data.currentPage && data.totalPages > 0) {
          this.page.current = data.totalPages;
          return this.getList();
        }
        this.page.current = data.currentPage;
        this.page.total = data.count;
        this.tData = [...data.data].map(item => {
          if (!item.url.startsWith("http")) {
            item.url = `${this.baseUrl}${item.url}`;
          }
          return item;
        });
      }
      this.loading = false;
    },
    async moveUp(id) {
      const { status } = await services.layout.moveUpBanner({ id });
      if (status === 1) {
        this.getList();
      }
    },
    async moveDown(id) {
      const { status } = await services.layout.moveDownBanner({ id });
      if (status === 1) {
        this.getList();
      }
    },
    changePage(page) {
      this.page.current = page;
      this.getList();
    }
  }
};
</script>

<style lang="scss" scoped>
.page-layout-banner {
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
  &__pagination {
    margin-top: 20px;
    text-align: center;
  }
}
</style>
