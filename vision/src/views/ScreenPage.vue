<template>
  <div class="screen-container">
    <header class="screen-header">
      <div>
        <img src="/static/img/header_border_dark.png" alt="" />
      </div>
      <span class="logo">
        <img src="/static/img/logo_dark.png" alt="" />
      </span>
      <span class="title">电商平台实时监控系统</span>    
      <div class="title-right">
        <img src="/static/img/qiehuan_dark.png" class="qiehuan" />
        <span class="datetime">2049-01-01 00:00:00</span>
      </div>
    </header>
    <div class="screen-body">
      <section class="screen-left">
        <div
          id="left-top"
          :class="[fullScreenStatus.trend ? 'full-screen' : '']"
        >
               <!-- 销量趋势图表 -->
          <Trend ref="trend"></Trend>
          <div class="resize">
                <span
              :class="[
                'iconfont',
                fullScreenStatus.trend
                  ? 'icon-compress-alt'
                  : 'icon-expand-alt',
              ]"
              @click="handleChangeSize('trend')"
            ></span>
              
          </div>
        </div>
        <div
          id="left-bottom"
          :class="[fullScreenStatus.seller ? 'full-screen' : '']"
        >
               <!-- 商家销售金额图表 -->
          <Seller ref="seller"></Seller>
          <div class="resize">
                <span
              :class="[
                'iconfont',
                fullScreenStatus.seller
                  ? 'icon-compress-alt'
                  : 'icon-expand-alt',
              ]"
              @click="handleChangeSize('seller')"
            ></span>
              
          </div>
        </div>
      </section>
      <section class="screen-middle">
        <div
          id="middle-top"
          :class="[fullScreenStatus.map ? 'full-screen' : '']"
        >
               <!-- 商家分布图表 -->
              <Map ref="map"></Map>
          <div class="resize">
                <span
              :class="[
                'iconfont',
                fullScreenStatus.map ? 'icon-compress-alt' : 'icon-expand-alt',
              ]"
              @click="handleChangeSize('map')"
            ></span>
              
          </div>
        </div>
        <div
          id="middle-bottom"
          :class="[fullScreenStatus.rank ? 'full-screen' : '']"
        >
               <!-- 地区销量排行图表 -->
              <Rank ref="rank"></Rank>
          <div class="resize">
                <span
              :class="[
                'iconfont',
                fullScreenStatus.rank ? 'icon-compress-alt' : 'icon-expand-alt',
              ]"
              @click="handleChangeSize('rank')"
            ></span>
              
          </div>
        </div>
      </section>
      <section class="screen-right">
        <div
          id="right-top"
          :class="[fullScreenStatus.hot ? 'full-screen' : '']"
        >
               <!-- 热销商品占比图表 -->
              <Hot ref="hot"></Hot>
          <div class="resize">
                <span
              :class="[
                'iconfont',
                fullScreenStatus.hot ? 'icon-compress-alt' : 'icon-expand-alt',
              ]"
              @click="handleChangeSize('hot')"
            ></span>
              
          </div>
        </div>
        <div
          id="right-bottom"
          :class="[fullScreenStatus.stock ? 'full-screen' : '']"
        >
               <!-- 库存销量分析图表 -->
              <Stock ref="stock"></Stock>
          <div class="resize">
                <span
              :class="[
                'iconfont',
                fullScreenStatus.stock
                  ? 'icon-compress-alt'
                  : 'icon-expand-alt',
              ]"
              @click="handleChangeSize('stock')"
            ></span>
              
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
import Hot from "../components/Hot";
import Map from "../components/Map";
import Rank from "../components/Rank";
import Seller from "../components/Seller";
import Stock from "../components/Stock";
import Trend from "../components/Trend";

export default {
  created() {
    this.$socket.registerCallBack("fullScreen", this.recvData);
  },
  data() {
    return {
      fullScreenStatus: {
        hot: false,
        map: false,
        rank: false,
        seller: false,
        stock: false,
        trend: false,
      },
    };
  },
  components: {
    Hot,
    Map,
    Rank,
    Seller,
    Stock,
    Trend,
  },
  computed: {},
  watch: {},
  methods: {
    handleChangeSize(chartName) {
      // // 获取目标状态
      const targetValue = !this.fullScreenStatus[chartName];
      // // 所有图标设置为非全屏
      // Object.keys(this.fullScreenStatus).forEach((item) => {
      //   this.fullScreenStatus[item] = false;
      // });
      // this.fullScreenStatus[chartName] = targetValue;
      // this.$nextTick(() => {
      //   this.$refs[chartName].screenAdapter();
      // });
      this.$socket.send({
        action: "fullScreen",
        socketType: "fullScreen",
        chartName: chartName,
        value: targetValue,
      });
    },
    //全屏联动 接受数据的时候进行操作
    recvData(data) {
      Object.keys(this.fullScreenStatus).forEach((item) => {
        this.fullScreenStatus[item] = false;
      });
      this.fullScreenStatus[data.chartName] = data.value;
      Object.keys(this.fullScreenStatus).forEach((item) => {
        this.$nextTick(() => {
          this.$refs[item].screenAdapter();
        });
      });
    },
  },
  destroyed() {
    this.$socket.unRegisterCallBack("fullScreen");
  },
};
</script>

<style scoped lang='less'>
.screen-container {
  width: 100%;
  height: 100%;
  padding: 0 20px;
  background-color: #161522;
  color: #fff;
  box-sizing: border-box;
}
.screen-header {
  width: 100%;
  height: 40px;
  font-size: 15px;
  position: relative;
  > div {
        img {
      width: 100%;
    }
  }
   .title {
    position: absolute;
    left: 50%;
    top: 40%;
    font-size: 15px;
    transform: translate(-50%, -50%);
  }
   .title-right {
    display: flex;
    align-items: center;
    position: absolute;
    right: 0px;
    top: 40%;
    transform: translateY(-80%);
  }
  .qiehuan {
    width: 28px;
    height: 21px;
    cursor: pointer;
  }
  .datetime {
    font-size: 12px;
    margin-left: 10px;
  }
   .logo {
    position: absolute;
    left: 0px;
    top: 40%;
    transform: translateY(-80%);
      img {
      height: 30px;
      width: 100px;
    }
  }
}
.screen-body {
  width: 100%;
  height: 100%;
  display: flex;
  margin-top: 10px;
   .screen-left {
    height: 100%;
    width: 27.6%;
      #left-top {
      height: 53%;
      position: relative;
    }
      #left-bottom {
      height: 30%;
      margin-top: 15px;
      position: relative;
    }
  }
   .screen-middle {
    height: 100%;
    width: 41.5%;
    margin-left: 1.6%;
    margin-right: 1.6%;
      #middle-top {
      width: 100%;
      height: 56%;
      position: relative;
    }
      #middle-bottom {
      margin-top: 15px;
      width: 100%;
      height: 28%;
      position: relative;
    }
  }
   .screen-right {
    height: 100%;
    width: 27.6%;
      #right-top {
      height: 46%;
      position: relative;
    }
      #right-bottom {
      height: 38%;
      margin-top: 15px;
      position: relative;
    }
  }
}
.resize {
  position: absolute;
  top: 5%;
  right: 20px;
  cursor: pointer;
}
.full-screen {
  position: fixed !important;
  top: 0 !important;
  left: 0 !important;
  width: 100% !important;
  height: 100% !important;
  margin: 0 !important;
  z-index: 100;
}
</style>
