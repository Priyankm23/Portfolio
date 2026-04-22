"use client";

import { useState } from "react";

export const TerminalPanel = ({ className }: { className?: string }) => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFetch = async () => {
    setLoading(true);
    setData(null);
    setError(null);

    try {
      const response = await fetch("http://localhost:5000/api/priyank");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const jsonData = await response.json();
      setData(jsonData);
    } catch (err) {
      console.error("API Fetch Error:", err);
      setError(
        err instanceof Error ? err.message : "Failed to connect to local API",
      );
    } finally {
      setLoading(false);
    }
  };

  const renderJsonLine = (
    key: string,
    value: any,
    isLast: boolean,
    depth = 1,
  ) => {
    let valueColor = "var(--ink)";
    let valueStr = String(value);

    if (typeof value === "string") {
      valueColor = "var(--accent)";
      valueStr = `"${value}"`;
    } else if (typeof value === "number" || typeof value === "boolean") {
      valueColor = "var(--accent-2)";
    } else if (Array.isArray(value)) {
      valueStr = `[${value.map((v) => `"${v}"`).join(", ")}]`;
      return (
        <div key={key} style={{ paddingLeft: `${depth * 16}px` }}>
          <span style={{ color: "var(--ink)" }}>"{key}"</span>
          <span style={{ color: "var(--muted)" }}>: </span>
          <span style={{ color: "var(--accent)" }}>[</span>
          {value.map((v, i) => (
            <span key={i}>
              <span style={{ color: "var(--accent)" }}>"{v}"</span>
              {i < value.length - 1 && (
                <span style={{ color: "var(--muted)" }}>, </span>
              )}
            </span>
          ))}
          <span style={{ color: "var(--accent)" }}>]</span>
          {!isLast && <span style={{ color: "var(--muted)" }}>,</span>}
        </div>
      );
    }

    return (
      <div key={key} style={{ paddingLeft: `${depth * 16}px` }}>
        <span style={{ color: "var(--ink)" }}>"{key}"</span>
        <span style={{ color: "var(--muted)" }}>: </span>
        <span style={{ color: valueColor }}>{valueStr}</span>
        {!isLast && <span style={{ color: "var(--muted)" }}>,</span>}
      </div>
    );
  };

  return (
    <div
      className={className || "w-full md:w-[38%] min-w-[320px] max-w-[750px] mx-auto md:mx-0 backdrop-blur-md"}
      style={{
        background:
          "color-mix(in srgb, var(--color-bg, var(--bg, #0a0a0a)) 75%, transparent)",
        border: "1px solid var(--border)",
        borderRadius: "8px",
        overflow: "hidden",
        boxShadow: "var(--shadow)",
        zIndex: 20,
      }}
    >
      {/* Mac/PC OS Header */}
      <div
        style={{
          background:
            "color-mix(in srgb, var(--color-surface-2, var(--surface-2, #1a1a1a)) 75%, transparent)",
          padding: "8px 12px",
          display: "flex",
          alignItems: "center",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <div style={{ display: "flex", gap: "6px" }}>
          <div
            style={{
              width: "12px",
              height: "12px",
              borderRadius: "50%",
              background: "#ff5f56",
            }}
          />
          <div
            style={{
              width: "12px",
              height: "12px",
              borderRadius: "50%",
              background: "#ffbd2e",
            }}
          />
          <div
            style={{
              width: "12px",
              height: "12px",
              borderRadius: "50%",
              background: "#27c93f",
            }}
          />
        </div>
        <div
          style={{
            flex: 1,
            textAlign: "center",
            fontFamily: '"IBM Plex Mono", monospace',
            fontSize: "12px",
            color: "var(--muted)",
          }}
        >
          bash — curl
        </div>
      </div>

      {/* Terminal Content */}
      <div
        style={{
          padding: "20px",
          fontFamily: '"IBM Plex Mono", monospace',
          fontSize: "13px",
          lineHeight: 1.6,
        }}
      >
        <div style={{ color: "var(--ink)", marginBottom: "16px" }}>
          <span style={{ color: "var(--accent)" }}>priyank@local</span>
          <span style={{ color: "var(--muted)" }}>:</span>
          <span style={{ color: "#3b82f6" }}>~</span>
          <span style={{ color: "var(--muted)" }}>$ </span>
          curl http://localhost:5000/api/priyank
        </div>

        <button
          onClick={handleFetch}
          disabled={loading}
          style={{
            background: "var(--border)",
            color: "var(--ink)",
            border: "1px solid var(--border-hot)",
            padding: "6px 16px",
            borderRadius: "4px",
            cursor: loading ? "wait" : "pointer",
            fontFamily: '"IBM Plex Mono", monospace',
            fontSize: "12px",
            marginBottom: "16px",
            transition: "all 0.2s",
          }}
          onMouseEnter={(e) => {
            if (!loading) {
              e.currentTarget.style.borderColor = "var(--accent)";
              e.currentTarget.style.color = "var(--accent)";
            }
          }}
          onMouseLeave={(e) => {
            if (!loading) {
              e.currentTarget.style.borderColor = "var(--border-hot)";
              e.currentTarget.style.color = "var(--ink)";
            }
          }}
        >
          {loading ? "Fetching..." : "Send Request"}
        </button>

        {/* Output */}
        <div style={{ minHeight: "220px" }}>
          {loading && (
            <div style={{ color: "var(--muted)" }}>
              &gt; Connecting to localhost:5000...
              <br />
              &gt; Waiting for response...
            </div>
          )}

          {error && (
            <div style={{ color: "var(--red)", marginTop: "8px" }}>
              Error: {error}
              <br />
              <span className="text-muted text-[11px] mt-2 block italic">
                (Note: Ensure your local server at port 5000 is running and CORS
                is enabled)
              </span>
            </div>
          )}

          {data && (
            <div>
              <div style={{ color: "var(--accent)", marginBottom: "8px" }}>
                HTTP/1.1 200 OK
              </div>
              <div style={{ color: "var(--muted)" }}>{"{"}</div>
              {Object.entries(data).map(([k, v], i, arr) =>
                renderJsonLine(k, v, i === arr.length - 1),
              )}
              <div style={{ color: "var(--muted)" }}>{"}"}</div>
            </div>
          )}

          {!loading && !data && !error && (
            <div style={{ color: "var(--muted)", fontStyle: "italic" }}>
              Waiting for command execution...
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export const HeroPanel = ({ animated }: { animated: boolean }) => {
  return (
    <div
      className="w-full md:w-[55%] lg:w-[50%] mt-12 md:mt-0 flex justify-center items-center"
      style={{
        opacity: animated ? 1 : 0,
        transform: animated ? "translateY(0)" : "translateY(20px)",
        transition: "opacity 0.6s ease 0.4s, transform 0.6s ease 0.4s",
      }}
    >
      <TerminalPanel />
    </div>
  );
};
