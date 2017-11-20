<template>
  <div id="app">
      <!-- 头部导航 -->
      <v-head></v-head>
      <v-slider></v-slider>
      <div class="content">
          <transition name="move" mode="out-in"><router-view></router-view></transition>
      </div>
  </div>
</template>

<script>
    import vHead from './/Header.vue';
    import vSlider from './Slider.vue';
    export default {
        data: function (){
            return {
              active:true,
              activeIndex: '1',
              activeIndex2: '1',
              name: 'qi.tang'
            }
        },
        components:{
            vHead,vSlider
        }
  }
</script>

<style>
    body{margin: 0;}
    #app {
      min-width: 1200px;
      margin: 0 auto;
      font-family: "Helvetica Neue","PingFang SC",Arial,sans-serif;
    }
    /* 主内容区 */
    main{    display: -webkit-box;  display: -ms-flexbox;  display: flex;  min-height: 800px;  border: solid 1px #E9ECF1;  background-color: #FCFCFC;  }
    main .main-left{text-align: center;width: 200px;float: left;}
    main .main-right{-webkit-box-flex: 1;  -ms-flex: 1;  flex: 1;  background-color: #fff; padding: 50px 70px; }
    main .el-menu{background-color: transparent!important;}
    .content{
      top: 55px
    }
</style>

