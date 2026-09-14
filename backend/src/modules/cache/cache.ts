import config from "config"
import NodeCache from "node-cache";

export const cache = new NodeCache({
    stdTTL: Number(config.get("api.cache_time")) || 180
});