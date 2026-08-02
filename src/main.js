import { createApp } from 'vue'
import './index.css'
import App from './App.vue'

import { VisuallyJsPlugin } from "@visuallyjs/browser-ui-vue";

const app = createApp(App);
app.use(VisuallyJsPlugin);
app.mount('#root')
