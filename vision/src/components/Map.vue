<template>
  <div class="com-container" @dblclick="revertChinaMap">
     <div class="com-chart" ref="map_ref"></div>
  </div>
</template>

<script>
import axios from "axios";
import {getProvinceMapInfo} from "../utils/map_utils";
export default {
  data() {
    return {
      echartInstance:null,
      allData:null
    }
  },
  computed: {
  },
  watch: {
  },
  mounted(){
    this.initChart()
    this.getData()
    window.addEventListener('resize',this.screenAdapter)
    this.screenAdapter()
  },
  destroyed(){
    window.removeEventListener('resize',this.screenAdapter)
  },
  methods: {
    // 图表初始化
    async initChart(){
      this.echartInstance = this.$echarts.init(this.$refs.map_ref,"chalk")
      // 获取中国地图数据
      const result = await axios.get('http://localhost:9999/static/map/china.json')
      // console.log(result);
      const mapData = result.data

      // 注册地图
      this.$echarts.registerMap('china',mapData)
      const initOption = {
        title:{
          text:'商家分布',
          left:20,
          top:20
        },
        geo:{
          type:'map',
          map:'china',
          roam:true,
          top:'5%',
          bottom:'5%',
          itemStyle:{
            areaColor:'#2E72BF',
            borderColor:'#333'
          }
        },
        legend:{
          left:'5%',
          bottom:'5%',
          orient:'vertical'
        }
      }
      this.echartInstance.setOption(initOption)
      // 监听鼠标点击事件
      this.echartInstance.on('click',async arg=>{
        // console.log(arg); arg.name为中文省份名字
        // 需要根据arg.name获取到其拼音名，文件地址名字，如何读取省份名的地图矢量数据
        let provincePath = getProvinceMapInfo(arg.name).path
        let provinceName = getProvinceMapInfo(arg.name).key
        let result2 = await axios.get('http://localhost:9999'+provincePath)
        // 注册省份矢量地图
        this.$echarts.registerMap(provinceName,result2.data)
        // console.log(provincePath,provinceName);
        this.echartInstance.setOption({
          geo:{ // 重新配置map数据
            map:provinceName
          }
        })
      })
      this.getData()
    },

    // 获取数据
    async getData(){
      const result = await this.$ajax.get('/map')
      this.allData = result.data
      this.updateChart()
    },
    updateChart(){
      // 准备图例数据
      const legendData = this.allData.map(item=>item.name) //[]
      // 准备散点数据
      const seriesArr = this.allData.map(item=>({
          type:'effectScatter',
          coordinateSystem:'geo',
          name:item.name,
          data:item.children,
          rippleEffect:{ //涟漪特效配置
             brushType:'stroke',
             scale:4
          }
        }))
      const dataOption = {
        legend:{
          data:legendData
        },
        series:seriesArr
      }
      this.echartInstance.setOption(dataOption)
    },
    screenAdapter(){
      const baseSize = this.$refs.map_ref.offsetWidth/100*3.6

      const adapterOption = {
        title:{
          textStyle:{
            fontSize:baseSize
          }
        },
        legend:{
          itemWidth:baseSize/2,
          itemHeight:baseSize/2,
          itemGap:baseSize/2,
          textStyle:{
            fontSize:baseSize/2
          }
        }
      }
      this.echartInstance.setOption(adapterOption)
      this.echartInstance.resize()
    },

    // 双击回到中国地图
    revertChinaMap(){
      this.echartInstance.setOption({
        geo:{
          map:'china'
        }
      })
    }
   }
}
</script>

<style scoped lang='less'>

</style>
