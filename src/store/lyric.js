import Vue from "vue";

export default {
    namespaced: true,
    state: {
        show: false,
        lyrics: [],
        translate: [],
        loading: false,
        showTranslate: false
    },
    mutations: {
        update(state, val) {
            for (let i in val) {
                state[i] = val[i];
            }
        }
    },
    actions: {
        async init({ commit }) {
            const playInfo = Vue.$store.state.play.song;
            commit("update", {
                loading: true,
                lyrics: [],
                translate: []
            });
            const data = await Vue.$musicApi.get("/", {
                method: "getLyric",
                restParams: [
                    playInfo.vendor,
                    playInfo.songId
                ]
            });
            commit("update", {
                lyrics: (data.status ? data.data.lyric : []).map(item => {
                    let arr = item[0].match(/^(\d+):(\d+).(\d+)$/);
                    if (arr) {
                        item[0] = parseInt(arr[1]) * 60 * 1000 + parseInt(arr[2]) * 1000 + parseInt(arr[3].padEnd(3, "0"));
                    }
                    return item;
                }).filter(item => item[1]),
                translate: (data.status ? data.data.translate : []).map(item => {
                    let arr = item[0].match(/^(\d+):(\d+).(\d+)$/);
                    if (arr) {
                        item[0] = parseInt(arr[1]) * 60 * 1000 + parseInt(arr[2]) * 1000 + parseInt(arr[3].padEnd(3, "0"));
                    }
                    return item;
                }).filter(item => item[1]),
                loading: false
            });
        }
    },
    getters: {
        activeIndex(state) {
            const cur = Math.floor(Vue.$store.state.play.currentTime * 1000);
            const lyric = state.lyrics;
            let answer = 0;
            lyric.every((item, index) => {
                if (index < lyric.length - 1) { // 非最后一行
                    if (cur >= lyric[index][0] && cur < lyric[index + 1][0]) {
                        if (lyric[index][1].length) {
                            answer = index;
                        } else {
                            if (index === 0) {
                                answer = index;
                            } else {
                                answer = index - 1;
                            }
                        }
                        return false;
                    }
                } else if (cur >= lyric[index][0]) { // 最后一行 & 播放进度大于最后一行的时间
                    answer = index;
                    return false;
                }
                return true;
            });
            return answer;
        },
        hasTranslation(state) {
            return Boolean(state.translate.length);
        }
    }
};
