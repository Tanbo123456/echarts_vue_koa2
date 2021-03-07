<template>
  <div class="com-container">
    <div class="com-chart" ref="hot_ref"></div>
    <span class="iconfont arr_left" @click="toLeft" :style="comStyle"
      >&#xe6ef;</span
    >
    <span class="iconfont arr_right" @click="toRight" :style="comStyle"
      >&#xe6ed;</span
    >
    <span class="cat-name">{{ catName }}</span>
  </div>
</template>

<script>
export default {
  data() {
    return {
      echartInstance: null,
      allData: null,
      currentIndex: 0,
      baseSize: 0,
    };
  },
  computed: {
    catName() {
      if (!this.allData) {
        return "";
      }
      return this.allData[this.currentIndex].name;
    },
    comStyle() {
      return {
        fontSize: this.baseSize * 2 + "px",
      };
    },
  },
  watch: {},
  created() {
    // 创建时注册回调函数 ，在ws获取数据时会调用
    this.$socket.registerCallBack("hotData", this.getData);
  },
  mounted() {
    // 初始化图表
    this.initChart();
    // 获取数据
    // this.getData();
    this.$socket.send({
      action: "getData",
      socketType: "hotData",
      chartName: "hot",
    });
    // 监听屏幕适配
    window.addEventListener("resize", this.screenAdapter);
    this.screenAdapter();
  },
  destroyed() {
    window.removeEventListener("resize", this.screenAdapter);
    // 注销回调函数
    this.$socket.unRegisterCallBack("hotData");
  },
  methods: {
    initChart() {
      this.echartInstance = this.$echarts.init(this.$refs.hot_ref, "chalk");
      const initOption = {
        title: {
          text: "热销商品销售金额占比统计",
          top: "5%",
          left: 20,
        },
        series: [
          {
            type: "pie",
            width: "40%",
            height: "40%",
            radius: this.baseSize * 3.5,
            label: {
              show: false,
            },
            labelLine: {
              show: false,
            },
            emphasis: {
              label: {
                show: true,
              },
            },
          },
        ],

        legend: {
          top: "20%",
          icon: "circle",
        },
        tooltip: {
          trigger: "item",
          formatter: function (params) {
            let tipArray = [];
            params.data.children.forEach((item) => {
              let childStr = `${item.name}&nbsp;&nbsp;${
                parseInt((item.value / params.value) * 100) + "%"
              }`;
              tipArray.push(childStr);
            });
            return tipArray.join("<br/>");
          },
        },
      };
      this.echartInstance.setOption(initOption);
    },
    getData(data) {
      // 异步获取后台数据
      // const result = await this.$ajax.get("/hot");
      this.allData = data;
      this.updateChart();
    },
    updateChart() {
      // 准备数据
      // 准备系列数据
      const seriesArr = this.allData[this.currentIndex].children.map(
        (item) => ({
          name: item.name,
          value: item.value,
          children: item.children,
        })
      );
      // 准备图例数据
      const legendArr = this.allData[this.currentIndex].children.map(
        (item) => item.name
      );
      const dataOption = {
        legend: {
          data: legendArr,
        },
        series: [
          {
            data: seriesArr,
          },
        ],
      };
      this.echartInstance.setOption(dataOption);
    },
    screenAdapter() {
      this.baseSize = (this.$refs.hot_ref.offsetWidth / 100) * 3.6;
      const adapterOption = {
        title: {
          textStyle: {
            fontSize: this.baseSize,
          },
        },
        series: [
          {
            radius: this.baseSize * 3.5,
            center: ["50%", "60%"],
          },
        ],
        legend: {
          itemWidth: this.baseSize / 2,
          itemHeight: this.baseSize / 2,
          itemGap: this.baseSize / 2,
          textStyle: {
            fontSize: this.baseSize / 2,
          },
        },
      };
      this.echartInstance.setOption(adapterOption);
      this.echartInstance.resize();
    },
    toLeft() {
      this.currentIndex--;
      if (this.currentIndex < 0) {
        this.currentIndex = this.allData.length - 1;
      }
      this.updateChart();
    },
    toRight() {
      this.currentIndex++;
      if (this.currentIndex > this.allData.length - 1) {
        this.currentIndex = 0;
      }
      this.updateChart();
    },
  },
};
</script>

<style scoped lang='less'>
.arr_left {
  position: absolute;
  left: 10%;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  color: white;
}
.arr_right {
  position: absolute;
  right: 10%;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  color: white;
}
.cat-name {
  position: absolute;
  color: white;
  bottom: 5%;
  right: 20%;
}
</style>
