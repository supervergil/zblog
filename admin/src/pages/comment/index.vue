<template>
  <div class="page-comment">
    <el-table :data="tData" v-loading="loading" element-loading-text="数据加载中..." stripe border>
      <el-table-column label="评论内容">
        <template slot-scope="scope">
          <el-image
            fit="fill"
            style="width: 24px;height: 24px;vertical-align: middle;margin-right: 10px;"
            :src="scope.row.avatar || '/static/images/default-avatar.jpeg'"
          ></el-image>
          <span style="text-align: center;width: 80px;font-weight: bolder;">{{scope.row.nick_name}}</span>
          <div class="page-comment__content" v-html="scope.row.richtext"></div>
          <blockquote class="page-comment__reply-content" v-if="scope.row.reply_user_id">
            <a>@{{scope.row.reply_name}}：</a>
            <div v-html="scope.row.reply_content"></div>
          </blockquote>
          <div class="page-comment__source">
            <el-link
              type="primary"
              target="_blank"
              :href="baseUrl+scope.row.pathname+'#comment-item-'+scope.row.id"
            >{{scope.row.postInfo.title}}</el-link>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="300px">
        <template slot-scope="scope">
          <el-button type="danger" size="mini" @click="remove(scope.row.id)">删除</el-button>
          <el-button
            type="warning"
            size="mini"
            v-if="scope.row.allow_comment===1 && !scope.row.is_admin"
            @click="shutup(scope.row.user_id,0)"
          >禁言</el-button>
          <el-button
            type="warning"
            size="mini"
            v-else-if="scope.row.allow_comment===0 && !scope.row.is_admin"
            @click="shutup(scope.row.user_id,1)"
          >解除禁言</el-button>
          <el-button
            type="primary"
            size="mini"
            @click="reply(baseUrl+scope.row.pathname+'#comment-item-'+scope.row.id)"
            v-if="!scope.row.is_admin"
          >回复</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="page-comment__pagination">
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
    reply(href) {
      window.open(href);
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
      const { status, data } = await services.comment.getList({
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
    async remove(id) {
      try {
        await this.$confirm("是否删除该评论?", "提示", {
          confirmButtonText: "删除",
          cancelButtonText: "取消",
          type: "warning"
        });
        const { status } = await services.comment.remove({ id });
        if (status === 1) {
          this.$message.success("删除成功!");
          this.getList();
        }
      } catch (e) {
        throw e;
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
.page-comment {
  &__btn {
    margin-right: 8px;
    &-add {
      position: absolute;
      margin-left: 16px;
      margin-top: -3px;
    }
  }
  &__source {
    & .el-link {
      /deep/ {
        &::before {
          content: "-- ";
        }
        font-size: 11px;
        font-style: italic;
      }
    }
  }
  &__content {
    & /deep/ img {
      max-width: 160px !important;
    }
  }
  &__reply-content {
    padding: 0;
    margin: 0;
    padding: 12px;
    margin-bottom: 12px;
    background-color: #eee;
    & a {
      color: #409eff;
      cursor: pointer;
    }
    & /deep/ img {
      max-width: 160px !important;
    }
  }
  &__pagination {
    margin-top: 20px;
    text-align: center;
  }
}
</style>
