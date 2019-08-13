import Vue from "vue";
import VueRouter from "vue-router";
import { Message } from "element-ui";

import LayoutFull from "@/layout/full";
import LayoutManage from "@/layout/manage";

import Login from "@/pages/login";
import Dashboard from "@/pages/dashboard";

// 评论
import Comment from "@/pages/comment";

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
    path: "/comment",
    component: Comment
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
    path: "/signin",
    component: Login
  },
  {
    path: "/signup",
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
      redirect: "/comment"
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
  if (to.path !== "/signin" && to.path !== "/signup") {
    if (
      !!localStorage.getItem("client-user") &&
      !!localStorage.getItem("client-token")
    ) {
      next();
    } else {
      Message.warning("请登录后访问！");
      next("/signin");
    }
  } else {
    next();
  }
});

export default router;
