<template>
  <div class="page-category">
    <h2>
      分类管理
      <router-link to="/category/add" class="page-category__btn-add">
        <el-button type="success" size="mini">新增分类</el-button>
      </router-link>
    </h2>
    <el-table :data="tData" v-loading="loading" element-loading-text="数据加载中..." stripe>
      <el-table-column prop="name" label="名称"></el-table-column>
      <el-table-column prop="pathname" label="缩略名/路径名"></el-table-column>
      <el-table-column prop="description" label="描述"></el-table-column>
      <el-table-column prop="post_count" label="文章数" width="100"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <router-link :to="'/category/'+scope.row.id" class="page-category__btn">
            <el-button type="primary" size="mini">编辑</el-button>
          </router-link>
          <el-button type="danger" size="mini" @click="remove(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="page-category__pagination">
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
  name: "category",
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
    async remove(id) {
      try {
        await this.$confirm("是否删除该分类?", "提示", {
          confirmButtonText: "删除",
          cancelButtonText: "取消",
          type: "warning"
        });
        const { status } = await services.category.remove({ id });
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
      const { status, data } = await services.category.getList({
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
.page-category {
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
