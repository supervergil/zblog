import Vue from "vue";
import VueRouter from "vue-router";
import { Message } from "element-ui";

import LayoutFull from "@/layout/full";
import LayoutManage from "@/layout/manage";

import Login from "@/pages/login";
import Dashboard from "@/pages/dashboard";

// 上传
import Upload from "@/pages/upload";

// 分类
import Category from "@/pages/category";
import CategoryAdd from "@/pages/category/add";
import CategoryDetail from "@/pages/category/detail";

// 标签
import Tag from "@/pages/tag";
import TagAdd from "@/pages/tag/add";
import TagDetail from "@/pages/tag/detail";

// 文章
import Post from "@/pages/post";
import PostAdd from "@/pages/post/add";
import PostDetail from "@/pages/post/detail";

// 页面
import Page from "@/pages/page";
import PageAdd from "@/pages/page/add";
import PageDetail from "@/pages/page/detail";

// 用户
import User from "@/pages/user";

// 评论
import Comment from "@/pages/comment";

// 外观
import Layout from "@/pages/layout";
import LayoutBanner from "@/pages/layout/banner";
import LayoutBannerAdd from "@/pages/layout/banner/add";
import LayoutBannerDetail from "@/pages/layout/banner/detail";
import LayoutNav from "@/pages/layout/nav";
import LayoutSidebar from "@/pages/layout/sidebar";
import LayoutSidebarTool from "@/pages/layout/sidebar/tool";
import LayoutSidebarToolAdd from "@/pages/layout/sidebar/tool/add";
import LayoutSidebarToolDetail from "@/pages/layout/sidebar/tool/detail";
import LayoutTheme from "@/pages/layout/theme";

// 插件
import Plugin from "@/pages/plugin";

// 系统
import System from "@/pages/system";
import SystemEmail from "@/pages/system/email";
import SystemEmailTemplate from "@/pages/system/email/template";
import SystemUpload from "@/pages/system/upload";
import SystemWechat from "@/pages/system/wechat";
import SystemCalculator from "@/pages/system/calculator";
import SystemCustom from "@/pages/system/custom";

// 作者个人信息相关
import PersonalCenter from "@/pages/personal-center";
import ModifyPassword from "@/pages/modify-password";

Vue.use(VueRouter);

const routerList = [
  {
    path: "/dashboard",
    component: Dashboard
  },
  {
    path: "/upload",
    component: Upload
  },
  {
    path: "/category",
    component: Category
  },
  {
    path: "/category/add",
    component: CategoryAdd
  },
  {
    path: "/category/:id",
    component: CategoryDetail
  },
  {
    path: "/tag",
    component: Tag
  },
  {
    path: "/tag/add",
    component: TagAdd
  },
  {
    path: "/tag/:id",
    component: TagDetail
  },
  {
    path: "/post",
    component: Post
  },
  {
    path: "/post/add",
    component: PostAdd
  },
  {
    path: "/post/:id",
    component: PostDetail
  },
  {
    path: "/page",
    component: Page
  },
  {
    path: "/page/add",
    component: PageAdd
  },
  {
    path: "/page/:id",
    component: PageDetail
  },
  {
    path: "/user",
    component: User
  },
  {
    path: "/comment",
    component: Comment
  },
  {
    path: "/layout/general",
    component: Layout
  },
  {
    path: "/layout/banner",
    component: LayoutBanner
  },
  {
    path: "/layout/banner/add",
    component: LayoutBannerAdd
  },
  {
    path: "/layout/banner/:id",
    component: LayoutBannerDetail
  },
  {
    path: "/layout/nav",
    component: LayoutNav
  },
  {
    path: "/layout/sidebar",
    component: LayoutSidebar
  },
  {
    path: "/layout/sidebar/tool",
    component: LayoutSidebarTool
  },
  {
    path: "/layout/sidebar/tool/add",
    component: LayoutSidebarToolAdd
  },
  {
    path: "/layout/sidebar/tool/:id",
    component: LayoutSidebarToolDetail
  },
  {
    path: "/layout/theme",
    component: LayoutTheme
  },
  {
    path: "/plugin",
    component: Plugin
  },
  {
    path: "/system",
    redirect: "/system/general"
  },
  {
    path: "/system/general",
    component: System
  },
  {
    path: "/system/upload",
    component: SystemUpload
  },
  {
    path: "/system/wechat",
    component: SystemWechat
  },
  {
    path: "/system/email",
    component: SystemEmail
  },
  {
    path: "/system/email/template/:id",
    component: SystemEmailTemplate
  },
  {
    path: "/system/calculator",
    component: SystemCalculator
  },
  {
    path: "/system/custom",
    component: SystemCustom
  },
  {
    path: "/personal-center",
    component: PersonalCenter
  },
  {
    path: "/modify-password",
    component: ModifyPassword
  },
  {
    path: "/login",
    component: Login
  }
];

const getLayout = layout => {
  if (!layout) {
    return LayoutManage;
  } else {
    switch (layout) {
      case "full":
        return LayoutFull;
      case "manage":
        return LayoutManage;
    }
  }
};

const router = new VueRouter({
  routes: [
    {
      path: "/",
      redirect: "/dashboard"
    },
    ...routerList.map(item => {
      if (!item.component && !!item.redirect) {
        return {
          path: item.path,
          redirect: item.redirect
        };
      }
      return {
        path: item.path,
        component: getLayout(item.component.layout),
        children: [
          { path: "", component: item.component, children: item.children }
        ]
      };
    })
  ]
});

// 登录守卫

router.beforeEach((to, from, next) => {
  if (to.path !== "/login") {
    if (!!localStorage.getItem("user") && !!localStorage.getItem("token")) {
      next();
    } else {
      Message.warning("请登录后访问！");
      next("/login");
    }
  } else {
    next();
  }
});

export default router;
