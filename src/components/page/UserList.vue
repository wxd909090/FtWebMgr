<template>
  <div class="userList">
    <!-- 页面头部 -->
    <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/userList' }"><i class="el-icon-menu"></i> 用户管理</el-breadcrumb-item>
        <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

      <!-- 搜索框 -->
      <el-input placeholder="搜索手机号" icon="search" v-model="searchPhoneNum" class="searchInput"></el-input>
    <template>
      <!-- 用户列表表格 -->
      <el-table element-loading-text="拼命加载中" :data="userListData" border :default-sort = "{prop: 'date', order: 'descending'}" class="userListTable" max-height="550">
        <el-table-column label="序号" width="110">
          <template scope="scope">
            {{scope.$index + 1}}
          </template>
        </el-table-column>
        <el-table-column prop="mobile" label="用户电话号码" width="180"></el-table-column>
        <el-table-column label="注册日期" width="180">
          <template scope="scope">
            {{scope.row.create_time | turnYMD}}
          </template>
        </el-table-column>
        <el-table-column label="押金" width="200">
          <template scope="scope">
            {{scope.row.deposit}}
            <el-button size="" type="text" @click="depositRecord(scope.$index,scope.row)" class="userListBtn">押金记录</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="grade" label="信用评分" width="180"></el-table-column>
        <el-table-column label="未缴纳罚款" width="200">
          <template scope="scope">
            {{scope.row.compensate}}
            <el-button size="" type="text" @click="penaltiesRecord(scope.$index,scope.row)" class="userListBtn">罚款记录</el-button>
          </template>
        </el-table-column>
        <el-table-column label="冻结" width="180">
          <template scope="scope">
            <el-switch v-model="scope.row.status" on-color="#13ce66" off-color="#ff4949" @change="changeUserSta(scope.row,scope.row.status)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="累计消费" width="210">
          <template scope="scope">
            {{scope.row.consumption}}
            <el-button size="" type="text" @click="watchRecord(scope.$index,scope.row)" class="userListBtn">观看记录</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页导航 -->
      <div class="paginationWrap">
          <div class="paginationBlock">
            <el-pagination @current-change="handleCurrentChange" :current-page.sync="currentPage" :page-size="10" layout="total, prev, pager, next, jumper" :total="totolNum">
            </el-pagination>
          </div>
      </div>
    </template>

    <!-- 押金记录模态框 -->
    <el-dialog title=" 押金记录" v-model="dialogFormVisible2" size="tiny" top="100px" class="depositRecordWrap">
      <!-- 押金记录表格 -->
      <el-table  class="depositRecordTable" v-loading.body="loading2" element-loading-text="拼命加载中" :data="depositRecordTableData" max-height="650" border>
        <el-table-column label="序号" width="100">
          <template scope="scope">
            {{scope.$index + 1}}
          </template>
        </el-table-column>
        <el-table-column label="日期">
          <template scope="scope">
            <span>{{ scope.row.alter_time | turnYMDHMS}}</span>
          </template>
        </el-table-column>
        <el-table-column label="押金记录">
          <template scope="scope">
            <span v-if="scope.row.status == 0">充值押金{{ scope.row.price }}元(未付款)。</span>
            <span v-if="scope.row.status == 1">充值押金{{ scope.row.price }}元。</span>
            <span v-if="scope.row.status == 2">充值押金{{ scope.row.price }}元,未付款,已取消。</span>
            <span v-if="scope.row.status == 3">充值押金{{ scope.row.price }}元成功。</span>
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible2 = false">关 闭</el-button>
      </div>
    </el-dialog>

    <!-- 罚款记录模态框 -->
    <el-dialog title=" 罚款记录" v-model="dialogFormVisible3" size="tiny" top="100px" class="penaltiesRecordWrap">
      <!-- 罚款记录表格 -->
      <el-table  class="penaltiesRecordTable" v-loading.body="loading3" element-loading-text="拼命加载中" :data="penaltiesRecordTableData" max-height="650" border>
        <el-table-column label="序号" width="100">
          <template scope="scope">
            {{scope.$index + 1}}
          </template>
        </el-table-column>
        <el-table-column label="日期">
          <template scope="scope">
            <span>{{ scope.row.alter_time | turnYMDHMS}}</span>
          </template>
        </el-table-column>
        <el-table-column label="押金记录">
          <template scope="scope">
            <span v-if="scope.row.status == 0">充值押金{{ scope.row.price }}元(未付款)。</span>
            <span v-if="scope.row.status == 1">充值押金{{ scope.row.price }}元。</span>
            <span v-if="scope.row.status == 2">充值押金{{ scope.row.price }}元,未付款,已取消。</span>
            <span v-if="scope.row.status == 3">充值押金{{ scope.row.price }}元成功。</span>
          </template>
        </el-table-column>
      </el-table>
      <div class="block paginationPenalties">
        <el-pagination @current-change="penaltiesCurrentChange" :current-page.sync="penaltiesCurrentPage" :page-size="penaltiesPerPage" layout="prev, pager, next, jumper" :total="penaltiesTotal" style="padding:0"></el-pagination>
      </div>
    </el-dialog>

     <!-- 观看记录模态框 -->
    <el-dialog title=" 观看记录" v-model="dialogFormVisible4" size="tiny" top="100px" class="watchRecordWrap">
      <!-- 罚款记录表格 -->
      <el-table  class="watchRecordTable" v-loading.body="loading3" element-loading-text="拼命加载中" :data="watchRecordTableData" max-height="650" border>
        <el-table-column label="序号" width="100">
          <template scope="scope">
            {{scope.$index + 1}}
          </template>
        </el-table-column>
        <el-table-column label="日期">
          <template scope="scope">
            <span>{{ scope.row.alter_time | turnYMDHMS}}</span>
          </template>
        </el-table-column>
        <el-table-column label="押金记录">
          <template scope="scope">
            <span v-if="scope.row.status == 0">充值押金{{ scope.row.price }}元(未付款)。</span>
            <span v-if="scope.row.status == 1">充值押金{{ scope.row.price }}元。</span>
            <span v-if="scope.row.status == 2">充值押金{{ scope.row.price }}元,未付款,已取消。</span>
            <span v-if="scope.row.status == 3">充值押金{{ scope.row.price }}元成功。</span>
          </template>
        </el-table-column>
      </el-table>
      <div class="block paginationPenalties">
        <el-pagination @current-change="penaltiesCurrentChange" :current-page.sync="penaltiesCurrentPage" :page-size="penaltiesPerPage" layout="prev, pager, next, jumper" :total="penaltiesTotal" style="padding:0"></el-pagination>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import http from '../../http/Http_base.js'
