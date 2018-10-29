<template>
    <div class="rank">
        <section-title title="排行榜" more-route="../../rank/main"></section-title>
        <div class="item" v-for="(rank,rankIndex) in ranks" :key="rankIndex">
            <div class="cover">
                {{rank.name}}
                <i class="iconfont icon-play"></i>
            </div>
            <img :src="rank.list[0].album.cover" class="background"/>
            <ul>
                <li v-for="(song, songIndex) in rank.list" :key="songIndex">
                    <span>{{songIndex + 1}}. </span>
                    <span>{{song.name}}</span>
                    <span>-</span>
                    <span>
                            <block v-for="(singer,singerIndex) in song.artists" :key="singerIndex">
                                {{singer.name}}
                            </block>
                        </span>
                </li>
            </ul>
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
                ranks: []
            };
        },
        methods: {
            async getRankSongs() {
                const data = await Promise.all([
                    this.$http.get("/music/qq/rank", {
                        ids: [26],
                        limit: 3
                    }),
                    this.$http.get("/music/netease/rank", {
                        ids: [1],
                        limit: 3
                    })
                ]);
                this.ranks = data.map((rank, index) => {
                    rank[0].list = rank[0].list.map(item => {
                        item.songId = item.id;
                        item.vendor = index ? "netease" : "qq";
                        return item;
                    });
                    return rank[0];
                });
            }
        },
        created() {
            this.getRankSongs();
        }
    };
</script>
<style lang="scss" scoped>
    .rank {
        margin: 8vw 2vw;
        .item {
            display: flex;
            position: relative;
            margin-bottom: 1vw;
            .cover {
                display: flex;
                justify-content: center;
                align-items: center;
                $width: 28vw;
                width: $width;
                height: $width;
                background-color: rgba(0, 0, 0, 0.5);
                color: white;
                position: relative;
                font-size: 4vw;
                z-index: 1;
                .icon-play {
                    position: absolute;
                    right: .4vw;
                    bottom: .4vw;
                    font-size: 6vw;
                    color: rgba(255, 255, 255, .8);
                }
            }
            .background {
                $width: 28vw;
                width: $width;
                height: $width;
                position: absolute;
                left: 0;
                top: 0;
                z-index: 0;
            }
            ul {
                display: flex;
                flex-direction: column;
                justify-content: space-around;
                background: white;
                flex: 1;
                padding: 2vw 4vw;
                li {
                    font-size: 4vw;
                    color: #231919;
                }
            }
        }
    }
</style>
