import { Router } from "express";
import { Redis } from "@upstash/redis";

const router = Router();

// Only initialize redis if upstash environment variables are present
let redis;
if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
    redis = new Redis({
        url: process.env.UPSTASH_REDIS_REST_URL,
        token: process.env.UPSTASH_REDIS_REST_TOKEN,
    });
    
    // Check if Upstash Redis connection is established successfully by sending a ping
    redis.ping()
        .then(res => {
            console.log(`[Redis] Connection established successfully! Ping response: ${res}`);
        })
        .catch(err => {
            console.error("[Redis] Failed to connect to Upstash Redis:", err.message || err);
        });
} else {
    console.warn("[Redis] Warning: No UPSTASH_REDIS_REST_URL or UPSTASH_REDIS_REST_TOKEN provided. Visit count will not increment.");
}

router.get("/api/visitor-count", async (req, res) => {
  try {
    let visits = 0;
    
    if (redis) {
        visits = await redis.incr("portfolio:visits");
    }

    return res.json({
      visit_count: visits
    });

  } catch (err) {
    console.error("[Redis] Error retrieving visitor count:", err);
    return res.status(500).json({ error: "server_error" });
  }
});

export default router;