export default {
  name: 'userList',
  // 页面加载之后发起数据请求
  mounted(){
      this.getUserListData(1)
  },
  data () {
    return {
      // 等待动画
      loading: true,
      // 手机号搜索及是否手机搜索表示
      searchPhoneNum:"",
      searchFlag:0,
      // 当前第几页
      currentPage: 1,

      // 总共条数
      totolNum : 0,

      // 用户列表数据
      userListData:[],

      //押金记录参数
      depositRecordTableData : [],
      dialogFormVisible2 : false,
      loading2 : false,

      //罚款记录参数
      penaltiesRecordTableData : [],
      dialogFormVisible3 : false,
      loading3 : false, 

      // 罚款记录总数(分页)
      penaltiesTotal : 0,
      // 当前页
      penaltiesCurrentPage : 1,
      // 每一页显示的条数
      penaltiesPerPage : 10,
      openRow : "",

      //观看记录参数
      watchRecordTableData : [],
      dialogFormVisible4 : false,
      loading4 : false, 
    }
  },
  methods: {
    // 表格
    formatter(row, column) {
      return row.address;
    },
    // 获得用户列表数据
    getUserListData(page) {
      var self = this;
      // 请求数据
      var data = {
        page : page
      };

      if(self.searchFlag){
        data.key_word = self.searchPhoneNum
      }
      // ajax请求
      http.authHttp.post("/user/getUserInfo",data).done(function(res) { 
          // 关闭等待动画
          if(res.code == 0){
            self.totolNum = res.data.list.total;
            self.userListData = res.data.list.data;
            for(var i = 0;i < self.userListData.length;i++){
              if(self.userListData[i].status == 0){
                self.userListData[i].status = true
              }else{
                self.userListData[i].status = false
              }
            }
          }else{
            self.$alert(res.msg, '提示');
          }
      });
    },

    // 冻结用户操作
    changeUserSta(row,status) {
      console.log(row,status);
      var self = this;
      if(status == false){
        status = 1;
      }else{
        status = 0;
      }
      var data = {
        user_sn : row.user_sn,
        status : status
      }
      // ajax请求
      http.authHttp.post("/user/changeUserStatus",data).done(function(res) { 
          if(res.code == 0){
            self.$message({type: 'success',message: '操作成功!'});
          }else{
            self.$alert(res.msg, '提示');
          }
      });
    },

    // 打开押金记录模态框
    depositRecord(index,row) {
      var self = this;
      self.dialogFormVisible2 = true;
      self.loading2 = true;
      self.depositRecordTableData = [];
      var data = {
        user_sn : row.user_sn
      }
      self.getDepositRecordData(data);
    },
    // 获取押金记录
    getDepositRecordData(data){
      var self = this;
      // ajax请求
      http.authHttp.post("/deposit/getDepositList",data).done(function(res) { 
          // 关闭等待动画
          if(res.code == 0){
            console.log(res);
            self.depositRecordTableData = res.data;
          }else{
            self.$alert(res.msg, '提示');
          }
          self.loading2 = false;
      });
    },

    //打开罚款记录
    penaltiesRecord(index,row){
      var self = this;
      self.dialogFormVisible3 = true;
      self.loading3 = true;
      self.depositRecordTableData = [];
      self.openRow = row;
      var data = {
        user_sn : row.user_sn,
        page : 1,
        orderType : 3
      };
      self.getPenaltiesRecordData(data);
    },
    // 获取罚款记录
    getPenaltiesRecordData(data) {
      var self = this;
      // ajax请求
      http.authHttp.post("/compensate/getOrderList",data).done(function(res) { 
          // 关闭等待动画
          if(res.code == 0){
            // 罚款记录数组
            self.penaltiesRecordTableData = res.data.list.data;
            // 总数
            self.penaltiesTotal = res.data.list.total
            // 每一页显示的条数
            self.penaltiesPerPage = res.data.list.per_page
          }else{
            self.$alert(res.msg, '提示');
          }
          self.loading3 = false;
      });
    },

    //打开观看记录
    watchRecord(index,row){
      var self = this;
      self.dialogFormVisible4 = true;
      self.loading4 = true;
      self.watchRecordTableData = [];
      self.openRow = row;
      var data = {
        user_sn : row.user_sn,
        page : 1,
        orderType : 3
      };
      self.getPenaltiesRecordData(data);
    },
    // 获取罚款记录
    getPenaltiesRecordData(data) {
      var self = this;
      // ajax请求
      http.authHttp.post("/compensate/getOrderList",data).done(function(res) { 
          // 关闭等待动画
          if(res.code == 0){
            // 罚款记录数组
            self.penaltiesRecordTableData = res.data.list.data;
            // 总数
            self.penaltiesTotal = res.data.list.total
            // 每一页显示的条数
            self.penaltiesPerPage = res.data.list.per_page
          }else{
            self.$alert(res.msg, '提示');
          }
          self.loading3 = false;
      });
    },

    // 用户列表分页导航
    handleCurrentChange(val) {
      var self = this;
      self.getUserListData(val)
    },
    // 罚款记录分页导航
    penaltiesCurrentChange(val){
      var data = {
        user_sn : self.openRow.user_sn,
        page : val,
        orderType : 3
      };
      self.getPenaltiesRecordData(data)
    }
  },
  watch:{
    // 监听手机搜索框
    searchPhoneNum(curVal,oldVal){
      var self = this;
      if(curVal.length >= 8){
        self.searchFlag = 1;
        self.getUserListData(1)
      }else{
        self.searchFlag = 0;
        if(curVal.length == 0){
          self.userListData = [];
          self.getUserListData(1)
        }
      }
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

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}
.searchInput{
  width:200px;
  margin:15px 0;
}
.searchInput input{
  border-radius: 16px !important;
}
.userListBtn{
  float:right;
  padding:5px 0;
}
.paginationBlock{
  float:right;
  margin-top:20px
}
.paginationWrap{
  width:1441px;
}
.userListTable{
  width:1441px;
}
.paginationPenalties{
  text-align: right;
  margin-top: 20px;
}
</style>
