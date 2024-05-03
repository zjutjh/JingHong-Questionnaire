import { createApp } from 'vue'
import './style.css'
import router from './router';
import pinia from './stores/createPinia';
import App from './App.vue'

const app = createApp(App);
app.use(router);
app.use(pinia);
app.mount("#app");
