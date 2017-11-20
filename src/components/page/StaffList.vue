<template>
    <div class="staffList">
        <!-- 页面头部 -->
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/storeList' }"><i class="el-icon-menu"></i> 门店管理</el-breadcrumb-item>
            <el-breadcrumb-item>门店管理员</el-breadcrumb-item>
        </el-breadcrumb>
        <el-button type="primary" size="small" class="addStoreBtn" @click="addStaff()">添加员工 <i class="el-icon-plus"></i></el-button>
        <!-- 表格显示 -->
        <el-table v-loading.body="loading"  element-loading-text="拼命加载中" :data="staffInfoData" border style="margin-top:20px;width:1231px" :default-sort="{prop: 'date', order: 'descending'}">
          <el-table-column prop="staff_name" label="管理员名称" width="150">
          </el-table-column>
          <el-table-column prop="mobile" label="管理员电话" width="180">
          </el-table-column>
          <el-table-column label="状态" width="120" >
            <template scope="scope">
              <span :class=" scope.row.status == 0 ? 'normal' : 'formal' ">{{ scope.row.status | staffStatus}}</span>
            </template>
          </el-table-column>
          <el-table-column label="添加日期" width="180">
            <template scope="scope">
              <span>{{ scope.row.create_time | turnYMD}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="relationList" label="管理门店" width="300">
          </el-table-column>
          <el-table-column label="操作" width="300">
            <template scope="scope">
              <el-button size="small" @click="getStaffLog(scope.$index,scope.row)">查看打扫记录</el-button>
              <el-button size="small" @click="editorStaff(scope.$index,scope.row)">编辑</el-button>
              <el-button size="small" type="danger" @click="deletStaff(scope.$index,scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>



        <!-- 添加员工模板 -->
        <el-dialog title="添加员工" v-model="dialogFormVisible" size="tiny" top="100px">
          <el-form :model="addStaffForm"  ref="addStaffForm" label-width="100px" class="demo-ruleForm addStaffForm">
            <el-form-item label="员工名称：">
                <el-input type="text" v-model="addStaffForm.staff_name" auto-complete="off" placeholder="请输入员工名称"></el-input>
            </el-form-item>
            <el-form-item label="手机号码：">
                <el-input type="text" v-model="addStaffForm.mobile" auto-complete="off" placeholder="请输入员工手机号码"></el-input>
            </el-form-item>
            <el-form-item label="状态：">
                <el-radio-group v-model="addStaffForm.status">
                  <el-radio :label="0">正常</el-radio>
                  <el-radio :label="1">禁用</el-radio>
                </el-radio-group>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
              <el-button @click="dialogFormVisible = false">取 消</el-button>
              <el-button type="primary" @click="addStaffSubmit()">确 定</el-button>
          </div>
        </el-dialog>

        <!-- 编辑员工模板 -->
        <el-dialog title="编辑员工" v-model="dialogFormVisible2" size="tiny" top="100px" class="staffWrap">
          <el-form :model="editorStaffForm"  ref="editorStaffForm" label-width="100px" class="demo-ruleForm editorStaffForm">
            <el-form-item label="员工名称：">
                <el-input type="text" v-model="editorStaffForm.staff_name" auto-complete="off" placeholder="请输入员工名称"></el-input>
            </el-form-item>
            <el-form-item label="手机号码：">
                <el-input type="text" v-model="editorStaffForm.mobile" auto-complete="off" placeholder="请输入员工手机号码"></el-input>
            </el-form-item>
            <el-form-item label="状态：">
                <el-radio-group v-model="editorStaffForm.status">
                  <el-radio :label="0">正常</el-radio>
                  <el-radio :label="1">禁用</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="管理门店：" class="mgrStore">
              <el-select v-model="chooseStoreSn" placeholder="请选择">
                <el-option v-for="item in storeListChoose" :key="item.store_sn" :label="item.store_name" :value="item.store_sn"></el-option>
              </el-select>
              <el-button @click="bindStaff()" type="primary">添加门店<i class="el-icon-plus"></i></el-button>
            </el-form-item>
            <el-form-item label="">
              <ul class="showRelationUl">
                <li v-for="(relation,index) in editorStaffForm.relationList" v-bind:key="relation"> {{index + 1}} . {{relation}} <el-button size="small" type="danger" @click="unbindStaff(relation,index)" class="unbindBtn">删  除</el-button> </li>
              </ul>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
              <el-button @click="dialogFormVisible2 = false">取 消</el-button>
              <el-button type="primary" @click="editorStaffSubmit()">确 定</el-button>
          </div>
        </el-dialog>

        <!-- 打扫记录模板 -->
        <el-dialog title="打扫记录" v-model="dialogFormVisible3" size="tiny" top="100px" class="staffLogWrap">
          <!-- 日期框 -->
          <div class="block">
            <el-date-picker v-model="staffLogTime" type="date" placeholder="选择日期" :clearable="false"></el-date-picker>
          </div>
          <!-- 打扫记录表格 -->
          <el-table  class="staffLogTable" v-loading.body="loading2" element-loading-text="拼命加载中" :data="staffLogTableData" max-height="650" border>
            <el-table-column label="日期">
                <template scope="scope">
                    <span>{{ scope.row.finish_time | turnYMD}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="store_name" label="打扫门店"></el-table-column>
            <el-table-column prop="room_name" label="打扫房间"></el-table-column>
            <el-table-column prop="duration_time" label="打扫时段"></el-table-column>
        </el-table>
          <div slot="footer" class="dialog-footer">
              <el-button @click="dialogFormVisible3 = false">关 闭</el-button>
          </div>
        </el-dialog>
    </div>
</template>

<script>
import http from '../../http/Http_base.js'

export default {
  name: 'staffList',
  // 页面加载之后发起数据请求
  mounted(){
      this.getStoreInfo();
      this.getRelationList();
  },
  data () {
    return {
      // 初始化等待动画
      loading: false,

      // 员工信息
      staffInfoData: [],

      // 员工关系数据
      getRelationListData : [],


      // 初始化关闭添加员工模态框
      dialogFormVisible : false,
      // 初始化添加员工data
      addStaffForm : {
        status : 0
      },


      // 初始化编辑员工模态框
      openIndex: "",
      openRow : "",
      dialogFormVisible2 : false,
      // 初始化编辑员工data
      editorStaffForm : {
        status : 0
      },

      // 所有门店列表
      storeList : [],
      storeListChoose : [],
      chooseStoreSn: "",

      // 删除员工
      deleStoreSn : "",

      // 初始化打扫记录模态框
      loading2 : true,
      dialogFormVisible3 : false,
      staffLogTime : new Date(),
      staffLogTableData:[],
      openRow2 : ""
    }
  },
  methods: {
    // 得到门店信息
    getStoreInfo () {
        var self = this;
        var data = {};
        // ajax请求
        http.authHttp.post("/store/getStoreInfo",data).done(function(res) { 
            // 关闭等待动画
            if(res.code == 0){
              self.storeList = res.data 
            }else{
              self.$alert(res.msg, '提示');
            }
        });
    },
    // 得到管理员信息
    getStaffList () {
        var self = this;
        self.loading = true;
        var data = {};
        // ajax请求
        http.authHttp.post("/staff/getStaffList",data).done(function(res) { 
            // 关闭等待动画
            self.loading = false;
            if(res.code == 0){
                self.staffInfoData = res.data;

                // 添加员工关系数组
                for(var q = 0;q < self.staffInfoData.length;q++){
                  self.staffInfoData[q].relationList = [];
                  for(var w = 0;w < self.getRelationListData.length;w++){
                    if(self.staffInfoData[q].staff_sn == self.getRelationListData[w].staff_sn){
                      self.staffInfoData[q].relationList.push(self.getRelationListData[w].store_info.store_name)
                    }
                  };
                  self.staffInfoData[q].relationList = self.staffInfoData[q].relationList.join(",")

                }
            }else{
                self.$alert(res.msg, '提示');
            }
        });
    },
    // 获得门店与员工所属关系
    getRelationList () {
        var self = this;
        var data = {};
        // ajax请求
        http.authHttp.post("/staff/getRelationList",data).done(function(res) { 
            // 关闭等待动画
            if(res.code == 0){
                for(var q = 0;q < res.data.length;q++){
                  res.data[q].staff_info = JSON.parse(res.data[q].staff_info)
                  res.data[q].store_info = JSON.parse(res.data[q].store_info)
                }
                self.getRelationListData = res.data
                self.getStaffList();

            }else{
                self.$alert(res.msg, '提示');
            }
        });
    },
    // 打开添加员工模态框
    addStaff () {
      var self = this;
      self.dialogFormVisible = true
    },
    // 提交添加员工请求
    addStaffSubmit () {
      var self =this;
      var data = self.addStaffForm;
      data.type = 1;
      data.password = '123456';
      // ajax请求
      http.authHttp.post("/staff/addStaff",data).done(function(res) { 
          if(res.code == 0){
            // 新添加员工后重新拉数据
            self.getRelationList();
            // 关闭模态框
            self.dialogFormVisible = false;

            self.$message({
              showClose: true,
              message: '添加成功！',
              type: 'success'
            });
            self.addStaffForm = {
              status : 0
            }
          }else{
            self.$alert(res.msg, '提示');
          }
      });
    },
    // 点击删除员工弹出确认框
    deletStaff(index,row) {
      var self = this;
      self.$confirm('是否删除员工?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        var data = {
          staff_sn : row.staff_sn
        };
        // ajax请求
        http.authHttp.post("/staff/delStaff",data).done(function(res) { 
            if(res.code == 0){
              self.getRelationList();
              self.$message({type: 'success',message: '删除成功!'});
            }else{
              self.$alert(res.msg, '提示');
            }
        });

      }).catch(() => {
        self.$message({type: 'info',message: '已取消删除'});          
      });
    },
    // 模态框拷贝数据
    copyData(row,self){
      self.editorStaffForm = JSON.parse(JSON.stringify(row));
      self.editorStaffForm.status = Number(self.editorStaffForm.status);
    },
    getStaffLog(index,row) {
      var self = this;
      // self.openIndex = index;
      self.openRow2 = row;
      // 打开模态框
      self.dialogFormVisible3 = true;
      var data = {
        staff_sn : row.staff_sn,
        reserve_time : self.commonFucGetUnixTime8(self.staffLogTime)
      };
      // 请求打扫记录
      self.loading2 = true;
      self.getStaffLogData(data)
    },
    // 请求打扫记录
    getStaffLogData(data) {
      var self = this;
        // ajax请求
        http.authHttp.post("/staff/getClearListByStaffSn",data).done(function(res) { 
            if(res.code == 0){
              self.staffLogTableData = res.data.items
            }else{
              self.$alert(res.msg, '提示');
            }
            // 关闭等待动画
            self.loading2 = false;
        });
    },
    // 打开编辑员工模态框
    editorStaff(index,row) {
      var self = this;
      self.openIndex = index;
      self.openRow = row;
      // 打开模态框
      self.dialogFormVisible2 = true;

      self.copyData(row,self);

      // 初始化管理门店input框
      self.chooseStoreSn = "";
      // 将relationList员工门店关系转化为数组
      self.editorStaffForm.relationList = self.editorStaffForm.relationList.split(',');
      if(self.editorStaffForm.relationList.length == 1 && self.editorStaffForm.relationList[0] == ''){
        self.editorStaffForm.relationList=[]
      }

      // 筛选出未添加的门店
      self.storeListChoose = JSON.parse(JSON.stringify(self.storeList));
      for(var i=0;i < self.editorStaffForm.relationList.length;i++){
        for(var j=0;j < self.storeListChoose.length;j++){
          if(self.editorStaffForm.relationList[i] == self.storeListChoose[j].store_name){
            self.storeListChoose.splice(j,1);
          }
        }
      }
    },
    // 员工添加管理的门店
    bindStaff() {
      var self = this;
      var data = {
          store_sn : self.chooseStoreSn,
          staff_sn : self.editorStaffForm.staff_sn
      };
      // ajax请求
      http.authHttp.post("/staff/bindStaff",data).done(function(res) { 
          // 关闭等待动画
          if(res.code == 0){
            self.getRelationList();
            self.dialogFormVisible2 = false;
            self.$message({type: 'success',message: '绑定成功!'});
          }else{
              self.$alert(res.msg, '提示');
          }
      });
    },
    // 删除员工管理的门店
    unbindStaff(relation,index) {
      var self = this;
      for(var j = 0;j < self.storeList.length;j++){
        if(self.storeList[j].store_name == relation){
          self.deleStoreSn = self.storeList[j].store_sn;
        }
      }
      self.$confirm('是否删除该门店?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        var data = {
            store_sn : self.deleStoreSn,
            staff_sn : self.openRow.staff_sn
        }
        // ajax请求
        http.authHttp.post("/staff/unbindStaff",data).done(function(res) { 
            if(res.code == 0){
              self.getRelationList();
              self.dialogFormVisible2 = false;
              self.$message({type: 'success',message: '删除成功!'});
            }else{
              self.$alert(res.msg, '提示');
            }
        });
      }).catch(() => {
        self.$message({type: 'info',message: '已取消删除'});          
      });
    },
    // 保存编辑员工信息
    editorStaffSubmit() {
      var self = this;
      console.log(self.editorStaffForm)
      delete self.editorStaffForm.password;
      var data = self.editorStaffForm;
      // ajax请求
      http.authHttp.post("/staff/editStaff",data).done(function(res) { 
          // 关闭等待动画
          if(res.code == 0){
            self.getRelationList();
            self.dialogFormVisible2 = false;
            self.$message({type: 'success',message: '编辑成功!'});
          }else{
            self.$alert(res.msg, '提示');
          }
      });
    }
  },
  watch: {
        // 监听打扫记录的时间修改
        staffLogTime : function (newValue,oldValue) {
            var self = this;
            var data = {
              staff_sn : self.openRow2.staff_sn,
              reserve_time : self.commonFucGetUnixTime8(newValue)
            }
            // 打开等待动画
            self.loading2 = true;
            self.getStaffLogData(data)
        },
        
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
.normal{
  color:#449d44;
}
.formal{
  color:#d9534f;
}
.staffList .addStoreBtn{
  margin-top: 20px;
}
.staffList .addStoreBtn a{
  color:#fff;
}
.staffList .showRelationUl{
  width : 60%;
  margin-left: 19%;
}
.staffList .showRelationUl li{
  border:1px solid #bfcbd9;
  text-indent:10px;
  margin-top:5px;
  list-style: none
}
.staffList .el-dialog{
  width:576px !important;
}
.staffList .mgrStore{
  margin-bottom: 0
}
.staffList .unbindBtn{
  float:right;
  margin-top:3.5px;
  margin-right:3.5px
}

.staffList .staffLogTable{
  margin-top: 10px
}
</style>
