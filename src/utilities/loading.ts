import { ElLoading,ElNotification } from "element-plus";

let loadingInstance:any = null;
let isSuccess = false;
const startLoading = () => {
  loadingInstance = ElLoading.service({
    lock: true,
    text: "Loading",
    background: "rgba(255, 255, 255, 0.7)"
  });
  setTimeout(() => {
    loadingInstance.close();
    if(!isSuccess){
      ElNotification({
        title: "Error",
        message: "失败,网络错误",
        type: "error",

      });
    }
  }, 10000);
};

const closeLoading = () => {
  if (loadingInstance) {
    loadingInstance.close();
    isSuccess = true;
  }
};

export { startLoading, closeLoading };
