/* eslint-disable react/prop-types */
import { useEffect, useState, useMemo } from "react";
import { subDays, startOfYear, endOfYear, parse } from "date-fns";
import Gitmap from "./Gitmap";

const GITHUB_API = "https://github-contributions-api.jogruber.de/v4";

async function fetchContributions(username) {
  const res = await fetch(`${GITHUB_API}/${username}`);
  if (!res.ok) throw new Error(`Failed to fetch contributions for ${username}`);
  return res.json();
}

function calculateLevel(count) {
  if (count === 0) return 0;
  if (count <= 3) return 1;
  if (count <= 6) return 2;
  if (count <= 9) return 3;
  if (count <= 12) return 4;
  if (count <= 15) return 5;
  if (count <= 20) return 6;
  return 7;
}

export default function GitHubContributions({ username = "trandanghieu" }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedYear, setSelectedYear] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError("");

    fetchContributions(username)
      .then((json) => {
        setData(json);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || "Unable to load contributions");
        setLoading(false);
      });
  }, [username]);

  const years = useMemo(() => {
    if (!data) return [];
    return Object.keys(data.total)
      .map(Number)
      .sort((a, b) => b - a);
  }, [data]);

  const dateRange = useMemo(() => {
    if (selectedYear) {
      return {
        from: startOfYear(new Date(selectedYear, 0, 1)),
        to: endOfYear(new Date(selectedYear, 0, 1)),
        label: String(selectedYear),
      };
    }
    const today = new Date();
    return {
      from: subDays(today, 364),
      to: today,
      label: "Last 365 days",
    };
  }, [selectedYear]);

  const contributions = useMemo(() => {
    if (!data?.contributions) return [];
    return data.contributions.map((c) => ({
      date: c.date,
      count: c.count,
      level: calculateLevel(c.count),
    }));
  }, [data]);

  const colors = {
    empty: "#ebedf0",
    level1: "#c6e48b",
    level2: "#7bc96f",
    level3: "#239a3b",
    level4: "#196127",
    level5: "#0d3c26",
    level6: "#06262d",
    level7: "#05202b",
  };

  const totalContributions = useMemo(() => {
    return contributions
      .filter((c) => {
        const contribDate = parse(c.date, "yyyy-MM-dd", new Date());
        return contribDate >= dateRange.from && contribDate <= dateRange.to;
      })
      .reduce((sum, c) => sum + c.count, 0);
  }, [contributions, dateRange]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-sm text-slate-400">Loading contributions...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-sm text-red-400">{error}</div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h4 className="text-base font-semibold text-white">
          {totalContributions} contributions in{" "}
          {selectedYear ? selectedYear : "the last 365 days"}
        </h4>
        {years.length > 1 && (
          <div className="relative">
            <select
              value={selectedYear?.toString() || ""}
              onChange={(e) =>
                setSelectedYear(e.target.value ? Number(e.target.value) : null)
              }
              className="px-2 py-1 text-xs font-medium text-slate-300 bg-slate-900 border border-slate-700 rounded-md cursor-pointer hover:border-slate-500 hover:bg-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-400 transition-colors appearance-none pr-7"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23a1a1a1' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
                backgroundRepeat: "no-repeat",
                backgroundPosition: "right 6px center",
              }}
            >
              <option value="">Last 365 days</option>
              {years.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Gitmap */}
      <div className="bg-slate-950 border border-slate-800 rounded-lg p-4">
        <Gitmap
          contributions={contributions}
          from={dateRange.from}
          to={dateRange.to}
          colors={colors}
          cellSize={14}
          cellGap={4}
          showMonths={true}
          showDays={true}
          showCounts={true}
        />
      </div>

      {/* Legend */}
      <div className="flex items-center justify-end gap-4 text-xs text-slate-400">
        <span>Less</span>
        <div className="flex gap-1">
          {[
            colors.empty,
            colors.level1,
            colors.level2,
            colors.level3,
            colors.level4,
            colors.level5,
            colors.level6,
            colors.level7,
          ].map((c) => (
            <div
              key={c}
              className="w-3 h-3 rounded-sm"
              style={{ backgroundColor: c, border: "1px solid #404854" }}
            />
          ))}
        </div>
        <span>More</span>
      </div>
    </div>
  );
}
