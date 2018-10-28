import Vue from "vue";
import { shuffle } from "lodash";

const audio = wx.getBackgroundAudioManager();

audio.onTimeUpdate(() => {
    Vue.$store.commit("play/updateCurrentTime", audio.currentTime);
});

audio.onCanplay(() => {
    Vue.$store.commit("play/update", {
        duration: audio.duration
    });
});

audio.onEnded(() => {
    Vue.$store.dispatch("play/next");
});

export default {
    namespaced: true,
    state: {
        song: null,
        list: [],
        cycle: "random", // list、single、random
        pause: true,
        currentTime: 0,
        duration: 0,
        shuffleList: [] // 打乱后的数组 用于随机
    },
    mutations: {
        update(state, val) {
            for (let i in val) {
                state[i] = val[i];
            }
        },
        updateSong(state, song) {
            state.song = song;
            if (song) {
                audio.title = song.name;
                audio.epname = song.album.name;
                audio.singer = song.artists[0].name;
                audio.coverImgUrl = song.album.cover;
                audio.webUrl = {
                    qq: `https://i.y.qq.com/v8/playsong.html?songid=${song.songId}`,
                    netease: `https://music.163.com/#/song?id=${song.songId}`,
                    xiami: `https://www.xiami.com/song/${song.songId}`
                }[song.vendor];
            }
        },
        updateList(state, val) {
            state.list = val.filter(item => !item.cp).map(item => Object.freeze(item));
            // 更换列表时如果当前是随机模式 则立即生成
            if (state.cycle === "random") {
                state.shuffleList = shuffle(state.list);
            }
        },
        updatePause(state, val) {
            state.pause = val;
            if (audio.src) {
                if (val) {
                    audio.pause();
                } else {
                    audio.play();
                }
            }
        },
        updateUrl(state, val) {
            if (val) {
                audio.src = val;
            } else {
                audio.stop();
                state.currentTime = state.duration = 0;
            }
        },
        updateCurrentTime(state, val) {
            state.currentTime = val;
        },
        toggleCircle(state) {
            let arr = ["list", "single", "random"];
            state.cycle = arr[(arr.indexOf(state.cycle) + 1) % 3];
            if (state.cycle === "random") {
                state.shuffleList = shuffle(state.list);
            } else {
                state.shuffleList = [];
            }
        },
        setAudioProgress(state, progress) {
            const currentTime = progress * audio.duration / 100;
            state.currentTime = currentTime;
            audio.seek(currentTime);
        }
    },
    actions: {
        async play({ commit, state }, { song, list }) {
            console.log("play", song);
            if (song.cp) {
                Vue.$message.warning("歌曲无法试听");
                return;
            }
            if (list) {
                commit("updateList", list);
            }
            commit("updateCurrentTime", 0);
            commit("updateSong", song);
            commit("updateUrl", null);
            commit("updatePause", true);
            Vue.$store.dispatch("lyric/init");
            const data = await Vue.$musicApi.get("/", {
                method: "getSongUrl",
                restParams: [
                    song.vendor,
                    song.songId,
                    128000
                ]
            });
            if (data.status) {
                commit("updateUrl", data.data.url);
                commit("updatePause", false);
            } else {
                console.warn(data);
                Vue.$message.warning(data.msg);
            }
        },
        playAll({ state, dispatch }, list) {
            const songs = list.filter(item => !item.cp);
            if (!songs.length) {
                Vue.$message.warning("暂无可试听歌曲");
                return;
            }
            const cycle = state.cycle;
            if (cycle === "random") {
                const index = parseInt(Math.random() * (songs.length - 1), 10) + 1;
                dispatch("play", {
                    song: songs[index],
                    list: songs
                });
            } else {
                dispatch("play", {
                    song: songs[0],
                    list: songs
                });
            }
        },
        async next({ dispatch, state, getters }) {
            const listLength = state.list.length;
            if (listLength) {
                let index = getters.playingIndex;
                switch (state.cycle) {
                    case "single":
                        break;
                    case "list":
                        index = (index + 1) % listLength;
                        break;
                    case "random":
                        index = (getters.playingShuffleIndex + 1) % state.shuffleList.length;
                        dispatch("play", {
                            song: state.shuffleList[index]
                        });
                        return;
                }
                dispatch("play", {
                    song: state.list[index]
                });
            }
        },
        async last({ dispatch, state, getters }) {
            const listLength = state.list.length;
            if (listLength) {
                let index = getters.playingIndex;
                switch (state.cycle) {
                    case "single":
                        break;
                    case "list":
                        index = (index + listLength - 1) % listLength;
                        break;
                    case "random":
                        index = (getters.playingShuffleIndex + state.shuffleList.length - 1) % state.shuffleList.length;
                        dispatch("play", {
                            song: state.shuffleList[index]
                        });
                        return;
                }
                dispatch("play", {
                    song: state.list[index]
                });
            }
        }
    },
    getters: {
        playingIndex(state) {
            const cur = state.song;
            for (let i = 0; i < state.list.length; i++) {
                const item = state.list[i];
                if (item.id === cur.id && item.vendor === cur.vendor) {
                    return i;
                }
            }
            return -1;
        },
        playingShuffleIndex(state) {
            const cur = state.song;
            for (let i = 0; i < state.shuffleList.length; i++) {
                const item = state.shuffleList[i];
                if (item.id === cur.id && item.vendor === cur.vendor) {
                    return i;
                }
            }
            return -1;
        },
        playingProgress(state) {
            if (!state.duration) return 0;
            return parseInt(state.currentTime * 100 / state.duration);
        }
    }
};
