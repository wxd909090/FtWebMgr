import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
    routes: [{
            path: '/',
            redirect: '/login'
        },
        {
            path: '/StoreList',
            component: resolve => require(['../components/common/Home.vue'], resolve),
            children: [{
                    path: '/', //根目录,默认打开门店列表
                    component: resolve => require(['../components/page/StoreList.vue'], resolve)
                },
                {
                    path: '/hello', //测试
                    component: resolve => require(['../components/page/Hello.vue'], resolve)
                },
                {
                    path: '/storeList', //门店列表
                    component: resolve => require(['../components/page/StoreList.vue'], resolve)
                },
                {
                    path: '/addStore', //添加门店
                    component: resolve => require(['../components/page/AddStore.vue'], resolve)
                },
                {
                    path: '/allDevices', //所有设备
                    component: resolve => require(['../components/page/AllDevices.vue'], resolve)
                },
                {
                    path: '/allOrderList', //所有订单列表
                    component: resolve => require(['../components/page/AllOrderList.vue'], resolve)
                },
                {
                    path: '/staffList', //管理员列表
                    component: resolve => require(['../components/page/StaffList.vue'], resolve)
                },
                {
                    path: '/storeStream', //营业统计
                    component: resolve => require(['../components/page/StoreStream.vue'], resolve)
                },
                {
                    path: '/film', //电影
                    component: resolve => require(['../components/page/Film.vue'], resolve)
                },
                {
                    path: '/filmXf', //电影先锋
                    component: resolve => require(['../components/page/FilmXf.vue'], resolve)
                },
                {
                    path: '/userList', //用户；列表
                    component: resolve => require(['../components/page/UserList.vue'], resolve)
                },
                {
                    path: '/userAssess', //用户评价
                    component: resolve => require(['../components/page/UserAssess.vue'], resolve)
                },
                {
                    path: '/statistics', //用户分析
                    component: resolve => require(['../components/page/Statistics.vue'], resolve)
                },
                {
                    path: '/commonSet', //公共设置
                    component: resolve => require(['../components/page/CommonSet.vue'], resolve)
                },
                {
                    path: '/activities', //优惠活动
                    component: resolve => require(['../components/page/Activities.vue'], resolve)
                },
                {
                    path: '/groupBuy', //团购码
                    component: resolve => require(['../components/page/GroupBuy.vue'], resolve)
                }
            ]
        },
        {
            path: '/login',
            component: resolve => require(['../components/page/Login.vue'], resolve)
        },
    ]
})