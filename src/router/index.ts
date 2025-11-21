import { createRouter, createWebHistory } from "vue-router";
import { login, home, detailInfo, datadisplay, view, thank, addVote } from "@/pages";
import pinia from "@/stores/createPinia";
import { useMainStore } from "@/stores";
import { nextTick } from "vue";
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
  const loginStore = useMainStore().useLoginStore();
  nextTick(() => {
    loginStore.setShowHeader(to.path.startsWith("/admin/"));
  });

  if (to.path.startsWith("/admin")) {
    if (!loginStore.loginSession || !loginStore.isTokenValid) {
      if (to.path !== "/admin/Login") {
        next({
          path: "/admin/Login",
          query: { redirect: to.fullPath }
        });
      } else
        next();
    } else {
      if (to.path === "/admin/Login")
        next("/admin");
      else
        next();
    }
  } else
    next();
});

export default router;
