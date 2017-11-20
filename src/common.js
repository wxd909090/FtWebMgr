import env from './env.js'

export default {
    commonGetLocalData(key) {
        var self = this;
        if (localStorage[env.localName]) {
            return JSON.parse(localStorage[env.localName])[key];
        } else {
            self.$alert("获取不到登录信息，请重新登录！", '提示');
        }
    },
    install(Vue, options) {
        // -------------------------------------------公共函数------------------------------------------------------

        // 存储登录信息
        Vue.prototype.commonSetLocalData = function(data) {
            localStorage[env.localName] = JSON.stringify(data);
        };
        // 获取登录信息
        Vue.prototype.commonGetLocalData = function(key) {
            var self = this;
            if (localStorage[env.localName]) {
                return JSON.parse(localStorage[env.localName])[key];
            } else {
                self.$alert("获取不到登录信息，请重新登录！", '提示');
            }
        };
        // 获取所有登录信息
        Vue.prototype.commonGetLocalAllData = function() {
            var self = this;
            if (localStorage[env.localName]) {
                return JSON.parse(localStorage[env.localName]);
            } else {
                self.$alert("获取不到登录信息，请重新登录！", '提示');
            }
        };
        // 删除登录信息
        Vue.prototype.commondelLocalAllData = function() {
            delete localStorage[env.localName]
        };
        // 根据门店名字返回stroe_sn
        Vue.prototype.commonFucGetStoreSn = function(storeName, sendStoreInfo) {
            var store_sn = "";
            var storeInfo = JSON.parse(localStorage.getItem('getStoreInfo'));
            if (!storeInfo) {
                storeInfo = sendStoreInfo
            }
            for (var i = 0; i < storeInfo.length; i++) {
                if (storeInfo[i].store_name == storeName) {
                    store_sn = storeInfo[i].store_sn
                }
            }
            return store_sn;
        };

        // 删除空值的属性
        Vue.prototype.commonFucDeletNull = function(obj) {
            for (var x in obj) {
                if (obj[x] == "") {
                    delete obj[x]
                }
            }
        }

        // YMD转换成时间戳，从当天的8点开始计算
        Vue.prototype.commonFucGetUnixTime8 = function(date) {
            if (!date) {
                return "";
            }
            var getDate = new Date(date);
            var year = getDate.getFullYear();
            var month = getDate.getMonth();
            var day = getDate.getDate();
            getDate = new Date(year, month, day);
            // 返回今日时间戳
            return parseInt(getDate.getTime() / 1000) + 28800;
        }

        // YMD转换成时间戳，从当天的0点开始计算
        Vue.prototype.commonFucGetUnixTime = function(date) {
            if (!date) {
                return "";
            }
            var getDate = new Date(date);
            var year = getDate.getFullYear();
            var month = getDate.getMonth();
            var day = getDate.getDate();
            getDate = new Date(year, month, day);
            // 返回今日时间戳
            return parseInt(getDate.getTime() / 1000);
        }

        // 删除数组中拥有某个键值对的对象，arr代表传入的数组，key代表键，vule代表值
        Vue.prototype.commonFucFilterKey = function(arr, key, value) {
            for (var i = 0; i < arr.length; i++) {
                if (arr[i][key] == value) {
                    arr.splice(i, 1);
                    i--;
                }
            }
        }


        // ----------------------------------------------过滤器----------------------------------------------------
        // 管理员状态
        Vue.filter("staffStatus", function(value) { //全局方法 Vue.filter() 注册一个自定义过滤器,必须放在Vue实例化前面
            if (value == 0) {
                return "正常"
            } else {
                return "禁用"
            }
        });

        // 时间戳转化为YMD
        Vue.filter("turnYMD", function(value) { //全局方法 Vue.filter() 注册一个自定义过滤器,必须放在Vue实例化前面
            if (value == 0) {
                return ""
            }
            var out = "0";
            out = getLocalTime(value)

            function getLocalTime(time) {
                var date = new Date(parseInt(time) * 1000);
                return date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
            }
            return out;
        });

        // 时间戳转化为YMD-HMS
        Vue.filter("turnYMDHMS", function(value) { //全局方法 Vue.filter() 注册一个自定义过滤器,必须放在Vue实例化前面
            if (value == 0) {
                return ""
            }
            var out = "0";
            out = getLocalTime(value)

            function getLocalTime(nS) {
                return new Date(parseInt(nS) * 1000).toLocaleString().replace(/:\d{1,2}$/, ' ');
            }
            return out;
        });

        // 订单状态
        Vue.filter("turnStatus", function(value) { //全局方法 Vue.filter() 注册一个自定义过滤器,必须放在Vue实例化前面
            var out = "";
            switch (value) {
                case '0':
                    out = "未付款"
                    break;
                case '1':
                    out = "已预约"
                    break;
                case '2':
                    out = "观影中"
                    break;
                case '3':
                    out = "已完成"
                    break;
                case '4':
                    out = "已退款"
                    break;
                case '5':
                    out = "已过期"
                    break;
                case '6':
                    out = "未观影"
                    break;
                case '7':
                    out = "未打扫"
                    break;
                default:
                    out = "暂无"
            }
            return out;
        });

        // 订单支付方式
        Vue.filter("turnPayType", function(value) { //全局方法 Vue.filter() 注册一个自定义过滤器,必须放在Vue实例化前面
            var out = "";
            switch (value) {
                case '0':
                    out = "微信"
                    break;
                case '8':
                    out = "优惠码"
                    break;
                default:
                    out = "暂无"
            }
            return out;
        });

        // 用户账号状态
        Vue.filter("userStatus", function(value) { //全局方法 Vue.filter() 注册一个自定义过滤器,必须放在Vue实例化前面
            var out = "";
            switch (value) {
                case '0':
                    out = true
                    break;
                case '1':
                    out = false
                    break;
                default:
                    out = true
            }
            return out;
        });
    }
}