<template>
    <div class="groupBuy">
        <!-- 页面头部 -->
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/activities' }"><i class="el-icon-menu"></i> 活动</el-breadcrumb-item>
            <el-breadcrumb-item>团购码</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 查询条件 -->
        <el-form :inline="true" :model="formData" class="chooseForm">
            <el-form-item label="" class="w-100">
                <el-select v-model="formData.isUsed" placeholder="使用状态">
                    <el-option label="全部" value=""></el-option>
                    <el-option label="未使用" value="0"></el-option>
                    <el-option label="已使用" value="1"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="团购码:">
                <el-input v-model="formData.code" placeholder="请输入团购码" class="inline-input w-150"></el-input>
            </el-form-item>
            <el-form-item label="手机号码:">
                <el-input v-model="formData.mobile" placeholder="请输入手机号码" class="inline-input w-150"></el-input>
            </el-form-item>
            <el-date-picker v-model="formData.expire_time" type="date" placeholder="选择日期"></el-date-picker>
        </el-form>
    </div>
</template>

<script>
import http from '../../http/Http_base.js'
import api from '../../env.js'
export default {
    name: 'groupBuy',
    // 页面加载之后发起数据请求
    mounted(){
        var self = this;
        // 第一次进入，默认获取第一期优惠码
        self.getActivityCode(1,1);
       
    },
    data () {
        return {
            formData : {
                isUsed : "全部",
                code : "",
                mobile:"",
                expire_time : ""
            }
        }
    },
    methods : {
        // 获取优惠码
        getActivityCode (group_num,page) {
            var self = this;
            var data = {
                group_num : group_num,
                page : page
            }
            http.authHttp.post("/activity/getActivityCode",data).done(function(res) { 
                if(res.code == 0){
                    self.loading = false;
                    self.activiesData = res.data.data;
                    // 优惠码总期数
                    res.data.group_total = Number(res.data.group_total);
                    self.group_numArr=[];
                    for(var i = 0;i < res.data.group_total;i++){
                        self.group_numArr.push(i+1)
                    }
                    // 优惠码总数
                    self.total = res.data.total
                    // 当前页数
                    self.currentPage = res.data.current_page
                    //每一页显示的条数
                    self.perPage = res.data.per_page
                }else{
                    self.$alert(res.msg, '提示');
                }
            });
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    h1, h2 {
        font-weight: normal;
    }

    ul {
        list-style-type: none;
        padding: 0;
    }
    a {
        color: #42b983;
    }
    .chooseForm{
        margin:20px 0;
    }
    .creatGroupNumWrap{
        margin-left: 50px
    }
    .inline-input{
        width: 50px;
    }
    .dateSelect{
        width: 150px
    }
    .used{
        color: #d9534f
    }
    .normal{
        color: #449d44
    }
    .w-100{
        width: 100px;
    }
    .w-150{
        width: 150px;
    }
</style>
