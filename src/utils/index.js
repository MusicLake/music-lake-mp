import defaultAlbum from "../../static/defaultAlbum.png";

export default {
    resizeImage(vendor, url, width) {
        if (!url) return defaultAlbum;
        if (!width) {
            if (vendor === "qq") {
                width = 150;
            } else {
                width = 140;
            }
        }
        return {
            netease: `${url}?param=${width}y${width}`,
            xiami: `${url}@1e_1c_100Q_${width}w_${width}h`,
            qq: url.replace("300x300", `${width}x${width}`)
        }[vendor];
    }
};
