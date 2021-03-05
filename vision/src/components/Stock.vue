<template>
  <div class="com-container">
    <div class="com-chart" ref="stock_ref"></div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      echartInstance: null,
      allData: null,
      currentIndex: 0,
      timerId: null,
      baseSize: 0,
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
      this.echartInstance = this.$echarts.init(this.$refs.stock_ref, "chalk");
      const centerArr = [
        ["18%", "40%"],
        ["50%", "40%"],
        ["82%", "40%"],
        ["34%", "75%"],
        ["66%", "75%"],
      ];

      const initOption = {
        title: {
          text: "库存-销量图",
          top: 20,
          left: 20,
        },
        series: [
          {
            type: "pie",
            center: centerArr[0],
            labelLine: {
              show: false,
            },
            radius: [this.baseSize * 2, this.baseSize * 1.7],
            label: {
              position: "center",
              fontSize: this.baseSize / 2,
            },
            hoverAnimation: false,
          },
          {
            type: "pie",
            center: centerArr[1],
            labelLine: {
              show: false,
            },
            radius: [this.baseSize * 2, this.baseSize * 1.7],
            label: {
              position: "center",
              fontSize: this.baseSize / 2,
            },
            hoverAnimation: false,
          },
          {
            type: "pie",
            center: centerArr[2],
            labelLine: {
              show: false,
            },
            radius: [this.baseSize * 2, this.baseSize * 1.7],
            label: {
              position: "center",
              fontSize: this.baseSize / 2,
            },
            hoverAnimation: false,
          },
          {
            type: "pie",
            center: centerArr[3],
            labelLine: {
              show: false,
            },
            radius: [this.baseSize * 2, this.baseSize * 1.7],
            label: {
              position: "center",
              fontSize: this.baseSize / 2,
            },
            hoverAnimation: false,
          },
          {
            type: "pie",
            center: centerArr[4],
            labelLine: {
              show: false,
            },
            radius: [this.baseSize * 2, this.baseSize * 1.7],
            label: {
              position: "center",
              fontSize: this.baseSize / 2,
            },
            hoverAnimation: false,
          },
        ],
      };
      this.echartInstance.setOption(initOption);
      this.echartInstance.on("mouseover", () => {
        clearInterval(this.timerId);
      });
      this.echartInstance.on("mouseout", () => {
        this.startInverval();
      });
    },
    async getData() {
      // 获取后台数据
      const { data: ret } = await this.$ajax.get("/stock");
      this.allData = ret;
      this.updateChart();
      // 获取数据成功后启动动画
      this.startInverval();
    },
    updateChart() {
      // 准备数据
      // 五个圆环中心
      const colorArrs = [
        ["#4FF778", "#0BA82C"],
        ["#E5DD45", "#E8B11C"],
        ["#E8821C", "#E55445"],
        ["#5052EE", "#AB6EE5"],
        ["#23E5E5", "#2E72BF"],
      ];
      const showData = this.allData.slice(
        this.currentIndex,
        this.currentIndex + 5
      );
      const seriesArr = showData.map((item, index) => {
        return {
          label: {
            color: colorArrs[index][0],
          },
          data: [
            {
              value: item.sales,
              name: item.name + "\n\n" + item.sales,
              itemStyle: {
                color: {
                  type: "linear",
                  x: 0,
                  y: 1,
                  x2: 0,
                  y2: 0,
                  colorStops: [
                    {
                      offset: 0,
                      color: colorArrs[index][0],
                    },
                    {
                      offset: 1,
                      color: colorArrs[index][1],
                    },
                  ],
                },
                // color:colorArrs[index][1]
              },
            },
            {
              value: item.stock,
              itemStyle: {
                color: "#333843",
              },
            },
          ],
        };
      });
      const dataOption = {
        series: seriesArr,
      };
      //显示图表数据
      this.echartInstance.setOption(dataOption);
    },
    screenAdapter() {
      this.baseSize = (this.$refs.stock_ref.offsetWidth / 100) * 3.6;
      const adapterOption = {
        title: {
          textStyle: {
            fontSize: this.baseSize,
          },
        },
        series: [
          {
            type: "pie",
            radius: [this.baseSize * 2, this.baseSize * 1.7],
            label: {
              fontSize: this.baseSize / 2,
            },
          },
          {
            type: "pie",
            radius: [this.baseSize * 2, this.baseSize * 1.7],
            label: {
              fontSize: this.baseSize / 2,
            },
          },
          {
            type: "pie",
            radius: [this.baseSize * 2, this.baseSize * 1.7],
            label: {
              fontSize: this.baseSize / 2,
            },
          },
          {
            type: "pie",
            radius: [this.baseSize * 2, this.baseSize * 1.7],
            label: {
              fontSize: this.baseSize / 2,
            },
          },
          {
            type: "pie",
            radius: [this.baseSize * 2, this.baseSize * 1.7],
            label: {
              fontSize: this.baseSize / 2,
            },
          },
        ],
      };
      this.echartInstance.setOption(adapterOption);
      this.echartInstance.resize();
    },
    startInverval() {
      if (this.timerId) {
        clearInterval(this.timerId);
      }
      this.timerId = setInterval(() => {
        this.currentIndex += 5;
        if (this.currentIndex > this.allData.length - 1) {
          this.currentIndex = 0;
        }
        this.updateChart();
      }, 5000);
    },
  },
};
</script>

<style scoped lang='less'>
</style>
