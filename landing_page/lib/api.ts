const LOCAL_API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "http://localhost:5000";
const PRODUCTION_API_BASE_URL = "https://portfolio-vq3d.vercel.app/";

const normalizePath = (path: string) =>
  path.startsWith("/") ? path : `/${path}`;

export const getApiUrls = (path: string) => {
  const normalizedPath = normalizePath(path);

  if (process.env.NODE_ENV === "development") {
    return [
      `${LOCAL_API_BASE_URL}${normalizedPath}`,
      `${PRODUCTION_API_BASE_URL}${normalizedPath}`,
    ];
  }

  return [`${PRODUCTION_API_BASE_URL}${normalizedPath}`];
};

export const fetchPortfolioApi = async (path: string, init?: RequestInit) => {
  let lastError: Error | null = null;

  for (const url of getApiUrls(path)) {
    try {
      const response = await fetch(url, init);

      if (response.ok) {
        return response;
      }

      lastError = new Error(`HTTP ${response.status} while fetching ${url}`);
    } catch (error) {
      lastError =
        error instanceof Error ? error : new Error(`Failed to fetch ${url}`);
    }
  }

  throw lastError || new Error(`Failed to fetch ${path}`);
};
