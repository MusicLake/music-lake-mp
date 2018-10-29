import { mapState, mapActions, mapMutations, mapGetters } from "vuex";
import lyric from "./components/lyric.vue";
import album from "./components/album.vue";

export default {
    components: {
        lyric,
        album
    },
    data() {
        return {
            navTop: 20,
            sliderHeight: 15,
            progress: 0
        };
    },

    computed: {
        ...mapState("play", ["song", "pause", "cycle", "duration"]),
        ...mapGetters("play", ["playingProgress"]),
        playPauseClassStr() {
            return `iconfont playPause icon-${this.pause ? "play" : "pause"}`;
        },
        cycleClassStr() {
            return `iconfont third icon-${this.cycle}`;
        },
        coverStyleStr() {
            return this.song ? `background-image: url(${this.song.album.cover.replace("300x300", "150x150")})` : null;
        },
        navBarStyleStr() {
            // return `height: ${this.navTop + 44}px`;
            return `height: ${this.navTop}px`;
        },
        sliderStyleStr() {
            return `margin-bottom: -${this.sliderHeight / 2 - 4}px;`;
        }
    },
    watch: {
        playingProgress(val) {
            this.progress = val;
        }
    },

    methods: {
        ...mapActions("play", ["next", "last", "playAll"]),
        ...mapMutations("play", ["updatePause", "toggleCircle", "setAudioProgress"]),
        async getRankSongs() {
            const data = await this.$http.get("/music/qq/rank", {
                ids: [26]
            });
            const songs = data[0].list.map(item => {
                item.songId = item.id;
                item.vendor = "qq";
                return item;
            });
            this.playAll(songs);
        },
        playPause() {
            this.updatePause(!this.pause);
        },
        collect() {

        },
        sliderChange(event) {
            this.setAudioProgress(event.target.value);
        },
        routeTo(url) {
            wx.navigateTo({
                url
            });
        }
    },
    mounted() {
        // this.routeTo('../discover/main')
        const query = wx.createSelectorQuery();
        query.select("#slider").boundingClientRect();
        query.exec((res) => {
            this.sliderHeight = res[0].height;
        });
    },
    async created() {
        // 调用应用实例的方法获取全局数据
        // this.getUserInfo();
        this.getRankSongs();
        wx.getSystemInfo({
            success: (res) => {
                let nav_top = res.statusBarHeight + 4;
                if (res.platform.toLowerCase() == "android") {
                    nav_top += 4;
                }
                this.navTop = nav_top;
            }
        });
    }
};
