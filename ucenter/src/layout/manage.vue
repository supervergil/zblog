<template>
  <div class="layout-manage">
    <div class="layout-manage__header">
      <h1 class="layout-manage__title">
        <router-link to="/">个人中心</router-link>
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
          :unique-opened="false"
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
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script>
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
        // {
        //   id: "dashboard",
        //   name: "仪表盘",
        //   router: `/dashboard`,
        //   icon: "fa-fw fas fa-tachometer-alt"
        // },
        {
          id: "comment",
          name: "评论管理",
          router: `/comment`,
          icon: "fa-fw fas fa-comments"
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
          this.$store.commit("SET_USER", {});
          localStorage.removeItem("client-user");
          localStorage.removeItem("client-token");
          this.$message.success("已安全退出");
          this.$router.push("/signin");
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
