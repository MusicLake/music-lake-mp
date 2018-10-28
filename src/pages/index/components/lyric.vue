<template>
    <div class="lyric" id="lyric">
        <div id="lyric_item_height"></div>
        <i class="iconfont icon-loading" v-if="loading"></i>
        <div class="wrapper" v-else>
            <ul :style="style" class="main" id="lyric_main">
                <li v-for="(item,index) in lyrics"
                    :key="index"
                    :class="{'item': true, 'active': activeIndex === index}"
                >
                    {{item[1]}}
                </li>
            </ul>
        </div>
    </div>
</template>s
<script>
    import { mapState, mapGetters } from "vuex";

    export default {
        data() {
            return {
                half: 6
            };
        },
        computed: {
            ...mapState("lyric", ["lyrics", "loading"]),
            ...mapGetters("lyric", ["activeIndex"]),
            style() {
                let result;
                if (this.activeIndex < this.half) {
                    result = 0;
                } else if (this.lyrics.length - this.activeIndex < this.half) {
                    return;
                } else {
                    result = this.activeIndex - this.half;
                }
                return `transform: translateY(-${result * 9}vw)`;
            }
        },
        mounted() {
            const query = wx.createSelectorQuery();
            query.select("#lyric").boundingClientRect();
            query.select("#lyric_item_height").boundingClientRect();
            query.exec((res) => {
                this.half = parseInt((res[0].height / res[1].height - 1) / 2);
                console.log("set half", this.half);
            });
        }
    };
</script>
<style lang="scss" scoped>
    .lyric {
        height: 100%;
        overflow: hidden;
        padding:4vw 4vw 9vw;
        position: relative;
        box-sizing: border-box;
        $height: 9vw;
        #lyric_item_height {
            height: $height;
            z-index: -1;
            position: absolute;
            left: -999vw;
            top: -999vw;
        }
        .icon-loading {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 100%;
            height: 100%;
            font-size: 14vw;
            animation: loading 1.6s ease infinite;
            @keyframes loading {
                from {
                    transform: rotate(0);
                }
                to {
                    transform: rotate(360deg);
                }
            }
        }
        .wrapper {
            height: 100%;
            overflow: hidden;
            .main {
                transition: all .5s;
                .item {
                    font-size: 4vw;
                    height: $height;
                    line-height: $height;
                    text-align: center;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                    overflow: hidden;
                    color: rgba(255, 255, 255, .7);
                    transform: scale(.9);
                    transition: all .5s;
                    &.active {
                        transform: scale(1);
                        color: #5cadff;
                        transition: all .5s;
                    }
                }
            }
        }
    }
</style>
