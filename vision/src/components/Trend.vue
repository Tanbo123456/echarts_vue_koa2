<template>
  <div class="com-container">
    <div class="title">
      <span>{{ title }}</span>
      <span class="iconfont title-icon" @click="showChoice = !showChoice" :style="comStyle">&#xe6eb;</span
      >
      <div class="select-con" v-if="showChoice">
        <div
          class="select-item"
          v-for="item in selectTypes"
          :key="item.key"
          @click="handleSelect(item.key)"
        >
          {{ item.text }}
        </div>
      </div>
    </div>
    <div ref="trend_ref" class="com-chart"></div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      AllData: [],
      echartInstance: null,
      dataType: "map",
      showChoice: false,
      baseFontSize:0
    };
  },
  computed: {
    selectTypes() {
      if (!this.AllData || !this.AllData.type) {
        return [];
      } else {
        return this.AllData.type.filter((item) => item.key !== this.dataType);
      }
    },
    title() {
      if (!this.AllData) {
        return "";
      } else {
        return this.AllData[this.dataType].title;
      }
    },
    comStyle(){
        return {
            fontSize:this.baseFontSize+'px'
        }
    }
  },
  watch: {},
  mounted() {
    // 初始化图表
    this.initChart();

    // 获取数据

    this.getData();

    // 调节屏幕适配
    window.addEventListener("resize", this.screenAdapter);
    this.screenAdapter();
  },
  destoryed() {
    window.removeEventListener("resize", this.screenAdapter);
  },
  methods: {
    initChart() {
      this.echartInstance = this.$echarts.init(this.$refs.trend_ref, "chalk");
      const initOption = {
        xAxis: {
          type: "category",
          boundaryGap: false,
        },
        yAxis: {
          type: "value",
        },
        grid: {
          top: "35%",
          left: "3%",
          right: "4%",
          bottom: "2%",
          containLabel: true,
        },
        tooltip: {
          trigger: "axis",
        },
        legend: {
          top: "15%",
          icon: "circle",
          left: 20,
        },
      };
      this.echartInstance.setOption(initOption);
    },
    // 服务器获取数据
    async getData() {
      const result = await this.$ajax("/trend");
      this.AllData = result.data;
      this.updateChart();
    },
    updateChart() {
      const colorArr1 = [
        "rgba(11, 168, 44, 0.5)",
        "rgba(44, 110, 255, 0.5)",
        "rgba(22, 242, 217, 0.5)",
        "rgba(254, 33, 30, 0.5)",
        "rgba(250, 105, 0, 0.5)",
      ];
      // 全透明的颜色值
      const colorArr2 = [
        "rgba(11, 168, 44, 0)",
        "rgba(44, 110, 255, 0)",
        "rgba(22, 242, 217, 0)",
        "rgba(254, 33, 30, 0)",
        "rgba(250, 105, 0, 0)",
      ];
      const timeArr = this.AllData.common.month; // xaxis
      //   console.log(timeArr);
      // map：地区销量趋势
      // seller：商家销量趋势
      // commodity ：商品销量趋势
      const valueArr = this.AllData[this.dataType].data;
      // 五条折线图
      const seriesArr = valueArr.map((item, index) => {
        return {
          name: item.name,
          type: "line",
          data: item.data,
          stack: this.dataType,
          areaStyle: {
            color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: colorArr1[index],
              }, // %0的颜色值
              {
                offset: 1,
                color: colorArr2[index],
              }, // 100%的颜色值
            ]),
          },
        };
      });
      //   console.log(seriesArrs);
      const legendArr = valueArr.map((item) => item.name);
      const dataOption = {
        xAxis: { data: timeArr },
        series: seriesArr,
        legend: {
          data: legendArr,
        },
      };
      this.echartInstance.setOption(dataOption);
    },

    screenAdapter() {
      this.baseFontSize = (this.$refs.trend_ref.offsetWidth / 100) * 3.6;
      const adapterOption = {
          legend:{
              itemWidth:this.baseFontSize,
              itemHeight:this.baseFontSize,
              itemGap:this.baseFontSize,
              textStyle:{
                  fontSize:this.baseFontSize/2
              }
          }
      };
      this.echartInstance.setOption(adapterOption);
      this.echartInstance.resize();
    },

    // 处理选择条目
    handleSelect(key) {
      this.dataType = key;
      this.updateChart();
      this.showChoice = false;
    },
  },
};
</script>

<style scoped lang='less'>
.title {
  position: absolute;
  left: 20px;
  top: 20px;
  z-index: 10;
  color: white;
  .title-icon {
    margin-left: 10px;
    cursor: pointer;
  }
  .select-con{
      background-color: #222733;
  }
  .select-item {
    cursor: pointer;
  }
}
</style>
