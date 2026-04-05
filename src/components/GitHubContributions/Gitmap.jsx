/* eslint-disable react/prop-types */
import { useMemo, useRef, useState, useCallback, useEffect } from "react";
import {
  format,
  addDays,
  startOfWeek,
  endOfWeek,
  eachWeekOfInterval,
  getMonth,
  getDate,
  parse,
  startOfDay,
  endOfDay,
} from "date-fns";
import { cn } from "../../lib/utils";

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
const DAY_LABELS = [
  { label: "Mon", row: 1 },
  { label: "Wed", row: 3 },
  { label: "Fri", row: 5 },
];
const DAY_LABEL_WIDTH = 40;
const MONTH_LABEL_HEIGHT = 20;

const LEVEL_COLORS = {
  0: "empty",
  1: "level1",
  2: "level2",
  3: "level3",
  4: "level4",
  5: "level5",
  6: "level6",
  7: "level7",
};

function generateWeeks(from, to, contributions) {
  const map = new Map(contributions.map((c) => [c.date, c]));
  const rangeStart = startOfDay(from);
  const rangeEnd = endOfDay(to);
  const gridStart = startOfWeek(rangeStart, { weekStartsOn: 0 });
  const gridEnd = endOfWeek(rangeEnd, { weekStartsOn: 0 });

  return eachWeekOfInterval(
    { start: gridStart, end: gridEnd },
    { weekStartsOn: 0 },
  ).map((weekStart) => ({
    weekStart,
    days: Array.from({ length: 7 }, (_, d) => {
      const day = addDays(weekStart, d);
      const key = format(day, "yyyy-MM-dd");
      return day >= rangeStart && day <= rangeEnd
        ? (map.get(key) ?? { date: key, count: 0, level: 0 })
        : null;
    }),
  }));
}

function getMonthLabels(weeks, cellSize, cellGap) {
  const labels = [];
  const cellTotal = cellSize + cellGap;
  const minGap = 35;

  weeks.forEach((week, i) => {
    const firstOfMonth = week.days.find(
      (d) => d && getDate(parse(d.date, "yyyy-MM-dd", new Date())) === 1,
    );
    if (firstOfMonth) {
      const date = parse(firstOfMonth.date, "yyyy-MM-dd", new Date());
      const xOffset = i * cellTotal;
      if (
        !labels.length ||
        xOffset - labels[labels.length - 1].xOffset >= minGap
      ) {
        labels.push({ month: MONTHS[getMonth(date)], xOffset });
      }
    }
  });
  return labels;
}

