<template>
    <div class="album">
        <img :src="cover" class="cover" v-if="song" :style="coverStyleStr"/>
        <div class="lyric" v-if="lyrics.length">
            <p>{{lyrics[activeIndex][1]}}</p>
        </div>
    </div>
</template>
<script>
    import { mapState, mapGetters } from "vuex";

    export default {
        data() {
            return {
                nextSongFlag: false
            };
        },
        computed: {
            ...mapState("play", ["song", "pause"]),
            ...mapState("lyric", ["lyrics"]),
            ...mapGetters("lyric", ["activeIndex"]),
            cover() {
                return this.song ? this.song.album.cover.replace("300x300", "500x500") : "";
            },
            coverStyleStr() {
                const rs = [];
                if (!this.nextSongFlag) rs.push(`animation: 30s ${this.s.rotate} linear infinite`);
                rs.push(`animation-play-state: ${this.pause ? "paused" : "running"}; `);
                return rs.join("; ");
            }
        },
        watch: {
            song() {
                this.nextSongFlag = true;
                setTimeout(() => {
                    this.nextSongFlag = false;
                }, 500);
            }
        }
    };
</script>
<style lang="scss" scoped>
    .album {
        display: flex;
        flex-direction: column;
        height: 100%;
        .cover {
            $height: 86vw;
            width: $height;
            height: $height;
            border-radius: 50%;
            margin: 10vw auto 0;
            display: block;
            border: 1.2vw solid #777;
            box-sizing: border-box;
        }
        .lyric {
            font-size: 4.4vw;
            color: rgba(255, 255, 255, .75);
            flex: 1;
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 0 4vw;
            margin-bottom: 6vw;
            box-sizing: border-box;
            p {
                white-space: nowrap;
                text-overflow: ellipsis;
                overflow: hidden;
            }
        }
    }
</style>
<style lang="scss" module="s">
    @keyframes rotate {
        to {
            transform: rotate(360deg);
        }
    }
</style>
