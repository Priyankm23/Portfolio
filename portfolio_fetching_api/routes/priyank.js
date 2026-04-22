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

router.get("/api/priyank", async (req, res) => {
  try {
    let visits = 0;
    
    if (redis && redis.isOpen) {
        visits = await redis.incr("portfolio:visits");
    }

    return res.json({
      name: "Priyank Moradiya",
      role: "Backend Engineer",
      status: "open_to_work",
      CGPA: 9.4,
      College: "G H Patel College of Engineering and Technology, Anand, Gujarat",
      response_time: "< 24hrs",
      backend_stack: "Node.js & Python FastAPI",
      available: true,
      visit_count: visits
    });

  } catch (err) {
    console.error("Error retrieving user info:", err);
    return res.status(500).json({ error: "server_error" });
  }
});

export default router;
