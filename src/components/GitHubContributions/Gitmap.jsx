/* eslint-disable react/prop-types */
import { useMemo, useRef, useState, useCallback } from "react";
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
const DAY_LABEL_WIDTH = 28;
const MONTH_LABEL_HEIGHT = 15;

const LEVEL_COLORS = {
  0: "empty",
  1: "level1",
  2: "level2",
  3: "level3",
  4: "level4",
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

  weeks.forEach((week, i) => {
    const firstOfMonth = week.days.find(
      (d) => d && getDate(parse(d.date, "yyyy-MM-dd", new Date())) === 1,
    );
    if (firstOfMonth) {
      const date = parse(firstOfMonth.date, "yyyy-MM-dd", new Date());
      const xOffset = i * cellTotal;
      if (!labels.length || xOffset - labels[labels.length - 1].xOffset >= 28) {
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
  const cellTotal = cellSize + cellGap;
  const weeks = useMemo(
    () => generateWeeks(from, to, contributions),
    [from, to, contributions],
  );
  const monthLabels = useMemo(
    () => getMonthLabels(weeks, cellSize, cellGap),
    [weeks, cellSize, cellGap],
  );

  const gridHeight = 7 * cellSize + 6 * cellGap;
  const gridWidth = weeks.length * cellSize + (weeks.length - 1) * cellGap;

  const tooltipRef = useRef(null);
  const gridRef = useRef(null);
  const [tooltipData, setTooltipData] = useState(null);
  const lastCellData = useRef(null);

  const handleMouseMove = useCallback((e) => {
    const target = e.target;
    const date = target.dataset?.date;
    const count = target.dataset?.count;

    if (tooltipRef.current) {
      tooltipRef.current.style.left = `${e.clientX}px`;
      tooltipRef.current.style.top = `${e.clientY}px`;

      if (date && count !== undefined) {
        const newData = { date, count: parseInt(count, 10) };
        lastCellData.current = newData;
        setTooltipData(newData);
      }

      if (gridRef.current) {
        const rect = gridRef.current.getBoundingClientRect();
        const isInGrid =
          e.clientX >= rect.left &&
          e.clientX <= rect.right &&
          e.clientY >= rect.top &&
          e.clientY <= rect.bottom;

        if (isInGrid && lastCellData.current) {
          tooltipRef.current.style.opacity = "1";
        } else if (!isInGrid) {
          tooltipRef.current.style.opacity = "0";
        }
      }
    }
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (tooltipRef.current) {
      tooltipRef.current.style.opacity = "0";
    }
    lastCellData.current = null;
  }, []);

  return (
    <div
      className={cn("relative", className)}
      style={{
        paddingLeft: showDays ? DAY_LABEL_WIDTH : 0,
        paddingTop: showMonths ? MONTH_LABEL_HEIGHT : 0,
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {showMonths && (
        <div
          className="absolute -top-1"
          style={{ left: showDays ? DAY_LABEL_WIDTH : 0 }}
        >
          {monthLabels.map(({ month, xOffset }, i) => (
            <span
              key={`${month}-${i}`}
              className="absolute text-xs text-slate-500 leading-none"
              style={{ left: xOffset }}
            >
              {month}
            </span>
          ))}
        </div>
      )}

      {showDays && (
        <div
          className="absolute left-0"
          style={{
            top: showMonths ? MONTH_LABEL_HEIGHT : 0,
            width: DAY_LABEL_WIDTH,
          }}
        >
          {DAY_LABELS.map(({ label, row }) => (
            <span
              key={label}
              className="absolute text-xs text-slate-500 leading-none right-2"
              style={{
                top: row * cellTotal + cellSize / 2,
                transform: "translateY(-50%)",
              }}
            >
              {label}
            </span>
          ))}
        </div>
      )}

      <div
        ref={gridRef}
        className="grid"
        style={{
          gridTemplateRows: `repeat(7, ${cellSize}px)`,
          gridTemplateColumns: `repeat(${weeks.length}, ${cellSize}px)`,
          gap: cellGap,
          width: gridWidth,
          height: gridHeight,
        }}
      >
        {weeks.map((week, col) =>
          week.days.map((day, row) =>
            day === null ? (
              <div
                key={`${col}-${row}`}
                style={{ gridRow: row + 1, gridColumn: col + 1 }}
              />
            ) : (
              <div
                key={`${col}-${row}`}
                className="rounded-[2px] cursor-pointer hover:ring-1 hover:ring-slate-400 transition-all flex items-center justify-center"
                style={{
                  gridRow: row + 1,
                  gridColumn: col + 1,
                  backgroundColor:
                    colors[LEVEL_COLORS[day.level]] || colors.empty,
                  width: cellSize,
                  height: cellSize,
                  border: "1px solid rgba(0,0,0,0.1)",
                }}
                data-date={day.date}
                data-count={day.count}
              >
                {showCounts && day.count > 0 && (
                  <span
                    className="font-mono leading-none pointer-events-none"
                    style={{
                      fontSize: `${Math.max(6 + (cellSize > 16 ? 2 : cellSize > 14 ? 1 : 0), 5)}px`,
                      color:
                        day.level <= 1
                          ? "#374151"
                          : day.level <= 2
                            ? "#1f2937"
                            : "#ffffff",
                      fontWeight: "600",
                    }}
                  >
                    {day.count}
                  </span>
                )}
              </div>
            ),
          ),
        )}
      </div>

      <div
        ref={tooltipRef}
        className="pointer-events-none fixed z-50 opacity-0 transition-opacity"
        style={{
          transform: "translate(-50%, -100%) translateY(-8px)",
        }}
      >
        <div className="relative rounded-sm bg-slate-900 px-2 py-1 text-xs text-white whitespace-nowrap shadow-lg">
          {tooltipData && (
            <>
              <span className="font-medium">
                {tooltipData.count} contribution
                {tooltipData.count !== 1 ? "s" : ""}
              </span>
              <span className="text-xs ml-1">
                on{" "}
                {format(
                  parse(tooltipData.date, "yyyy-MM-dd", new Date()),
                  "MMM d, yyyy",
                )}
              </span>
            </>
          )}
          <div
            className="absolute left-1/2 -translate-x-1/2 w-2 h-2 rotate-45 bg-slate-900"
            style={{ bottom: -4, borderRadius: "1px" }}
          />
        </div>
      </div>
    </div>
  );
}
