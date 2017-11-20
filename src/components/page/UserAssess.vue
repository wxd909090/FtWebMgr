<template>
    <div class="userAssess">
        <!-- 页面头部 -->
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/userList' }"><i class="el-icon-menu"></i> 用户管理</el-breadcrumb-item>
            <el-breadcrumb-item>用户评价</el-breadcrumb-item>
        </el-breadcrumb>
        <template>
          <el-tabs v-model="activeName" @tab-click="handleClick">
            <!-- 用户评论 -->
            <el-tab-pane label="用户评论" name="first">
              <!-- 查询条件 -->
              <el-form :inline="true" :model="formData" class="chooseForm">
                  <el-form-item label="">
                      <el-select v-model="formData.store_sn" placeholder="门店选择">
                          <el-option label="全国门店" value=""></el-option>
                          <el-option v-model="store.store_name" v-for="store in storeInfo" :key="store.store_sn">{{store.store_name}}</el-option>
                      </el-select>
                      <el-date-picker v-model="formData.time" type="daterange" placeholder="选择日期"></el-date-picker>
                      <el-input v-model="formData.mobile" placeholder="用户手机号码" style="width:auto"></el-input>
                      <el-select v-model="formData.is_show" placeholder="是否显示">
                          <el-option label="所有" value="0"></el-option>
                          <el-option label="显示" value="2"></el-option>
                          <el-option label="不显示" value="1"></el-option>
                      </el-select>
                      <el-button type="primary" class="m-l-10" @click="userAssessSub">查询</el-button>
                      <el-button type="primary" @click="getDocBtn">导出</el-button>
                  </el-form-item>
              </el-form>
              <!-- 用户评论表格 -->
              <el-table  class="userAssessTable" v-loading.body="loading"  highlight-current-row element-loading-text="拼命加载中" :data="userAssess" border>
                  <el-table-column prop="mobile" label="用户" width="180"></el-table-column>
                  <el-table-column label="日期"  width="180">
                    <template scope="scope">
                        <span>{{ scope.row.create_time | turnYMD}}</span>
                    </template>
                  </el-table-column>
                  <el-table-column prop="store_name" label="门店" width="230"></el-table-column>
                  <el-table-column prop="room_name" label="包间" width="200"></el-table-column>
                  <el-table-column label="卫生-影音-舒适" width="180">
                    <template scope="scope">
                        <span>{{ scope.row.health }} - {{ scope.row.av }} - {{ scope.row.comfy }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column label="评价内容" width="500">
                    <template scope="scope">
                        <span>{{ scope.row.info}}</span>
                    </template>
                  </el-table-column>
                  <el-table-column label="是否显示" width="152">
                    <template scope="scope">
                      <el-switch v-model="scope.row.is_show" @change="changeUserAssess(scope.row,scope.row.is_show)" on-text="" off-text=""></el-switch>
                    </template>
                  </el-table-column>
              </el-table>
              <!-- 用户评论分页导航 -->
              <div class="block paginationWrap">
                  <el-pagination @current-change="handleCurrentChange" :current-page.sync="currentPage" :page-size="perPage" layout="prev, pager, next, jumper" :total="total" style="padding:0">
                  </el-pagination>
              </div>
            </el-tab-pane>
            <!-- 门店评分 -->
            <el-tab-pane label="门店评分" name="second">
              <el-table  class="storeAssessTable" highlight-current-row element-loading-text="拼命加载中" :data="storeAssess" border>
                  <el-table-column prop="store_name" label="门店" width="230"></el-table-column>
                  <el-table-column prop="count" label="评论次数" width="230"></el-table-column>
                  <el-table-column label="平均(卫生-影音-舒适)" width="250">
                    <template scope="scope">
                        <span>{{ scope.row.health }} - {{ scope.row.av }} - {{ scope.row.comfy }}</span>
                    </template>
                  </el-table-column>
              </el-table>
              <!-- 门店评分分页导航 -->
              <div class="block paginationWrap">
                  <el-pagination @current-change="handleCurrentChange" :current-page.sync="storeCurrentPage" :page-size="storePerPage" layout="prev, pager, next, jumper" :total="storeTotal" style="padding:0">
                  </el-pagination>
              </div>
            </el-tab-pane>
          </el-tabs>
        </template>  
    </div>
</template>

<script>
import http from '../../http/Http_base.js'
export default {
  name: 'userAssess',
  // 页面加载之后发起数据请求
  mounted(){
      var self = this;
      //获得门店信息
      self.getInfo();
      // 获得用户评论信息
      self.userAssessSub(1);
      // 获得门店评分信息
      var data = {
        page : 1
      }
      self.getStoreAssess(data)
  },
  data () {
    return {
      activeName: "first",

      // 门店信息
      storeInfo : [],

      // 查询参数
      formData : {
          store_sn : "",
          time :[],
          mobile : "",
          is_show : ""
      },

      loading  : true,
      // 评论数据
      userAssess : [],
      // 门店评分
      storeAssess : [],

      // 分页
      // 订单总数
      total : 0,
      // 当前页
      currentPage : 1,
      // 每一页显示的条数
      perPage : 0,

      //门店评分分页参数
      storeTotal : 0,
      storeCurrentPage : 1,
      storePerPage : 0,

    }
  },
  methods: {
    // 得到门店信息
    getInfo () {
        var self = this;
        var data = {};
        // ajax请求
        http.authHttp.post("/store/getStoreInfo",data).done(function(res) { 
            if(res.code == 0){
               self.storeInfo  = res.data;
               self.commonFucFilterKey(self.storeInfo,"status",1)
            }else{
                self.$alert(res.msg, '提示');
            }
        });
    },
    // 点击页面切换事件
    handleClick(tab, event) {
      console.log(tab, event);
    },
    // 日期插件参数
    pickerOptions: {
        disabledDate(time) {
            // return time.getTime() < Date.now() - 8.64e7;
        }
    },
    // 获得用户评价信息
    getUserAssess(data){
      var self = this;
      // ajax请求评论列表数据
      http.authHttp.post("/reviews/getUserReviewsList",data).done(function(res) { 
          // 关闭等待动画
          self.loading = false;
          if(res.code == 0){
              // 将返回的数据放到storeListData
              self.userAssess = res.data.data;
              self.total = res.data.total;
              self.perPage = res.data.per_page;
              for(var i = 0;i < self.userAssess.length;i++){
                if(self.userAssess[i].is_show == 1){
                  self.userAssess[i].is_show = true
                }else{
                  self.userAssess[i].is_show = false
                }
              }
          }else{
              self.$alert(res.msg, '提示');
          }
      });
    },
    // 获得门店评分信息
    getStoreAssess(data){
      var self = this;
      // ajax请求评论列表数据
      http.authHttp.post("/reviews/getStoreReviewsListForWeb",data).done(function(res) { 
          if(res.code == 0){
              self.storeAssess = res.data.data;
              self.storeTotal = res.data.total;
              self.storePerPage = res.data.per_page;
          }else{
              self.$alert(res.msg, '提示');
          }
      });
    },
    // 点击查询
    userAssessSub () {
      var self = this;
      var data = {
          store_sn : self.commonFucGetStoreSn(self.formData.store_sn,self.storeInfo),
          begin_time : self.commonFucGetUnixTime(self.formData.time[0]),
          end_time : self.commonFucGetUnixTime(self.formData.time[1]),
          mobile : self.formData.mobile,
          page : 1,
          is_show : self.formData.is_show
      };
      // 删除空值的键
      self.commonFucDeletNull(data);
      // 拉取用户评价数据
      self.getUserAssess(data)
    },
    // 导出评论文件
    getDocBtn () {
      var self = this;
      var data = {
        store_sn : self.commonFucGetStoreSn(self.formData.store_sn,self.storeInfo),
        begin_time : self.commonFucGetUnixTime(self.formData.time[0]),
        end_time : self.commonFucGetUnixTime(self.formData.time[1]),
        mobile : self.formData.mobile,
        page : self.currentPage,
        is_show : self.formData.is_show
      };
      // 删除空值的键
      self.commonFucDeletNull(data);
      // ajax请求评论列表数据
      http.authHttp.post("/reviews/exportUserReviewsList",data).done(function(res) { 
          if(res.code == 0){
              if(res.data.length == 0){
                  self.$alert("无评论数,下载列表为空！", '提示');
              }else{
                  var url = http.baseUrl + "/" + res.data.action + "?file_path=" + res.data.file_path;
                  window.open(url);
              }
          }else{
              self.$alert(res.msg, '提示');
          }
      });
    },
    // 用户评论分页跳转
    handleCurrentChange(newVal){
      var self = this;
      var data = {
          store_sn : self.commonFucGetStoreSn(self.formData.store_sn,self.storeInfo),
          begin_time : self.commonFucGetUnixTime(self.formData.time[0]),
          end_time : self.commonFucGetUnixTime(self.formData.time[1]),
          mobile : self.formData.mobile,
          page : newVal,
          is_show : self.formData.is_show
      };
      // 删除空值的键
      self.commonFucDeletNull(data);
      // 拉取用户评价数据
      self.getUserAssess(data)
    },
    // 门店评分分页跳转
    storeCurrentChange(newVal){
      var self = this;
      var data = {
          page : newVal
      };
      // 拉取门店评分数据
      self.getStoreAssess(data)
    },
    //修改评论显示状态
    changeUserAssess(row,is_show) {
      var self = this;
      var turn_is_show = "";
      if(is_show == true){
        turn_is_show = 0; 
      }else{
        turn_is_show = 1; 
      }
      var data = {
        order_sn : row.order_sn,
        is_show : turn_is_show
      }
      // 修改评论状态
      http.authHttp.post("/reviews/changeReviews",data).done(function(res) { 
        if(res.code == 0){
            self.$message({type: 'success',message: '修改成功!'});
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
.paginationWrap{
  margin-top: 10px
}
.userAssessTable td{
  padding: 10px 18px !important;
}
.storeAssessTable{
  width: 711px;
}
</style>
