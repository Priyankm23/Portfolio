import { Router } from "express";
import { createClient } from "redis";

const router = Router();

// Only initialize redis if url is present
let redis;
if (process.env.REDIS_URL) {
    redis = createClient({ url: process.env.REDIS_URL });
    redis.on('error', err => console.error('Redis Client Error', err));
    redis.connect().catch(console.error);
} else {
    console.warn("No REDIS_URL provided. Visit count will not increment correctly.");
}

router.get("/api/visitor-count", async (req, res) => {
  try {
    let visits = 0;
    
    if (redis && redis.isOpen) {
        visits = await redis.incr("portfolio:visits");
    }

    return res.json({
      visit_count: visits
    });

  } catch (err) {
    console.error("Error retrieving visitor count:", err);
    return res.status(500).json({ error: "server_error" });
  }
});

export default router;
