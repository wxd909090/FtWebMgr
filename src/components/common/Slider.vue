<template>
	 <div class="sidebar">
          <el-menu :default-active="openSliderIndex"  :unique-opened="singelOpen" class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose" theme="dark" router>
<!--               <el-menu-item index="introduction">
                <svg class="icon slider-icon" aria-hidden="true">
                    <use xlink:href="#icon-shuoming"></use>
                </svg>
                系统说明
              </el-menu-item> -->
              <el-submenu index="2">
                  <template slot="title">
                    <svg class="icon slider-icon" aria-hidden="true">
                        <use xlink:href="#icon-mendian"></use>
                    </svg>
                    门店管理
                  </template>
                  <el-menu-item index="storeList">门店列表</el-menu-item>
                  <!-- <el-menu-item index="addStore">门店添加</el-menu-item> -->
                  <el-menu-item index="staffList">门店管理员</el-menu-item>
              </el-submenu>
              <el-submenu index="3">
                  <template slot="title">
                    <svg class="icon slider-icon" aria-hidden="true">
                        <use xlink:href="#icon-tongji"></use>
                    </svg>
                    营业统计
                  </template>
                  <el-menu-item index="storeStream">统计记录</el-menu-item>
              </el-submenu>
              <el-submenu index="4">
                  <template slot="title">
                    <svg class="icon slider-icon" aria-hidden="true">
                        <use xlink:href="#icon-dianying"></use>
                    </svg>
                    电影
                  </template>
                  <el-menu-item index="film">电影管理</el-menu-item>
                  <el-menu-item index="filmXf">电影先锋</el-menu-item>
              </el-submenu>
              <el-submenu index="5">
                  <template slot="title">
                    <svg class="icon slider-icon" aria-hidden="true">
                        <use xlink:href="#icon-47"></use>
                    </svg>
                    用户管理
                  </template>
                  <el-menu-item index="userList">用户列表</el-menu-item>
                  <el-menu-item index="userAssess">用户评价</el-menu-item>
                  <el-menu-item index="statistics">用户分析</el-menu-item>
              </el-submenu>
              <el-submenu index="6">
                  <template slot="title">
                     <svg class="icon slider-icon" aria-hidden="true">
                        <use xlink:href="#icon-shezhi"></use>
                    </svg>
                    设置
                  </template>
                  <el-menu-item index="commonSet">公共设置</el-menu-item>
              </el-submenu>
              <el-submenu index="7">
                  <template slot="title">
                     <svg class="icon slider-icon" aria-hidden="true">
                        <use xlink:href="#icon-huodong"></use>
                    </svg>
                    活动
                  </template>
                  <el-menu-item index="activities">优惠码活动</el-menu-item>
                  <el-menu-item index="groupBuy">团购码活动</el-menu-item>
              </el-submenu>
          </el-menu>
    </div>
</template>

<script>
	export default {
    // 页面加载之后发起数据请求
    created () {
      var self = this;
      //获得当前url
      self.getUrlName();
    },
    data () {
      return {
        openSliderIndex : "",
        // 只能同时打开一个菜单
        singelOpen : true
      }
    },
		methods: {
        handleOpen(key, keyPath) {
            // console.log(key, keyPath);
        },
        handleClose(key, keyPath) {
            // console.log(key, keyPath);
        },
        getUrlName (){
          var self = this;
          self.openSliderIndex = window.location.hash.substring(2);
        }
    },
	}
</script>

<style >
	 /*侧边栏导航*/
    .sidebar{
        display: block;
        position: absolute;
        width: 200px;
        left: 0;
        top: 70px;
        bottom:0;
        background: #2E363F;
    }
    .sidebar > ul {
        height:100%;
    }
    .slider-icon {
      margin-right: 5px
    }
</style>