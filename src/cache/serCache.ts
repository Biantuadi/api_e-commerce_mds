// cache/userCache.ts
import NodeCache from 'node-cache';

// Le TTL (temps de vie) est configuré ici pour 5 minutes par exemple
const userCache = new NodeCache({ stdTTL: 300 });

export default userCache;
