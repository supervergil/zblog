<template>
  <div class="page-dashboard">
    <el-row :gutter="12">
      <el-col :span="8">
        <router-link to="/user" class="page-dashboard__link">
          <el-card shadow="hover" class="page-dashboard__card">
            <h2>注册用户量</h2>
            <div class="page-dashboard__card-content">{{user}} 人</div>
          </el-card>
        </router-link>
      </el-col>
      <el-col :span="8">
        <router-link to="/post" class="page-dashboard__link">
          <el-card shadow="hover" class="page-dashboard__card" style="background-color: #409EFF;">
            <h2>发布文章数</h2>
            <div class="page-dashboard__card-content">{{post}} 篇</div>
          </el-card>
        </router-link>
      </el-col>
      <el-col :span="8">
        <router-link to="/comment" class="page-dashboard__link">
          <el-card shadow="hover" class="page-dashboard__card" style="background-color: #F56C6C;">
            <h2>总评论数</h2>
            <div class="page-dashboard__card-content">{{comment}} 条</div>
          </el-card>
        </router-link>
      </el-col>
    </el-row>

    <el-row :gutter="12" class="page-dashboard__general">
      <el-col :span="24">
        <el-card class="box-card" shadow="always">
          <h3 style="margin: 0;padding: 0;margin-bottom: 12px;">近期文章</h3>
          <div>
            <div class="page-dashboard__general-post-item" v-for="item in postList" :key="item.id">
              <el-link
                :href="baseUrl+'/post/'+item.pathname+'.html'"
                target="_blank"
                type="primary"
              >{{item.title}}</el-link>
              <router-link :to="'/post/'+item.id">
                <el-button type="text" size="mini" icon="el-icon-edit" style="color: #F56C6C;">修改</el-button>
              </router-link>
            </div>
            <div v-if="postList.length===0" style="font-size: 14px;color: #999;">暂无数据</div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import services from "@/services";

export default {
  data() {
    return {
      baseUrl: process.env.VUE_APP_HTTP_BASE_URI,
      user: 0,
      post: 0,
      comment: 0,
      postList: []
    };
  },
  created() {
    this.getGeneral();
  },
  methods: {
    async getGeneral() {
      const { status, data } = await services.general.getInfo();
      if (status === 1) {
        this.user = data.user;
        this.post = data.post;
        this.comment = data.comment;
        this.postList = data.postList.data.map(item => {
          return {
            id: item.id,
            title: item.title,
            pathname: item.pathname
          };
        });
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.page-dashboard {
  &__link {
    text-decoration: none;
  }
  &__card {
    background-color: #67c23a;
    color: white;
    & h2 {
      padding: 0;
      margin: 0;
    }
    &-content {
      margin-top: 20px;
      font-size: 20px;
      text-align: right;
    }
  }
  &__general {
    margin-top: 20px;
    &-post-item {
      display: flex;
      flex-flow: row nowrap;
      justify-content: space-between;
      margin-bottom: 5px;
      &:hover {
        background-color: #efefef;
      }
    }
  }
}
</style>
