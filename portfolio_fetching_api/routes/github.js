import { Router } from "express";

const router = Router();

// Fetches contribution data using GitHub GraphQL API
router.get("/api/github/contributions", async (req, res) => {
  try {
    const now = new Date();
    const year = now.getUTCFullYear();
    const from = `${year}-01-01T00:00:00Z`;
    const to = `${year}-12-31T23:59:59Z`;

    const query = `
      query {
        user(login: "Priyankm23") {
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

    const response = await fetch("https://api.github.com/graphql", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ query })
    });

    if (!response.ok) {
        throw new Error(`GitHub API Error: ${response.statusText}`);
    }

    const data = await response.json();
    
    if (data.errors) {
        throw new Error(`GraphQL Error: ${data.errors[0].message}`);
    }

    const calendar = data.data.user.contributionsCollection.contributionCalendar;

    // Flatten weeks -> days, then discard future dates so consumers can render a real trailing window.
    const allDays = calendar.weeks.flatMap(w => w.contributionDays);
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    const availableDays = allDays.filter(day => new Date(day.date) <= today);

    // Compute streak
    let streak = 0;
    for (let i = availableDays.length - 1; i >= 0; i--) {
      if (availableDays[i].contributionCount > 0) streak++;
      else break;
    }

    return res.json({
      year,
      total: calendar.totalContributions,
      streak,
      days: availableDays.map(d => ({
        date: d.date,
        count: d.contributionCount
      }))
    });

  } catch (err) {
    console.error("Error fetching GitHub contributions:", err.message);
    return res.status(500).json({ error: "server_error", message: err.message });
  }
});

export default router;
