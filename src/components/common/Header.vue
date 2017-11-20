<template>
	<div class="header">
		<div class="logo">后台管理系统</div>
		<div class="user-info">
			<el-dropdown trigger="click" @command="handleCommand">
				<span class="el-dropdown-link">
					<img class="user-logo" src="/../../static/img/img.jpg">
					{{username}}
				</span>
				<el-dropdown-menu slot="dropdown">
					<el-dropdown-item command="loginout">退出</el-dropdown-item>
				</el-dropdown-menu>
			</el-dropdown>
		</div>
    </div>
</template>

<script>
	export default {
    data: function (){
        return {
          	name: 'linxin'
        }
    },
    methods: {
        handleCommand(command) {
            if(command == 'loginout'){
                // 退出之后，删除本地存储
                localStorage.removeItem('mobile')
                localStorage.removeItem('token')
                this.$router.push('/login');
            }
        }
    },
    computed:{
        username(){
            let username = localStorage.getItem('ms_username');
            return username ? username : this.name;
        }
    },
  }
</script>

<style>
	/* 头部导航 */
    .header{z-index: 1000;min-width: 1200px;transition: all 0.5s ease;background-color: #242f42;  box-shadow: 0 2px 4px 0 rgba(0,0,0,.12),0 0 6px 0 rgba(0,0,0,.04);}
    .header.header-fixed{position: fixed;top: 0;left: 0;right: 0;}
    .header .el-menu-demo{padding-left: 300px!important;}
    .header {
        position: relative;
        box-sizing: border-box;
        width: 100%;
        height: 70px;
        font-size: 22px;
        line-height: 70px;
        color: #fff;
    }
    .header .logo{
        float: left;
        width:200px;
        text-align: center;
    }
    .user-info {
        float: right;
        padding-right: 50px;
        font-size: 16px;
        color: #fff;
    }
    .user-info .el-dropdown-link{
        position: relative;
        display: inline-block;
        padding-left: 50px;
        color: #fff;
        cursor: pointer;
        vertical-align: middle;
    }
    .user-info .user-logo{
        position: absolute;
        left:0;
        top:15px;
        width:40px;
        height:40px;
        border-radius: 50%;
    }
    .el-dropdown-menu__item{
        text-align: center;
    }
</style>