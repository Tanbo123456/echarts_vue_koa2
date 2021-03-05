<template>
  <div class="com-container">
    <div class="com-chart" ref="rank_ref"></div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      echartInstance: null,
      allData: null,
      startValue: 0,
      endValue: 9,
      timerId: null,
    };
  },
  computed: {},
  watch: {},
  mounted() {
    this.initChart();
    this.getData();
    window.addEventListener("resize", this.screenAdapter);
    this.screenAdapter();
  },
  destroyed() {
    window.removeEventListener("resize", this.screenAdapter);
    clearInterval(this.timerId);
  },
  methods: {
    initChart() {
      this.echartInstance = this.$echarts.init(this.$refs.rank_ref, "chalk");
      const initOption = {
        title: {
          text: "地区销量排名",
          left: 20,
          top: 20,
        },
        xAxis: {
          type: "category",
        },
        yAxis: {
          type: "value",
        },
        series: {
          type: "bar",
        },
        grid: {
          top: "40%",
          left: "5%",
          right: "5%",
          bottom: "2%",
          containLabel: true,
        },
        tooltip: {
          show: true,
        },
      };
      this.echartInstance.setOption(initOption);
      this.echartInstance.on("mouseover", () => {
        clearInterval(this.timerId);
      });
      this.echartInstance.on("mouseout", () => {
        this.startInterval();
      });
    },
    async getData() {
      // 服务器获取数据
      const { data: ret } = await this.$ajax.get("/rank");
      this.allData = ret;
      this.allData.sort((a, b) => {
        return b.value - a.value;
      });
      this.updateChart();
      this.startInterval();
    },
    updateChart() {
      // 更新图表
      // 准备图例数据
      const legendArr = this.allData.map((item) => item.name);
      const seriesArr = this.allData.map((item) => item.value);
      // 准备系列数据
      const colorArr = [
        ["#0BA82C", "#4FF778"],
        ["#2E72BF", "#23E5E5"],
        ["#5052EE", "#AB6EE5"],
      ];
      const dataOption = {
        xAxis: {
          data: legendArr,
        },
        series: {
          data: seriesArr,
          itemStyle: {
            color: (arg) => {
              let targetColorArr = [];
              if (arg.value >= 300) {
                targetColorArr = colorArr[0];
              } else if (arg.value >= 200) {
                targetColorArr = colorArr[1];
              } else {
                targetColorArr = colorArr[2];
              }
              return {
                type: "linear",
                x: 0,
                y: 1,
                x2: 0,
                y2: 0,
                colorStops: [
                  {
                    offset: 0,
                    color: targetColorArr[0],
                  },
                  {
                    offset: 1,
                    color: targetColorArr[1],
                  },
                ],
              };
            },
          },
        },
        dataZoom: {
          show: false,
          startValue: this.startValue,
          endValue: this.endValue,
        },
      };
      this.echartInstance.setOption(dataOption);
    },
    startInterval() {
      if (this.timerId) {
        clearInterval(this.timerId);
      }
      this.timerId = setInterval(() => {
        this.startValue++;
        // console.log(this.startValue);
        this.endValue++;
        if (this.endValue > this.allData.length - 1) {
          this.startValue = 0;
          this.endValue = 9;
        }
        this.updateChart();
      }, 3000);
    },
    screenAdapter() {
      const baseSize = (this.$refs.rank_ref.offsetWidth / 100) * 3.6;
      const adapterOption = {
        title: {
          textStyle: {
            fontSize: baseSize,
          },
        },
        series: [
            {
              barWidth: baseSize,
              itemStyle: {
                barBorderRadius: [baseSize / 2, baseSize / 2, 0, 0],
              },
            },
          ],
      };
      this.echartInstance.setOption(adapterOption);
      this.echartInstance.resize();
    },
  },
};
</script>

<style scoped lang='less'>
</style>
