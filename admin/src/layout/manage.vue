<template>
  <div class="layout-manage">
    <div class="layout-manage__header">
      <h1 class="layout-manage__title">
        <router-link to="/">ZBLOG管理后台</router-link>
      </h1>
      <el-dropdown class="layout-manage__personal" trigger="click" @command="handleCommand">
        <div class="el-dropdown-link">
          <img
            :src="$store.state.user.avatar || '/static/images/default-avatar.jpeg'"
            class="layout-manage__avatar"
          >
          <span class="layout-manage__name">{{$store.state.user.name}}</span>
          <i class="el-icon-arrow-down el-icon--right layout-manage__pointer"></i>
        </div>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="personal-center">个人中心</el-dropdown-item>
          <el-dropdown-item command="modify-password">修改密码</el-dropdown-item>
          <el-dropdown-item divided command="logout">安全退出</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <div class="layout-manage__sidebar">
      <div class="layout-manage__sidebar-inner">
        <el-menu
          :unique-opened="true"
          :router="true"
          :default-active="defaultActive"
          class="layout-manage__menu"
        >
          <el-extend-menu-item v-for="item of menus" :key="item.id" :item="item"></el-extend-menu-item>
        </el-menu>
      </div>
    </div>
    <div class="layout-manage__content">
      <div class="layout-manage__content-inner">
        <!-- <keep-alive :exclude="/(^system)|(add|detail$)/"> -->
        <router-view></router-view>
        <!-- </keep-alive> -->
      </div>
    </div>
  </div>
</template>

<script>
import services from "@/services";

const getRootPath = (path, menus) => {
  let rootPath = "";
  let rootOpen = "";
  const compare = (currentPath, routerPath) =>
    currentPath.startsWith(routerPath);
  const scan = menu => {
    for (let item of menu) {
      if (compare(path, item.router)) {
        if (!item.children) {
          return (rootPath = item.router);
        } else {
          scan(item.children);
        }
        rootOpen = item.router;
      } else {
        if (item.children) {
          scan(item.children);
        }
      }
    }
  };
  scan(menus);
  return { rootPath, rootOpen: [rootOpen] };
};

export default {
  data() {
    return {
      defaultActive: null,
      menus: [
        {
          id: "dashboard",
          name: "仪表盘",
          router: `/dashboard`,
          icon: "fa-fw fas fa-tachometer-alt"
        },
        {
          id: "upload",
          name: "上传管理",
          router: `/upload`,
          icon: "fa-fw fas fa-upload"
        },
        {
          id: "tag",
          name: "标签管理",
          router: `/tag`,
          icon: "fa-fw fas fa-tags"
        },
        {
          id: "category",
          name: "分类管理",
          router: `/category`,
          icon: "fa-fw fas fa-cubes"
        },
        {
          id: "post",
          name: "文章管理",
          router: `/post`,
          icon: "fa-fw fas fa-file-alt"
        },
        {
          id: "page",
          name: "页面管理",
          router: `/page`,
          icon: "fa-fw fas fa-scroll"
        },
        {
          id: "comment",
          name: "评论管理",
          router: `/comment`,
          icon: "fa-fw fas fa-comments"
        },
        {
          id: "user",
          name: "用户管理",
          router: `/user`,
          icon: "fa-fw fas fa-user-friends"
        },
        {
          id: "layout",
          name: "外观设置",
          router: `/layout`,
          icon: "fa-fw fas fa-solar-panel",
          children: [
            {
              id: "layout-general",
              name: "基本设置",
              router: `/layout/general`
            },
            {
              id: "layout-nav",
              name: "导航管理",
              router: `/layout/nav`
            },
            {
              id: "layout-sidebar",
              name: "侧栏工具",
              router: `/layout/sidebar`
            }
            // {
            //   id: "layout-theme",
            //   name: "主题管理",
            //   router: `/layout/theme`
            // }
          ]
        },
        // {
        //   id: "plugin",
        //   name: "插件管理",
        //   router: `/plugin`,
        //   icon: "fa-fw fas fa-puzzle-piece"
        // },
        {
          id: "system",
          name: "系统设置",
          router: `/system`,
          icon: "fa-fw fas fa-cog",
          children: [
            {
              id: "system-general",
              name: "基本设置",
              router: `/system/general`
            },
            {
              id: "system-upload",
              name: "上传设置",
              router: `/system/upload`
            },
            {
              id: "system-wechat",
              name: "微信接入",
              router: `/system/wechat`
            },
            {
              id: "system-email",
              name: "邮箱代理",
              router: `/system/email`
            },
            {
              id: "system-calculator",
              name: "统计代码",
              router: `/system/calculator`
            },
            {
              id: "system-custom",
              name: "网站自定义",
              router: `/system/custom`
            }
          ]
        }
      ]
    };
  },
  watch: {
    $route(to) {
      const { rootPath } = getRootPath(to.path, this.menus);
      this.defaultActive = rootPath;
    }
  },
  created() {
    const { rootPath } = getRootPath(this.$route.path, this.menus);
    this.defaultActive = rootPath;
  },
  methods: {
    async handleCommand(command) {
      switch (command) {
        case "personal-center":
          this.$router.push("/personal-center");
          break;
        case "modify-password":
          this.$router.push("/modify-password");
          break;
        case "logout":
          var { status } = await services.auth.logout();
          if (status === 1) {
            this.$store.commit("SET_USER", {});
            localStorage.removeItem("user");
            localStorage.removeItem("token");
            this.$message.success("已安全退出");
            this.$router.push("/login");
          }
          break;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.layout-manage {
  width: 100%;
  height: 100%;
  &__header {
    position: absolute;
    width: 100%;
    height: 60px;
    line-height: 60px;
    padding: 0 10px;
    background-color: #409eff;
    z-index: 20;
  }
  &__title {
    float: left;
    padding: 0;
    margin: 0;
    height: 60px;
    line-height: 60px;
    font-size: 25px;
    user-select: none;
    & > a {
      color: white;
      text-decoration: none;
    }
  }
  &__personal {
    float: right;
    color: white;
    cursor: pointer;
  }
  &__name {
    vertical-align: middle;
  }
  &__avatar {
    margin-right: 10px;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    overflow: hidden;
    vertical-align: middle;
  }
  &__pointer {
    vertical-align: middle;
  }
  &__sidebar {
    position: absolute;
    padding-top: 60px;
    width: 200px;
    height: 100%;
    z-index: 19;
    &-inner {
      border-right: 1px solid #ddd;
      height: 100%;
      overflow: auto;
    }
  }
  &__content {
    position: absolute;
    top: 60px;
    left: 200px;
    bottom: 0;
    right: 0;
    z-index: 19;
    overflow-y: auto;
    &-inner {
      padding: 8px 20px;
      padding-bottom: 30px;
    }
  }
  &__menu {
    border-right: none;
  }
}
</style>
