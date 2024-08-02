import { createRouter, createWebHistory } from "vue-router";
import {
login,
home,
detailInfo,
datadisplay,
view,
  thank
} from "@/pages";
import pinia from "@/stores/createPinia";
import { useMainStore } from "@/stores";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: home
    },
    {
      path: "/Login",
      name: "login",
      component: login
    },
    {
      path: "/DetailInfo",
      name: "detailInfo",
      component: detailInfo
    },
    {
      path: "/Data",
      name: "datadisplay",
      component: datadisplay
    },
    {
      path:"/View",
      name:"view",
      component:view
    },
    {
      path:"/Thank",
      name:"thank",
      component:thank
    }
  ]
});

router.beforeEach((to, _, next) => {
  const loginStore = useMainStore(pinia).useLoginStore(pinia);
  if(to.path !== "/login" && to.path !== "/View" && to.path !== "/Thank" && !loginStore.loginSession) {
    next("/login");
  } else {
    next();
  }
});


export default router;
