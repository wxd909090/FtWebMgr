<template>
    <div class="activities">
      <!-- 页面头部 -->
      <el-breadcrumb separator="/">
          <el-breadcrumb-item :to="{ path: '/activities' }"><i class="el-icon-menu"></i> 活动</el-breadcrumb-item>
          <el-breadcrumb-item>优惠码</el-breadcrumb-item>
      </el-breadcrumb>
      <!-- 优惠码查询条件 -->
      <el-form :inline="true" class="chooseForm">
        <el-form-item label="">
          <el-select v-model="value" placeholder="请选择" class="dateSelect"  @change="changeGroupNum">
            <el-option v-for="item in group_numArr"  :key="item" :value="'第'+item+'期'" no-data-text="暂无数据">第{{item}}期</el-option>
          </el-select>
          <el-button type="primary" class="m-l-10" @click="exportActivityCode">导出</el-button>
          <el-form-item label="期数" class="creatGroupNumWrap">
            <el-input v-model="creatGroupNum" placeholder="期数" class="inline-input"></el-input>
          </el-form-item>
          <el-form-item label="数量">
            <el-input v-model="code_num" placeholder="数量" class="inline-input"></el-input>
          </el-form-item>
              <el-date-picker v-model="expire_time" type="date" placeholder="选择日期"></el-date-picker>
          <el-button type="primary" class="m-l-10" @click="creatNewCode">生成</el-button>
        </el-form-item>
      </el-form>
      
      <!-- 优惠码数据 -->
      <el-table  class="activitiesTable" v-loading.body="loading"  highlight-current-row element-loading-text="拼命加载中" :data="activiesData" border>
          <el-table-column prop="code" label="活动码" width="180"></el-table-column>
          <el-table-column label="有效期"  width="160">
            <template scope="scope">
                <span>{{ scope.row.expire_time | turnYMD}}</span>
            </template>
          </el-table-column>
          <el-table-column label="状态" width="150">
            <template scope="scope">
                <span v-show="scope.row.is_used == 1" class="used">已使用</span>
                <span v-show="scope.row.is_used == 0" class="normal">未使用</span>
            </template>
          </el-table-column>
          <el-table-column label="使用日期" width="180">
            <template scope="scope">
                <span>{{ scope.row.use_time | turnYMD}}</span>
            </template>
          </el-table-column>
          <el-table-column label="使用者" width="200">
            <template scope="scope">
                <span>{{ scope.row.user_info.mobile}}</span>
            </template>
          </el-table-column>
      </el-table>
      <!-- 优惠码分页导航 -->
      <div class="block paginationWrap">
          <el-pagination @current-change="handleCurrentChange" :current-page.sync="currentPage" :page-size="perPage" layout="prev, pager, next, jumper" :total="total" style="padding:0">
          </el-pagination>
      </div>
    </div>
</template>

<script>
import http from '../../http/Http_base.js'
import api from '../../env.js'
export default {
  name: 'activities',
  // 页面加载之后发起数据请求
  mounted(){
      var self = this;
      // 第一次进入，默认获取第一期优惠码
      self.getActivityCode(1,1);
  },
  data () {
    return {
      // 一共多少期
      group_numArr:[],

      // 生成期数
      creatGroupNum:"",

      // 生成优惠码数量
      code_num : "",

      // 截止日期
      expire_time : new Date(),

      //选中的期数
      value:"第1期",

      // 等待动画
      loading : true,

      // 优惠码数据
      activiesData : [],

      // 优惠码总数
      total : 0,
      // 当前页
      currentPage : 1,
      // 每一页显示的条数
      perPage : 0,
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
    },
    // 修改优惠码期数
    changeGroupNum () {
      var self = this;
      var group_num = self.value.replace(/[^0-9]/ig,"");
      self.getActivityCode(group_num,1)
    },
    // 生成优惠码
    creatNewCode () {
      var self = this;
      // 转化为时间戳
      var expire_time = self.commonFucGetUnixTime(self.expire_time);
      var data = {
        expire_time : expire_time,
        code_num : self.code_num,
        group_num : self.creatGroupNum,
      }
      http.authHttp.post("/activity/createActivityCode",data).done(function(res) { 
        if(res.code == 0){
          self.code_num = "";
          self.creatGroupNum = "";
          self.expire_time = "";
          self.$message({type: 'success',message: '创建成功!'});
          var group_num = self.value.replace(/[^0-9]/ig,"");
          self.getActivityCode(group_num,self.currentPage)
        }else{
            self.$alert(res.msg, '提示');
        }
      });
    },
    // 导出优惠码
    exportActivityCode () {
      var self = this;
      var data = {
        group_num : self.value.replace(/[^0-9]/ig,"")
      }
      http.authHttp.post("/activity/exportActivityCode",data).done(function(res) { 
        if(res.code == 0){
          var url = api.apiUrl + "/" + res.data.action + "?file_path=" + res.data.file_path
          window.open(url);
        }else{
            self.$alert(res.msg, '提示');
        }
      });
    },
    // 修改分页页数
    handleCurrentChange(newVal) {
      var self = this;
      var group_num = self.value.replace(/[^0-9]/ig,"");
      self.getActivityCode(group_num,newVal)
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
  margin-top: 20px;
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
.paginationWrap{
  margin-top: 20px
}
</style>
