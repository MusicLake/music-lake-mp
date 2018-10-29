<template>
    <div class="artist">
        <section-title title="歌手" more-route="../../artist/main"></section-title>
        <div class="scroll-view">
            <div v-for="(singer,index) in list" :key="index" class="item">
                <img :src="singer.singer_pic" class="singer-pic"/>
                <p class="name">{{singer.singer_name}}</p>
            </div>
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
                loading: false,
                filter: {
                    area: -100,
                    genre: -100,
                    index: -100,
                    sex: -100
                },
                page: 1,
                total: 0,
                list: []
            };
        },
        methods: {
            async getArtists() {
                this.loading = true;
                const data = await this.$musicApi({
                    vendor: "qq",
                    method: "getArtists",
                    params: [
                        this.page - 1,
                        this.filter
                    ]
                });
                if (data.status) {
                    const _data = data.data;
                    this.list = _data.singerlist;
                    this.total = _data.total;
                } else {
                    this.$message.warning(data.msg);
                }
                this.loading = false;
            }
        },
        created() {
            this.getArtists();
        }
    };
</script>
<style lang="scss" scoped>
    .artist {
        margin: 8vw 2vw;
        .scroll-view {
            display: flex;
            overflow: auto;
            .item {
                display: inline-flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                flex-shrink: 0;
                width: 24vw;
                .singer-pic {
                    @include size(16vw);
                    border-radius: 50%;
                }
                .name {
                    font-size: 4vw;
                    color: $color-sub;
                    width: 100%;
                    text-align: center;
                    @include text-ellipsis;
                }
            }
        }
    }
</style>
