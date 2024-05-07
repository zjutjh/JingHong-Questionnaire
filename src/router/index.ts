import { createRouter, createWebHistory } from "vue-router";
import { home,login,detailInfo } from "@/pages";
// import pinia from "@/stores/createPinia";
// import { useMainStore } from "@/stores";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "index",
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
  ]
});

// router.beforeEach((to, _, next) => {
//   const loginStore = useMainStore(pinia).useLoginStore(pinia);
// });

export default router;
