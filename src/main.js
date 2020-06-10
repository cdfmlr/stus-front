import Vue from 'vue'
import Antd from 'ant-design-vue';
import App from './App.vue'
import 'ant-design-vue/dist/antd.css';
import {FormModel} from 'ant-design-vue';
import {getCookie} from "./util/cookieUtil";

Vue.config.productionTip = false;

Vue.use(Antd);
Vue.use(FormModel);

new Vue({
    render: h => h(App),
}).$mount('#app');

export let baseUrl = "http://localhost:9001";

export function getToken() {
  return getCookie("token")
}
