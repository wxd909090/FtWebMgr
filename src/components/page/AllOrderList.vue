<template>
    <div class="allDevices">
         <!-- 页面头部 -->
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/storeList' }"><i class="el-icon-menu"></i> 门店管理</el-breadcrumb-item>
            <el-breadcrumb-item>所有订单</el-breadcrumb-item>
            <el-breadcrumb-item><router-link to="/storeList" id="return">返回</router-link></el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 查询条件 -->
        <el-form :inline="true" :model="formData" class="chooseForm">
            <el-form-item label="">
                <el-select v-model="formData.store_sn" placeholder="门店选择">
                    <el-option label="全国门店" value=""></el-option>
                    <el-option v-model="store.store_name" v-for="store in storeInfo" :key="store.store_sn">{{store.store_name}}</el-option>
                </el-select>
                <el-date-picker v-model="formData.reserve_time" type="date" placeholder="选择日期" :picker-options="pickerOptions" :clearable="false"></el-date-picker>
                <el-select v-model="formData.status" placeholder="全部状态">
                    <el-option label="全部状态" value=""></el-option>
                    <el-option label="未支付" value="0"></el-option>
                    <el-option label="已预约" value="1"></el-option>
                    <el-option label="使用中" value="2"></el-option>
                    <el-option label="已完成" value="3"></el-option>
                    <el-option label="已退款" value="4"></el-option>
                    <el-option label="已过期" value="5"></el-option>
                    <el-option label="未观影" value="6"></el-option>
                    <el-option label="未打扫" value="7"></el-option>
                </el-select>
                <el-select v-model="formData.pay_type" placeholder="全部支付类型">
                    <el-option label="全部支付类型" value=""></el-option>
                    <el-option label="微信" value="0"></el-option>
                    <el-option label="优惠码" value="8"></el-option>
                </el-select>
                <el-button type="primary" @click="checkBtn" class="m-l-10">查询</el-button>
                <span class="m-l-10 f-s-16">
                    {{total}}场
                </span>
            </el-form-item>
        </el-form>
        <!-- 所有订单列表表格 -->
        <el-table  class="orderListTable" v-loading.body="loading" element-loading-text="拼命加载中" :data="tableData" max-height="650" border>
            <el-table-column prop="order_sn" label="订单号" width="250"></el-table-column>
            <el-table-column prop="mobile" label="用户" width="180"></el-table-column>
            <el-table-column prop="store_name" label="门店" width="230"></el-table-column>
            <el-table-column prop="room_name" label="包间" width="200"></el-table-column>
            <el-table-column prop="duration_time" label="时段" width="150"></el-table-column>
            <el-table-column label="状态">
                <template scope="scope">
                    <span>{{ scope.row.status | turnStatus}}</span>
                </template>
            </el-table-column>
             <el-table-column label="支付类型">
                <template scope="scope">
                    <span>{{ scope.row.pay_type | turnPayType}}</span>
                </template>
            </el-table-column>
        </el-table>
        <!-- 分页导航 -->
        <div class="block paginationWrap">
            <el-pagination @current-change="handleCurrentChange" :current-page.sync="currentPage" :page-size="perPage" layout="prev, pager, next, jumper" :total="total" style="padding:0">
            </el-pagination>
        </div>
    </div>
</template>

<script>
    import http from '../../http/Http_base.js'
    import md5 from 'js-md5';

    export default {
        // 页面加载之后发起数据请求
        mounted(){
            var self = this;
            self.storeInfo = JSON.parse(localStorage.getItem('getStoreInfo'));
            var data = {
                reserve_time : self.commonFucGetUnixTime8(self.formData.reserve_time)
            }
            self.getOrderListData(data);
        },
        data: function(){
            return {
                // token
                token : localStorage.getItem('token'),

                // 门店数据
                storeInfo : "",

                // 查询参数
                formData : {
                    store_sn : "",
                    reserve_time : new Date(),
                    status:"",
                    pay_type:""
                },

                // 等待动画
                loading: false,

                // 日期插件参数
                pickerOptions: {
                    disabledDate(time) {
                        // return time.getTime() < Date.now() - 8.64e7;
                    }
                },

                // 订单数据
                tableData : [],

                // 分页
                // 订单总数
                total : 0,
                // 当前页
                currentPage : 1,
                // 每一页显示的条数
                perPage : 0,
                flag : true
            }
        },
        methods: {
            // 点击查询
            checkBtn() {
                var self = this;
                // 打开等待动画
                self.loading = true;
                var data = {
                    token : self.token,
                    store_sn : self.commonFucGetStoreSn(self.formData.store_sn),
                    reserve_time : self.commonFucGetUnixTime8(self.formData.reserve_time),
                    status : self.formData.status,
                    pay_type : self.formData.pay_type
                };
                if(self.currentPage != 1){
                    self.flag = false;
                    self.currentPage = 1;
                }
                // 删除空值键
                self.commonFucDeletNull(data);
                // 请求数据
                self.getOrderListData(data)
            },
            // 获取订单信息
            getOrderListData(data) {
                var self = this;
                http.authHttp.post("/order/getOrderList",data).done(function(res) { 
                    if(res.code == 0){
                        // 列表数据
                        self.tableData = res.data.items
                        // // 总数
                        self.total = res.data.list.total
                        // // 每一页显示的条数
                        self.perPage = res.data.list.per_page
                    }else{
                        self.$alert(res.msg, '提示');
                    }
                    self.loading = false;
                });
            },
            // 分页跳转
            handleCurrentChange(val) {
                var self = this;
                if(!self.flag){
                    self.flag = true;
                    return;
                }
                // 打开等待动画
                self.loading = true;
                self.currentPage = val;
                // 更新当前页数参数
                var data = {
                    token : self.token,
                    store_sn : self.commonFucGetStoreSn(self.formData.store_sn),
                    reserve_time : self.commonFucGetUnixTime8(self.formData.reserve_time),
                    status : self.formData.status,
                    pay_type : self.formData.pay_type,
                    page : val
                }
                self.commonFucDeletNull(data);
                self.getOrderListData(data);
            }
        }
    }
</script>

<style scoped>
    .allDevices #return{
      cursor: pointer;
    }
    .chooseForm{
        margin-top: 20px
    }
    .orderListTable{ 
        min-width:1300px;
        max-width:1300px;
    }
    .paginationWrap{
        margin-top: 20px;
    }
    .m-l-10{
        margin-left: 10px;
    }
    .f-s-16{
        font-size: 16px;
    }
</style>