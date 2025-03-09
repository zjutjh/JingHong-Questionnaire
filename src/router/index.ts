import { createRouter, createWebHistory } from "vue-router";
import { login, home, detailInfo, datadisplay, view, thank, addVote } from "@/pages";
import pinia from "@/stores/createPinia";
import { useMainStore } from "@/stores";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/admin",
      name: "home",
      component: home
    },
    {
      path: "/admin/Login",
      name: "login",
      component: login
    },
    {
      path: "/admin/DetailInfo",
      name: "detailInfo",
      component: detailInfo
    },
    {
      path: "/admin/Data",
      name: "datadisplay",
      component: datadisplay
    },
    {
      path: "/admin/addVote",
      name: "addVote",
      component: addVote
    },
    {
      path: "/View",
      name: "view",
      component: view
    },
    {
      path: "/Thank",
      name: "thank",
      component: thank
    },
    {
      path: "/",
      redirect: () => {
        const loginStore = useMainStore(pinia).useLoginStore(pinia);
        return loginStore.loginSession ? "/admin" : "/admin/Login";
      }
    }
  ]
});

router.beforeEach((to, from, next) => {
  const loginStore = useMainStore(pinia).useLoginStore(pinia);
  if (
    to.path !== "/admin/Login" &&
    to.path !== "/View" &&
    to.path !== "/Thank" &&
    !loginStore.loginSession
  ) {
    next("/admin/Login");
  } else {
    next();
  }
});

export default router;
