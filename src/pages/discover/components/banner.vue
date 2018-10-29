<template>
    <swiper :indicator-dots="true"
            :autoplay="true"
            indicator-active-color="rgba(255, 255, 255, .7)"
            style="height: 46vw"
    >
        <swiper-item v-for="(item,index) in list"
                     :key="index"
                     class="swiperItem"
        >
            <img :src="item.picUrl"/>
        </swiper-item>
    </swiper>
</template>
<script>
    export default {
        data() {
            return {
                list: []
            };
        },
        methods: {
            async getBanner() {
                const data = await this.$musicApi({
                    vendor: "netease",
                    method: "getBanner"
                });
                if (data.status) {
                    this.list = data.data;
                } else {
                    this.$message.warning(data.msg);
                }
            }
        },
        created() {
            this.getBanner();
        }
    };
</script>
<style lang="scss" scoped>
    .swiperItem {
        img {
            width: 100%;
            height: 100%;
        }
    }
</style>
