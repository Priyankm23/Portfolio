import { Router } from "express";

const router = Router();

// Fetches contribution data using GitHub GraphQL API
router.get("/api/github/contributions", async (req, res) => {
  try {
    const query = `
      query {
        user(login: "Priyankm23") {
          contributionsCollection(from: "2026-01-01T00:00:00Z", to: "2026-12-31T23:59:59Z") {
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

    // Flatten weeks -> days, return all days for the specified year
    const allDays = calendar.weeks.flatMap(w => w.contributionDays);

    // Compute streak
    let streak = 0;
    for (let i = allDays.length - 1; i >= 0; i--) {
      // Ignore future days that might have 0 count (if GitHub returns the whole year)
      if (new Date(allDays[i].date) > new Date()) continue;
      
      if (allDays[i].contributionCount > 0) streak++;
      else break;
    }

    return res.json({
      total: calendar.totalContributions,
      streak,
      days: allDays.map(d => ({
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
