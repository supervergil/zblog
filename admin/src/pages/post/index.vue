<template>
  <div class="page-post">
    <h2>
      文章管理
      <router-link to="/post/add" class="page-post__btn-add">
        <el-button type="success" size="mini">写文章</el-button>
      </router-link>
      <div class="page-post__search">
        <el-input
          size="mini"
          placeholder="搜索文章"
          suffix-icon="el-icon-search"
          @input="changeSearch"
          v-model="search"
        ></el-input>
      </div>
    </h2>

    <el-tabs v-model="activeTab">
      <el-tab-pane label="全部文章" name="whole">
        <el-table :data="tData" v-loading="loading" element-loading-text="数据加载中..." stripe>
          <el-table-column label="标题">
            <template slot-scope="scope">
              <el-link
                :href="baseUrl+'/post/'+scope.row.pathname+'.html'"
                target="_blank"
              >{{scope.row.title}}</el-link>
            </template>
          </el-table-column>
          <el-table-column label="来源" width="100">
            <template slot-scope="scope">
              <span v-if="scope.row.type===0">原创</span>
              <span v-if="scope.row.type===1">网友投稿</span>
              <span v-if="scope.row.type===2">转载</span>
            </template>
          </el-table-column>
          <el-table-column label="状态" width="120">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.status===1" type="success">已发布</el-tag>
              <el-tag v-else type="warning">待发布</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="创建日期" width="180">
            <template slot-scope="scope">{{scope.row.created_date}}</template>
          </el-table-column>
          <el-table-column label="操作" width="180">
            <template slot-scope="scope">
              <router-link :to="'/post/'+scope.row.id" class="page-post__btn">
                <el-button type="primary" size="mini">编辑</el-button>
              </router-link>
              <el-button type="danger" size="mini" @click="remove(scope.row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="page-post__pagination">
          <el-pagination
            background
            layout="prev, pager, next"
            :total="page.total"
            :page-size.sync="page.size"
            @current-change="changePage"
          ></el-pagination>
        </div>
      </el-tab-pane>
      <el-tab-pane label="投稿审核" name="commit"></el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import services from "@/services";

export default {
  name: "post",
  data() {
    return {
      baseUrl: process.env.VUE_APP_HTTP_BASE_URI,
      search: "",
      activeTab: "whole",
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
        await this.$confirm("是否删除该文章?", "提示", {
          confirmButtonText: "删除",
          cancelButtonText: "取消",
          type: "warning"
        });
        const { status } = await services.post.remove({ id });
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
      const { status, data } = await services.post.getList({
        page: this.page.current,
        search: this.search
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
    },
    changeSearch() {
      this.page.current = 1;
      this.getList();
    }
  }
};
</script>

<style lang="scss" scoped>
.page-post {
  &__search {
    position: absolute;
    display: inline-block;
    width: 170px;
    margin-left: 16px;
    margin-top: -3px;
    overflow: hidden;
  }
  &__btn {
    margin-right: 8px;
    &-add {
      position: absolute;
      margin-left: 200px;
      margin-top: -3px;
    }
  }
  &__pagination {
    margin-top: 20px;
    text-align: center;
  }
}
</style>
