import { Router } from "express";

const router = Router();

// In-memory cache for Vercel serverless functions
let cacheData = null;
let cacheTime = 0;
const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes cache TTL

// Fetches contribution data using GitHub GraphQL API
router.get("/api/github/contributions", async (req, res) => {
  try {
    const now = Date.now();

    // Serve from cache if still valid
    if (cacheData && (now - cacheTime) < CACHE_TTL_MS) {
      return res.json({ ...cacheData, cached: true });
    }

    const currentDate = new Date();
    const year = currentDate.getUTCFullYear();
    const from = `${year}-01-01T00:00:00Z`;
    const to = `${year}-12-31T23:59:59Z`;

    const query = `
      query {
        user(login: "Priyankm23") {
          repositories(privacy: PUBLIC, isFork: false) {
            totalCount
          }
          pullRequests {
            totalCount
          }
          contributionsCollection(from: "${from}", to: "${to}") {
            contributionCalendar {
              totalContributions
              weeks {
                contributionDays {
                  contributionCount
                  date
                }
              }
            }
          }
        }
      }
    `;

    const token = process.env.GITHUB_TOKEN;
    if (!token) {
      console.warn("[GitHub API] Warning: GITHUB_TOKEN is missing in environment variables.");
    }

    const response = await fetch("https://api.github.com/graphql", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        "User-Agent": "portfolio-backend-api"
      },
      body: JSON.stringify({ query })
    });

    if (!response.ok) {
      throw new Error(`GitHub API Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    if (data.errors) {
      throw new Error(`GraphQL Error: ${data.errors[0].message}`);
    }

    const repos = data.data?.user?.repositories?.totalCount || 0;
    const prs = data.data?.user?.pullRequests?.totalCount || 0;
    const calendar = data.data?.user?.contributionsCollection?.contributionCalendar;

    if (!calendar) {
      throw new Error("Unable to parse contribution calendar from GitHub API response.");
    }

    // Flatten weeks -> days, then filter up to current local date
    const allDays = calendar.weeks.flatMap(w => w.contributionDays);
    const localDate = new Date();
    const yearStr = localDate.getFullYear();
    const monthStr = String(localDate.getMonth() + 1).padStart(2, "0");
    const dateStr = String(localDate.getDate()).padStart(2, "0");
    const todayStr = `${yearStr}-${monthStr}-${dateStr}`;

    const availableDays = allDays.filter(day => day.date <= todayStr);

    // Compute streak
    let streak = 0;
    for (let i = availableDays.length - 1; i >= 0; i--) {
      if (availableDays[i].contributionCount > 0) streak++;
      else break;
    }

    const result = {
      year,
      total: calendar.totalContributions,
      repos,
      prs,
      streak,
      days: availableDays.map(d => ({
        date: d.date,
        count: d.contributionCount
      }))
    };

    // Update in-memory cache
    cacheData = result;
    cacheTime = now;

    return res.json({ ...result, cached: false });

  } catch (err) {
    console.error("[GitHub API] Error fetching contributions:", err.message);

    // Fallback to stale cache if available
    if (cacheData) {
      console.warn("[GitHub API] Serving stale cached GitHub data due to API error.");
      return res.json({ ...cacheData, stale: true });
    }

    return res.status(500).json({ error: "server_error", message: err.message });
  }
});

export default router;
