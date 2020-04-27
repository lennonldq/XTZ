<template>
  <div class="home">
    <div class="ne">
      <img src="../assets/images/one.png"
           alt="">
      <img src="../assets/images/two.png"
           alt="">
      <img src="../assets/images/3.png"
           alt="">
      <img src="../assets/images/4.png"
           alt="">
      <img src="../assets/images/5.png"
           alt="">
      <img src="../assets/images/6.png"
           alt="">
      <img src="../assets/images/7.png"
           alt="">
    </div>
  </div>
</template>

<script>
export default {
  name: "home",
  data() {
    return {};
  },
  created() {
    // alert(this.baseUrl)
    //this.$ajax.post(this.baseUrl).then()
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.home > .ne {
  padding-top: 40px;
  width: 45%;
  margin: 0 auto;
}
</style>
