import { createApp } from 'vue'
import './style.css'
import router from './router';
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import pinia from './stores/createPinia';
import naive from 'naive-ui';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import App from './App.vue';
const app = createApp(App);

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}
app.use(router);
app.use(pinia);
app.use(naive);
app.use(ElementPlus);
app.mount("#app");


