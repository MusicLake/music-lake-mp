<template>
    <div class="mv">
        <section-title title="最新MV" more-route="../../mv/main"></section-title>
        <div v-for="item in list" class="item">
            <img :src="item.cover"/>
            <p class="name">{{item.name}}</p>
            <p class="artist">{{item.artistName}}</p>
        </div>
    </div>
</template>
<script>
    import sectionTitle from "./section-title.vue";
    export default {
        components: {
            sectionTitle
        },
        data() {
            return {
                list: []
            };
        },
        methods: {
            async getMv() {
                const data = await this.$musicApi({
                    vendor: "netease",
                    method: "getNewestMvs",
                    params: [
                        4
                    ]
                });
                console.log(data);
                if (data.status) {
                    this.list = data.data;
                } else {
                    this.$message.warning(data.msg);
                }
            }
        },
        created() {
            this.getMv();
        }
    };
</script>
<style lang="scss" scoped>
    .mv {
        margin: 8vw 2vw;
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        .item {
            width: 47.5vw;
            margin-bottom: 2vw;
            img {
                width: 100%;
                height: 32vw;
            }
            .name {
                font-size: 3vw;
                color: $color-title;
            }
            .artist {
                font-size: 3vw;
                color: $color-sub;
            }
        }
    }
</style>
