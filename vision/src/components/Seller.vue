<template>
  <div class="com-container">
    <div class="com-chart" ref="seller_ref"></div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      echartInstance: null,
      sellerData: [],
      currentPage: 1,
      pageNum: 5,
      totalPage: 0,
      timerId: null,
    };
  },
  computed: {},
  watch: {},
  mounted() {
    // 初始化chart实例对象，
    //   console.log(this.$echarts)
    this.initChart();
    // 获取数据
    this.getData();

    // 监听屏幕尺寸变化
    window.addEventListener('resize',this.screenAdapter)
  },
  destroyed(){
    clearInterval(this.timerId)
    window.removeEventListener('resize',this.screenAdapter)
  },
  methods: {
    initChart() {
      // 初始化Echart实例
      this.echartInstance = this.$echarts.init(this.$refs.seller_ref, "chalk");
      const initOption = {
        title: {
          text: "商家销量排行",
          left: 20,
          top: 20,
          textStyle: {
            color: "#fff",
          },
        },
        xAxis: {
          type: "value",
        },
        yAxis: {
          type: "category",
        },
        series: [
          {
            type: "bar",
            label:{
                show:true,
                position:'right',
                color:'#fff'
            },
            barWidth:66,
            itemStyle:{
                barBorderRadius:[0,33,33,0]
            }
          },
        ],
        grid:{
            top:'20%',
            left:'3%',
            right:'6%',
            bottom:'3%',
            containLabel:true
        },
        tooltip:{
            trigger:'axis',
            axisPointer:{
                type:'line',
                lineStyle:{
                    width:66,
                    color:'#2D3443'
                }
            }
        }
      };
      this.echartInstance.setOption(initOption);

      // 给Echart实例绑定鼠标进出事件
      this.echartInstance.on("mouseover", () => {
        clearInterval(this.timerId);
      });
      this.echartInstance.on("mouseout", () => {
        this.startAnimation();
      });
    },
    async getData() {
      // 获取数据
      const result = await this.$ajax.get("/seller");
      this.sellerData = result.data;
      // 获取总页码数
      this.totalPage =
        this.sellerData.length % this.pageNum === 0
          ? parseInt(this.sellerData.length / 5)
          : parseInt(this.sellerData.length / 5) + 1;
      this.sellerData.sort((a, b) => {
        return a.value - b.value;
      });
      this.updateChart();
      // 开启动画效果
      this.startAnimation();
    },
    // 设置动画函数
    startAnimation() {
      //情况定时器
      if (this.timerId) {
        clearInterval(this.timerId);
      }
      this.timerId = setInterval(() => {
        // 定时器里面重新设置currentPage
        this.currentPage++;
        if (this.currentPage > this.totalPage) {
          this.currentPage = 1;
        }
        // console.log(this.currentPage);
        this.updateChart();
      }, 3000);
    },
    // 更新数据的函数
    updateChart() {
      // 筛选五条显示的数据
      const start = (this.currentPage - 1) * 5;
      const end = this.currentPage * 5;
      const showData = this.sellerData.slice(start, end);
      // 准备配置对象
      const sellerNames = showData.map((item) => item.name);
      const sellerValues = showData.map((item) => item.value);
      const option = {
        xAxis: {
          max: this.sellerData[this.sellerData.length - 1].value,
        },
        yAxis: {
          data: sellerNames,
        },
        series: [
          {
            data: sellerValues,
          },
        ],
      };
      // 数据配置对象挂载到Echart实例上
      this.echartInstance.setOption(option);
    },

    // 适配屏幕变化
    screenAdapter(){
        // 获取基准尺寸
        const baseSize = this.$refs.seller_ref.offsetWidth/100*3.6
        // const baseSize = 100
        // console.log(this.$refs.seller_ref.offsetWidth);
        // 将基准尺寸设置给图标对应项
        const adapterOption = {
            title:{
                textStyle:{
                    fontSize:baseSize
                }
            },
            tooltip:{
                axisPointer:{
                    lineStyle:{
                        width:baseSize
                    }
                }
            },
            series:[
                {
                    barWidth:baseSize,
                    itemStyle:{
                        barBorderRadius:[0,baseSize/2,baseSize/2,0]
                    }
                }
            ]
        }
        this.echartInstance.setOption(adapterOption)
        this.echartInstance.resize()
    }
  },
};
</script>

<style scoped lang='less'>
</style>
