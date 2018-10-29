<template>
    <div class="section-title">
        <span>{{title}}</span>
        <span class="more" v-if="moreRoute" @click="more">更多>></span>
    </div>
</template>
<script>
    export default {
        props: {
            title: String,
            moreRoute: String
        },
        methods: {
            more() {
                wx.navigateTo({
                    url: this.moreRoute
                });
            }
        }
    };
</script>
<style lang="scss" scoped>
    .section-title {
        display: flex;
        justify-content: space-between;
        color: $color-title;
        font-size: 4.4vw;
        margin-bottom: 4vw;
        position: relative;
        padding: 0 3vw;
        line-height: 1;
        width: 100%;
        box-sizing: border-box;
        &::before {
            content: ' ';
            background: $color-primary;
            position: absolute;
            left: 0;
            top: 0;
            height: 100%;
            width: .6vw;
        }
        .more {
            font-size: 4vw;
            color: $color-sub;
        }
    }
</style>
