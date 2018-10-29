<template>
    <div class="discover">
        <navigation-bar backTitle="播放器" backRoute="../index/main"></navigation-bar>
        <banner></banner>
        <rank></rank>
        <artist></artist>
        <mv></mv>
    </div>
</template>
<script>
    import navigationBar from "../../components/navigation-bar.vue";
    import banner from "./components/banner.vue";
    import rank from "./components/rank.vue";
    import artist from "./components/artist.vue";
    import mv from "./components/mv.vue";

    export default {
        components: {
            navigationBar,
            banner,
            rank,
            artist,
            mv
        }
    };
</script>
<style lang="scss" scoped>
    .discover {
        background: #f9f9f9;
    }
</style>
