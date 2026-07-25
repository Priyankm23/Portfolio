import { Router } from "express";
import { Redis } from "@upstash/redis";

const router = Router();

// Lazy/Conditional Redis initialization for serverless functions
let redis = null;

const getRedisClient = () => {
  if (redis) return redis;
  
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (url && token) {
    redis = new Redis({ url, token });
    return redis;
  }

  return null;
};

// Increment & fetch visitor count
router.get("/api/visitor-count", async (req, res) => {
  try {
    let visits = 0;
    const client = getRedisClient();
    
    if (client) {
      visits = await client.incr("portfolio:visits");
    } else {
      console.warn("[Redis] Upstash Redis environment variables missing. Returning default visit count.");
    }

    return res.json({
      visit_count: visits
    });

  } catch (err) {
    console.error("[Redis] Error updating visitor count:", err.message || err);
    return res.status(500).json({ error: "server_error", message: err.message });
  }
});

// Full developer portfolio metadata endpoint
router.get("/api/priyank", async (req, res) => {
  try {
    let visits = 0;
    const client = getRedisClient();

    if (client) {
      visits = await client.incr("portfolio:visits");
    }

    return res.json({
      name: "Priyank Moradiya",
      role: "Backend Engineer",
      status: "open_to_work",
      stack: ["Node.js", "Express", "PostgreSQL", "Redis", "gRPC", "RabbitMQ", "Docker", "Python"],
      response_time: "< 24hrs",
      location: "Anand, Gujarat, IN",
      available: true,
      visit_count: visits
    });

  } catch (err) {
    console.error("[Redis] Error fetching portfolio profile:", err.message || err);
    return res.status(500).json({ error: "server_error", message: err.message });
  }
});

export default router;
