let publishJs = {
  percentNum(num1, num2) {//两个数相除获取百分比
    return (Math.round(num1 / num2 * 10000) / 100.00 + "%");
  }
}
export default publishJs
