// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import Element from 'element-ui'
import 'element-ui/lib/theme-default/index.css'
// import axios from 'axios'
import common from './common'
import directives from './directives'
// import 'vue-awesome/icons/flag'
// import 'vue-awesome/icons'
// import Icon from 'vue-awesome/components/Icon'
import qrcode from './vendor/jquery.qrcode.min.js'


Vue.use(Element);
Vue.use(common);
Vue.use(directives);

// Vue.prototype.$ajax = axios;
// Vue.component('icon', Icon);

Vue.config.productionTip = false;
$(function() {
    // 设置jQuery Ajax全局的参数  
    $.ajaxSetup({
        type: "POST",
        data: { 'token': common.commonGetLocalData('token') ? common.commonGetLocalData('token') : '' },
        success: function(response) {
            if (response.code == 1012) {
                window.location = "/login";
                return;
            }
        }
    });
});

/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    template: '<App/>',
    components: { App }
})