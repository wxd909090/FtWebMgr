<template>
    <div class="allDevices">
         <!-- 页面头部 -->
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/storeList' }"><i class="el-icon-menu"></i> 门店管理</el-breadcrumb-item>
            <el-breadcrumb-item>所有设备</el-breadcrumb-item>
            <el-breadcrumb-item><router-link to="/storeList" id="return">返回</router-link></el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 查询条件 -->
        <el-form :inline="true" :model="formData" class="chooseForm">
            <el-form-item label="">
                <el-input v-model="formData.imei" placeholder="搜索设备"></el-input>
            </el-form-item>
            <el-form-item label="">
                <el-select v-model="formData.store_sn" placeholder="门店选择">
                    <el-option label="全国门店" value=""></el-option>
                    <el-option v-model="store.store_name" v-for="store in storeInfo" :key="store.store_sn">{{store.store_name}}</el-option>
                </el-select>
                </el-form-item><el-form-item>
                <el-button type="primary" @click="checkBtn" class="m-l-10">查询</el-button>
                <span class="m-l-10 f-s-16">
                    {{total}}个
                </span>
            </el-form-item>
        </el-form>
        <!-- 设备列表表格 -->
        <el-table  class="devicesListTable" v-loading.body="loading" element-loading-text="拼命加载中" :data="tableData" max-height="650" border>
            <el-table-column prop="imei" label="序列号" width="180"></el-table-column>
            <el-table-column prop="store_name" label="门店" width="250"></el-table-column>
            <el-table-column prop="room_name" label="包间"></el-table-column>
        </el-table>
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
            self.getDevicesData();
        },
        data: function(){
            return {
                // 门店数据
                storeInfo : "",
                // 查询参数
                formData : {
                    store_sn : "",
                    imei : ""
                },
                // 设备列表数据
                tableData: [],
                //数据请求等待动画
                loading: false,

                // 分页
                // 设备总数
                total : 0,
                // 当前页
                currentPage : 1,
                // 每一页显示的条数
                perPage : 0,
                flag : true
            }
        },
        methods: {
            checkBtn() {
                var self = this;
                // 打开等待动画
                self.loading = true;
                var data = {
                    imei : self.formData.imei,
                    store_sn : self.commonFucGetStoreSn(self.formData.store_sn)
                };
                if(self.currentPage != 1){
                    self.flag = false;
                    self.currentPage = 1;
                }
                // 删除空值键
                self.commonFucDeletNull(data);
                self.getDevicesData(data);
            },
            // 获取设备信息
            getDevicesData(data) {
                var self = this;
                http.authHttp.post("/projector/getProjectorByImeiAndStoreSn",data).done(function(res) { 
                    if(res.code == 0){
                        // 列表数据
                        self.tableData = res.data.data
                        // 总数
                        self.total = res.data.total
                        // 每一页显示的条数
                        self.perPage = res.data.per_page
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
                self.currentPage = val;
                // 更新当前页数参数
                var data = {
                    imei : self.formData.imei,
                    store_sn : self.commonFucGetStoreSn(self.formData.store_sn),
                    page : val
                }
                self.commonFucDeletNull(data);
                self.getDevicesData(data);
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
    .devicesListTable{ 
        min-width:600px;
        max-width:800px;
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