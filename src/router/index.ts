import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";
import Home from "../views/Home.vue";
import gaode from "../views/gaode.vue";

const routes: Array<RouteRecordRaw> = [
  // {
  //   path: "/",
  //   name: "gaode",
  //   component: gaode,
  // },
  {
    path: "/",
    redirect:"/happyui",
  },
  {
    path: "/home",
    name: "Home",
    component: () => import("../views/Home.vue"),
    },
  {
    path: "/about",
    name: "About",
    component: () => import("../views/About.vue"),
  },
  {
    path: "/gaode",
    name: "GaoDe",
    component: () => import("../views/gaode.vue"),
  },
  {
    path: "/happyui",
    name: "HappyUI",
    component: () => import("../views/HappyUI.vue"),
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
