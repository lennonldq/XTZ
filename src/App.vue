<template>
  <div id="app">
    <el-container class="is-vertical" ref="warp">
            <Header v-if="$route.path!='/login'"></Header>
            <keep-alive>
              <router-view v-if="$route.meta.keepAlive" class="mainWarp"></router-view>
            </keep-alive>
            <transition name="fade">
              <router-view v-if="!$route.meta.keepAlive" class="mainWarp"></router-view>
            </transition>
    </el-container>
  </div>
</template>

<script>
  import Header from "./header/header"
  export default {
    name: 'App',
    components:{
      Header
    },

  }
</script>

<style>
@import './style/font/font';
  html, body, div, span, applet, object, iframe,
  h1, h2, h3, h4, h5, h6, p, blockquote, pre,
  a, abbr, acronym, address, big, cite, code,
  del, dfn, em, img, ins, kbd, q, s, samp,
  small, strike, strong, sub, sup, tt, var,
  b, u, i, center,
  dl, dt, dd, ol, ul, li,
  fieldset, form, label, legend,
  table, caption, tbody, tfoot, thead, tr, th, td,
  article, aside, canvas, details, embed,
  figure, figcaption, footer, header, hgroup,
  menu, nav, output, ruby, section, summary,
  time, mark, audio, video {
    margin: 0;
    padding: 0;
    border: 0;
    font-size: 100%;
    /* font: inherit; */
    vertical-align: baseline;
  }
  /* HTML5 display-role reset for older browsers */
  article, aside, details, figcaption, figure,
  footer, header, hgroup, menu, nav, section {
    display: block;
  }
  .is-vertical{
    position: relative;
  }
  body {
    line-height: 1;
    font-family: 'FZCYJ';
  }
  ol, ul {
    list-style: none;
  }
  blockquote, q {
    quotes: none;
  }
  blockquote:before, blockquote:after,
  q:before, q:after {
    content: '';
    content: none;
  }
  table {
    border-collapse: collapse;
    border-spacing: 0;
  }
  input,select,button{
    outline: none;
  }
  button{
    border: none;
  }
  .mainWarp{
    width: 1200px;
    padding:0px !important;
    margin: 0 auto;
    box-shadow: 0 0 18px #d4d2d2;
    margin-bottom: 70px;
    border-radius: 0 0 20px 20px;
  }
  .searchBtn{
    width: 110px;
    height: 30px;
    line-height: 30px;
    text-align: left;
    text-indent: 30px;
    color: #fff;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    background: url("./assets/images/search.png") 72px center no-repeat;
    background-color: #12849c;
    font-size: 15px;
    box-shadow: 2px 2px 5px #b1b0b0
  }
  .fade-enter-active, .fade-leave-active {
    transition: opacity .5s;
  }
  .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
    opacity: 0;
    z-index: 0;
    position: absolute;
    top: 122px;
    left: 0;
    right: 0;
    margin: 0 auto;
  }
  .el-range-input{
    border:2px solid #adadad !important;
    border-radius: 4px;
  }
  .el-input__icon{
    display: none;
  }
</style>
