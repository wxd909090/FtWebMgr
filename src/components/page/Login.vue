<template>
    <div class="login-wrap">
        <div class="ms-title">方糖后台管理</div>
        <div class="ms-login">
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="0px" class="demo-ruleForm">
                <el-form-item prop="username">
                    <el-input v-model="ruleForm.username" placeholder="手机号"></el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input type="password" placeholder="密码" v-model="ruleForm.password" @keyup.enter.native="submitForm('ruleForm')"></el-input>
                </el-form-item>
                <div class="login-btn">
                    <el-button type="primary" @click="submitForm('ruleForm')"  v-loading.fullscreen.lock="fullscreenLoading">登录</el-button>
                </div>
            </el-form>
        </div>
    </div>
</template>

<script>
    import http from '../../http/Http_base.js'
    import md5 from 'js-md5';
    import env from '../../env.js';

    export default {
        mounted : function(){
            var self = this;
            self.commondelLocalAllData();
        },
        data: function(){
            return {
                ruleForm: {
                    username: '',
                    password: ''
                },
                rules: {
                    username: [
                        { required: true, message: '请输入用户名', trigger: 'blur' }
                    ],
                    password: [
                        { required: true, message: '请输入密码', trigger: 'blur' }
                    ]
                },
                fullscreenLoading: false
            }
        },
        methods: {
            submitForm(formName) {
                const self = this;
                self.$refs[formName].validate((valid) => {
                    if (valid) {
                        self.ruleForm.password = md5(self.ruleForm.password)
                        var data = {
                            mobile : self.ruleForm.username,
                            password : self.ruleForm.password,
                            type : 2
                        };
                        // 打开等待动画
                        self.fullscreenLoading = true;
                        // ajax请求
                        http.authHttp.post("/common/login",data).done(function(res) { 
                            if(res.code == 0){
                                self.fullscreenLoading = false;
                                var localData = {
                                    mobile : data.mobile,
                                    type : 2,
                                    token : res.data.token
                                }
                                self.commonSetLocalData(localData);
                                self.$router.push('/storeList');
                            }else{
                                self.fullscreenLoading = false;
                                self.$alert(res.msg, '提示');
                                self.ruleForm.password = '';
                            }
                        });
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
        }
    }
</script>

<style scoped>
    .login-wrap{
        position: relative;
        width:100%;
        height:100%;
    }
    .ms-title{
        position: absolute;
        top:50%;
        width:100%;
        margin-top: -230px;
        text-align: center;
        font-size:30px;
        color: #fff;

    }
    .ms-login{
        position: absolute;
        left:50%;
        top:50%;
        width:300px;
        height:160px;
        margin:-150px 0 0 -190px;
        padding:40px;
        border-radius: 5px;
        background: #fff;
    }
    .login-btn{
        text-align: center;
    }
    .login-btn button{
        width:100%;
        height:36px;
    }
</style>