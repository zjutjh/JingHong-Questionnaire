import modal from "./Modal/index.vue";
import { showModal } from "./Modal/showModal";
import skeleton from "./Skeleton/index.vue";
import ModalNoClose from "./Modal/indexNoClose.vue"; // 引入无叉号弹窗组件

export { ModalNoClose }; // 导出无叉号弹窗组件及其显示函数
export { modal, showModal, skeleton };
