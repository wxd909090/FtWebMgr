<template>
    <div class="commonSet">
      <div class="des-setting">
        <label for="" class="label">门店押金  </label>
        <el-input v-model="desInput" placeholder="" class="dis-inline"></el-input>
        <el-button type="primary" class="dis-inline subBtn" @click="storeCommonSet">修改</el-button>
      </div>
      <div class="sys-copy-daily">
        <label for="" class="label">拷贝天数  </label>
        <el-input v-model="sysCopyDaily" placeholder="" class="dis-inline"></el-input>
        <el-button type="primary" class="dis-inline subBtn" @click="setSysCopyDaily">修改</el-button>
      </div>
    </div>
</template>

<script>
import http from '../../http/Http_base.js'
export default {
  name: 'hello',
  // 页面加载之后发起数据请求
  mounted(){
      var self = this;
      //获得押金金额
      self.getSetting();
      // 获取系统默认拷贝天数
      self.getSysCopyDaily();
  },
  data () {
    return {
      // 押金金额
      desInput: "",
      // 系统拷贝天数
      sysCopyDaily:""
    }
  },
  methods:{
    // 获取押金金额
    getSetting() {
      var self = this;
      http.authHttp.post("/setting/getSetting").done(function(res) { 
        if(res.code == 0){
           self.desInput = res.data.deposit
        }else{
            self.$alert(res.msg, '提示');
        }
      });
    },
    // 获取系统默认拷贝天数
    getSysCopyDaily(){
      var self = this;
      http.authHttp.post("/setting/getSysCopyDaily").done(function(res) { 
        if(res.code == 0){
           self.sysCopyDaily = res.data.max_reserve_day
        }else{
            self.$alert(res.msg, '提示');
        }
      });
    },
    // 设置押金金额
    storeCommonSet (){
      var self = this;
      var re = /^[0-9]+$/ ;
      var result = re.test(self.desInput);
      if(!result){
        self.$message({type: 'error',message: '请输入大于0的整数!'});
        return;
      }
      var data = {
        deposit : self.desInput
      };
      http.authHttp.post("/setting/setSetting",data).done(function(res) { 
        if(res.code == 0){
          self.$message({type: 'success',message: '修改成功!'});
        }else{
            self.$alert(res.msg, '提示');
        }
      });
    },
    // 设置系统拷贝时间
    setSysCopyDaily (){
      var self = this;
      var re = /^[1-9]$|^10$/ ;
      var result = re.test(self.sysCopyDaily);
      if(!result){
          self.$message({type: 'error',message: '请输入大于0小于11的整数!'});
          return;
      }
      var data = {
        day : self.sysCopyDaily
      };
      http.authHttp.post("/setting/setSysCopyDaily",data).done(function(res) { 
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
.dis-inline{
  display: inline-block;
  width: auto
}
.label{
  font-size: 14px;
  color: #48576a;
  padding: 11px 12px 11px 0;
}
.subBtn{
  margin-left: 10px
}
.sys-copy-daily{
  margin-top: 20px
}
</style>
