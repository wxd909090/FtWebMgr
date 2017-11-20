<template>
    <div class="addStore">
        <!-- 页面头部 -->
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/' }"><i class="el-icon-menu"></i> 门店管理</el-breadcrumb-item>
            <el-breadcrumb-item>门店添加</el-breadcrumb-item>
            <el-breadcrumb-item><router-link to="/storeList" id="return">返回</router-link></el-breadcrumb-item>
        </el-breadcrumb>
        <el-form :model="addStoreForm" :rules="rules2" ref="addStoreForm" label-width="100px" class="demo-ruleForm addStoreForm">
            <el-form-item label="门店名称：" prop="store_name">
                <el-input type="text" v-model="addStoreForm.store_name" auto-complete="off" placeholder="请输入门店名称"></el-input>
            </el-form-item>
            <el-form-item label="门店地址：" prop="address">
                <el-input type="text" v-model="addStoreForm.address" auto-complete="off" placeholder="请输入门店地址" v-on:blur="addressBlur(addStoreForm.address)"></el-input>
            </el-form-item>
            <el-form-item label="纬度坐标：" prop="path_x">
                <el-input type="number" v-model="addStoreForm.path_x" auto-complete="off" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="精度坐标：" prop="path_y">
                <el-input type="number" v-model="addStoreForm.path_y" auto-complete="off" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="省份：" prop="province">
                <el-input type="text" v-model="addStoreForm.province" auto-complete="off" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="城市：" prop="city">
                <el-input type="text" v-model="addStoreForm.city" auto-complete="off" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="地区：" prop="district">
                <el-input type="text" v-model="addStoreForm.district" auto-complete="off" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="门店状态" prop="status">
              <el-radio-group v-model="addStoreForm.status">
                <el-radio label="正常" value="1"></el-radio>
                <el-radio label="禁用" value="0"></el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="门店描述：" prop="info">
              <el-input type="textarea" v-model="addStoreForm.info"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="submitForm('addStoreForm')">立即创建</el-button>
              <el-button @click="resetForm('addStoreForm')">重置</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
import formCheck from '../../common/formCheck.js'
import commonJs from '../../common/common.js'
import http from '../../http/Http_base.js'
export default {
  name: 'addStore',
  data () {
      return {
        addStoreForm: {
            store_name: '',
            address: '',
            info: '',
            status: '正常'
        },
        rules2: {
            store_name: [{required: true, validator: formCheck.checkEmpty,trigger: 'blur'}],
            address: [{required: true, validator: formCheck.checkEmpty,trigger: 'blur'}],
            info: [{required: true, validator: formCheck.checkEmpty,trigger: 'blur'}],
            status: [{ required: true, message: '请选择状态', trigger: 'change'}],
        },
        token : localStorage.getItem('token')
      };
  },
  methods : {
    // 立即创建
    submitForm(formName) {
        // 获取vue对象
        var self = this;
        // 验证表单是否通过前端验证
        self.$refs[formName].validate((valid) => {
            if (valid) {
                // 门店状态
                if(self.addStoreForm.status == '正常'){
                    self.addStoreForm.status = '0';
                }else{
                    self.addStoreForm.status = '1';
                }
                console.log(self.addStoreForm);
                var data = self.addStoreForm;
                http.authHttp.post("/store/createStore",data).done(function(res) { 
                    if(res.code == 0){
                        self.$alert("门店创建成功！", '提示',{
                            confirmButtonText: '确定',
                            callback: action => {
                                self.$router.push({ path: '/storeList' });
                            }
                        });
                    }else{
                        // 后端验证不通过
                        self.$alert(res.msg, '提示');
                    }
                });
            } else {
                // 前端验证不通过
                self.$alert("错误表单信息！", '提示');
                return false;
            }
        });
      },
      // 重置表单
      resetForm(formName) {
          this.$refs[formName].resetFields();
      },
      // 填写地址焦点失去
      addressBlur(address) {
          var self = this;
          if(address !== ""){
              // ajax请求
              var data = {
                  token : self.token,
                  address : address
              };
              http.authHttp.post("/store/getStoreLocation",data).done(function(res) { 
                  if(res.code == 0){
                      // 返回的地址信息添加到表单中
                      self.addStoreForm.path_x = res.data.location.lat;
                      self.addStoreForm.path_y = res.data.location.lng;
                      self.addStoreForm.province = res.data.address_components.province;
                      self.addStoreForm.city = res.data.address_components.city;
                      self.addStoreForm.district = res.data.address_components.district + res.data.title;
                  }else{
                      self.$alert(res.msg, '提示');
                  }
              });
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
.addStore #return{
  cursor: pointer;
}
.addStoreForm{
  width:40%;
  margin:0 auto;
  margin-top:40px
}
</style>
 