export default function Gitmap({
  contributions = [],
  from = new Date(new Date().getFullYear(), 0, 1),
  to = new Date(),
  colors = {
    empty: "#ebedf0",
    level1: "#9be9a8",
    level2: "#40c463",
    level3: "#30a14e",
    level4: "#216e39",
  },
  cellSize = 10,
  cellGap = 3,
  showMonths = true,
  showDays = true,
  showCounts = false,
  className = "",
}) {
  const containerRef = useRef(null);
  const [responsiveCellSize, setResponsiveCellSize] = useState(cellSize);

  const cellTotal = responsiveCellSize + cellGap;
  const weeks = useMemo(
    () => generateWeeks(from, to, contributions),
    [from, to, contributions],
  );
  const monthLabels = useMemo(
    () => getMonthLabels(weeks, responsiveCellSize, cellGap),
    [weeks, responsiveCellSize, cellGap],
  );

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        setResponsiveCellSize(
          containerWidth < 640 ? Math.max(cellSize - 2, 8) : cellSize,
        );
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [cellSize]);

  const gridHeight = 7 * responsiveCellSize + 6 * cellGap;
  const gridWidth =
    weeks.length * responsiveCellSize + (weeks.length - 1) * cellGap;

  const tooltipRef = useRef(null);
  const [tooltipData, setTooltipData] = useState(null);

  const handleMouseMove = useCallback((e) => {
    const target = e.target;
    const date = target.dataset?.date;
    const count = target.dataset?.count;

    if (tooltipRef.current) {
      tooltipRef.current.style.left = `${e.clientX}px`;
      tooltipRef.current.style.top = `${e.clientY}px`;
      if (date && count !== undefined) {
        setTooltipData({ date, count: parseInt(count, 10) });
        tooltipRef.current.style.opacity = "1";
      } else {
        tooltipRef.current.style.opacity = "0";
      }
    }
  }, []);

  return (
    <div
      className={cn("w-full select-none pb-4", className)}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => (tooltipRef.current.style.opacity = "0")}
    >
      <div className="flex justify-center">
        {/* Day Labels - Sticky và dùng background-color kế thừa để đồng bộ màu */}
        {showDays && (
          <div
            className="relative flex-shrink-0"
            style={{
              width: DAY_LABEL_WIDTH,
              height: gridHeight,
              marginTop: showMonths ? MONTH_LABEL_HEIGHT + 4 : 0,
              position: "sticky",
              left: 0,
              zIndex: 10,
              backgroundColor: "inherit", // Quan trọng: lấy màu của container cha (ví dụ slate-900)
            }}
          >
            {DAY_LABELS.map(({ label, row }) => (
              <span
                key={label}
                className="absolute text-[12px] text-slate-400 font-medium"
                style={{
                  top: row * cellTotal + responsiveCellSize / 2,
                  transform: "translateY(-50%)",
                }}
              >
                {label}
              </span>
            ))}
          </div>
        )}

        {/* Scrollable wrapper */}
        <div
          ref={containerRef}
          className="overflow-x-auto"
          style={{ flex: "0 1 auto" }}
        >
          <div
            style={{
              minWidth: "max-content",
              display: "inline-block",
              padding: "4px",
            }}
          >
            <div className="flex">
              <div className="flex-1">
                {showMonths && (
                  <div
                    className="relative mb-1"
                    style={{ height: MONTH_LABEL_HEIGHT, width: gridWidth }}
                  >
                    {monthLabels.map(({ month, xOffset }, i) => (
                      <span
                        key={`${month}-${i}`}
                        className="absolute text-[12px] text-slate-400 font-medium leading-none"
                        style={{ left: xOffset, whiteSpace: "nowrap" }}
                      >
                        {month}
                      </span>
                    ))}
                  </div>
                )}

                <div
                  className="grid"
                  style={{
                    gridTemplateRows: `repeat(7, ${responsiveCellSize}px)`,
                    gridTemplateColumns: `repeat(${weeks.length}, ${responsiveCellSize}px)`,
                    gap: cellGap,
                    width: gridWidth,
                    height: gridHeight,
                  }}
                >
                  {weeks.map((week, col) =>
                    week.days.map((day, row) => (
                      <div
                        key={`${col}-${row}`}
                        className={cn(
                          "rounded-[2px] transition-all flex items-center justify-center border border-black/5",
                          day
                            ? "cursor-pointer hover:ring-1 hover:ring-slate-400"
                            : "",
                        )}
                        style={{
                          gridRow: row + 1,
                          gridColumn: col + 1,
                          backgroundColor: day
                            ? colors[LEVEL_COLORS[day.level]] || colors.empty
                            : "transparent",
                          width: responsiveCellSize,
                          height: responsiveCellSize,
                        }}
                        data-date={day?.date}
                        data-count={day?.count}
                      >
                        {showCounts && day && day.count > 0 && (
                          <span
                            className="font-mono leading-none pointer-events-none font-bold"
                            style={{
                              fontSize: `${Math.max(responsiveCellSize - 6, 7)}px`,
                              color: day.level <= 2 ? "#1f2937" : "#ffffff",
                            }}
                          >
                            {day.count}
                          </span>
                        )}
                      </div>
                    )),
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tooltip fixed to mouse */}
      <div
        ref={tooltipRef}
        className="pointer-events-none fixed z-50 opacity-0 transition-opacity"
        style={{ transform: "translate(-50%, -100%) translateY(-10px)" }}
      >
        <div className="relative rounded bg-slate-900 px-2 py-1 text-[11px] text-white whitespace-nowrap shadow-xl border border-slate-700">
          {tooltipData && (
            <span>
              <strong>{tooltipData.count} contributions</strong> on{" "}
              {format(
                parse(tooltipData.date, "yyyy-MM-dd", new Date()),
                "MMM d, yyyy",
              )}
            </span>
          )}
          <div
            className="absolute left-1/2 -translate-x-1/2 w-2 h-2 rotate-45 bg-slate-900 border-r border-b border-slate-700"
            style={{ bottom: -4 }}
          />
        </div>
      </div>
    </div>
  );
}
