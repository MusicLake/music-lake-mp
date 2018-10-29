<template>
    <div>
        <div :style="statusBarStyleStr"></div>
        <div class="title-bar" v-if="backTitle" @click="back" decode>
            <i class="iconfont icon-last-step"></i>
            <span>{{backTitle}}</span>
        </div>
    </div>
</template>
<script>
    export default {
        props: {
            backTitle: String
        },
        data() {
            return {
                navTop: 20
            };
        },
        computed: {
            statusBarStyleStr() {
                return `height: ${this.navTop}px`;
            }
        },
        methods: {
            back() {
                wx.navigateBack({
                    delta: 1
                });
            }
        },
        created() {
            wx.getSystemInfo({
                success: (res) => {
                    let nav_top = res.statusBarHeight + 4;
                    if (res.platform.toLowerCase() == "android") {
                        nav_top += 4;
                    }
                    this.navTop = nav_top;
                }
            });
        },
        onReady() {
            wx.setNavigationBarColor({
                frontColor: "#000000",
                backgroundColor: "#ffffff"
            });
        }
    };
</script>
<style lang="scss" scoped>
    .title-bar {
        display: flex;
        align-items: center;
        height: 44px;
        line-height: 44px;
        i {
            font-size: 8vw;
        }
        span {
            margin-left: 1.4vw;
            font-size: 5vw;
        }
    }
</style>
