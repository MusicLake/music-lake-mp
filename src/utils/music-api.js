import Fly from "flyio/dist/npm/wx";
import Vue from "vue";

const fly = new Fly;

fly.config.baseURL = "https://suen-music-api.leanapp.cn";
// fly.config.baseURL = "http://localhost:3000";
fly.config.timeout = 30 * 1000;
fly.config.headers = {
    "Content-Type": "application/x-www-form-urlencoded"
};
fly.interceptors.response.use(
    response => response.data,
    e => {
        console.warn(e);
        if (e.response) {
            const data = e.response.data;
            if (e.response.status === 502) {
                Vue.$message.warning("服务端可能正在发版本~请稍后重试");
            } else if (data.error) {
                Vue.$message.warning(data.error);
            }
        } else {
            Vue.$message.warning("请检查网络连接");
        }
        return Promise.reject(e);
    }
);

export default function({ vendor, method, params }) {
    const arvgs = {
        method
    };
    if (vendor) {
        arvgs.vendor = vendor;
    }
    if (params) {
        arvgs.params = JSON.stringify(params);
    }
    return fly.get("/", arvgs);
};
