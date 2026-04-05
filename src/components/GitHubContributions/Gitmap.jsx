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

function generateMobileGrid(weeks) {
  // Transform weeks grid to mobile grid: 7 rows (days of week) × N columns (weeks)
  return Array.from({ length: 7 }, (_, dayOfWeek) => ({
    dayOfWeek,
    weeks: weeks.map((week) => week.days[dayOfWeek] || null),
  }));
}

function getMonthLabels(weeks, cellSize, cellGap) {
  const labels = [];
  const cellTotal = cellSize + cellGap;
  // Adaptive minimum gap based on cell size
  const minGap = Math.max(cellSize * 8, 80);

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
  const [isMobileMode, setIsMobileMode] = useState(false);

  const cellTotal = responsiveCellSize + cellGap;
  const weeks = useMemo(
    () => generateWeeks(from, to, contributions),
    [from, to, contributions],
  );
  const mobileGrid = useMemo(() => generateMobileGrid(weeks), [weeks]);
  const monthLabels = useMemo(
    () => getMonthLabels(weeks, responsiveCellSize, cellGap),
    [weeks, responsiveCellSize, cellGap],
  );

  // Responsive sizing
  useMemo(() => {
    const calculateCellSize = () => {
      if (!containerRef.current) return cellSize;

      const containerWidth = containerRef.current.offsetWidth;
      const mobile = containerWidth < 768;
      const availableWidth =
        containerWidth - (showDays && !mobile ? DAY_LABEL_WIDTH : 0) - 16; // 16 for padding

      // Mobile: 7 cols (days of week), N rows (weeks)
      // Desktop: N cols (weeks), 7 rows (days of week)
      const cellsPerRow = mobile ? 7 : weeks.length;
      const gapsPerRow = cellsPerRow > 0 ? cellsPerRow - 1 : 0;
      const totalGapWidth = gapsPerRow * cellGap;

      let newCellSize = Math.floor(
        (availableWidth - totalGapWidth) / cellsPerRow,
      );

      // Responsive scaling based on screen size
      if (containerWidth < 640) {
        // Small mobile: smaller cells
        newCellSize = Math.max(Math.floor(newCellSize * 0.8), 6);
      } else if (containerWidth < 1024) {
        // Tablet: medium cells
        newCellSize = Math.max(Math.floor(newCellSize * 0.95), 8);
      }

      // Clamp between reasonable min/max
      return Math.max(6, Math.min(newCellSize, 16));
    };

    const newSize = calculateCellSize();
    setResponsiveCellSize(newSize);
  }, [weeks.length, mobileGrid.length]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        const mobile = containerWidth < 768;
        setIsMobileMode(mobile);

        const availableWidth =
          containerWidth - (showDays && !mobile ? DAY_LABEL_WIDTH : 0) - 16;

        const cellsPerRow = mobile ? 7 : weeks.length;
        const gapsPerRow = cellsPerRow > 0 ? cellsPerRow - 1 : 0;
        const totalGapWidth = gapsPerRow * cellGap;

        let newCellSize = Math.floor(
          (availableWidth - totalGapWidth) / cellsPerRow,
        );

        if (containerWidth < 640) {
          newCellSize = Math.max(Math.floor(newCellSize * 0.8), 6);
        } else if (containerWidth < 1024) {
          newCellSize = Math.max(Math.floor(newCellSize * 0.95), 8);
        }

        setResponsiveCellSize(Math.max(6, Math.min(newCellSize, 16)));
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [weeks.length, mobileGrid.length, cellGap, showDays]);

  const gridHeight = isMobileMode
    ? mobileGrid.length * responsiveCellSize + (mobileGrid.length - 1) * cellGap
    : 7 * responsiveCellSize + 6 * cellGap;
  const gridWidth = isMobileMode
    ? 7 * responsiveCellSize + 6 * cellGap
    : weeks.length * responsiveCellSize + (weeks.length - 1) * cellGap;

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
      ref={containerRef}
      className={cn("relative w-full overflow-x-auto", className)}
      style={{
        paddingLeft: showDays && !isMobileMode ? DAY_LABEL_WIDTH : 0,
        paddingTop: showMonths && !isMobileMode ? MONTH_LABEL_HEIGHT + 4 : 0,
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {showMonths && !isMobileMode && (
        <div
          className="absolute left-0 right-0"
          style={{
            top: "2px",
            left: showDays ? DAY_LABEL_WIDTH : 0,
            height: MONTH_LABEL_HEIGHT,
          }}
        >
          {monthLabels.map(({ month, xOffset }, i) => (
            <span
              key={`${month}-${i}`}
              className="absolute text-xs text-slate-400 font-medium leading-none"
              style={{
                left: xOffset,
                whiteSpace: "nowrap",
              }}
            >
              {month}
            </span>
          ))}
        </div>
      )}

      {showDays && !isMobileMode && (
        <div
          className="absolute left-0 flex flex-col"
          style={{
            top: showMonths ? MONTH_LABEL_HEIGHT + 4 : 0,
            width: DAY_LABEL_WIDTH,
            height: 7 * responsiveCellSize + 6 * cellGap,
            paddingRight: 8,
          }}
        >
          {DAY_LABELS.map(({ label, row }) => (
            <span
              key={label}
              className="absolute text-xs text-slate-500 leading-none"
              style={{
                top: row * cellTotal + responsiveCellSize / 2,
                transform: "translateY(-50%)",
                right: 7,
              }}
            >
              {label}
            </span>
          ))}
        </div>
      )}

      {showDays && isMobileMode && (
        <div
          className="flex gap-1"
          style={{
            marginBottom: "8px",
            justifyContent: "center",
          }}
        >
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <span
              key={day}
              className="text-xs text-slate-500 font-medium"
              style={{
                width: responsiveCellSize,
                textAlign: "center",
              }}
            >
              {day}
            </span>
          ))}
        </div>
      )}

      <div
        ref={gridRef}
        className="grid"
        style={{
          gridTemplateRows: isMobileMode
            ? `repeat(${mobileGrid[0]?.weeks.length || 52}, ${responsiveCellSize}px)`
            : `repeat(7, ${responsiveCellSize}px)`,
          gridTemplateColumns: isMobileMode
            ? `repeat(7, ${responsiveCellSize}px)`
            : `repeat(${weeks.length}, ${responsiveCellSize}px)`,
          gap: cellGap,
          width: gridWidth,
          height: gridHeight,
        }}
      >
        {isMobileMode
          ? mobileGrid.map((dayRow, rowIndex) =>
              dayRow.weeks.map((day, colIndex) =>
                day === null ? (
                  <div
                    key={`${rowIndex}-${colIndex}`}
                    style={{ gridRow: rowIndex + 1, gridColumn: colIndex + 1 }}
                  />
                ) : (
                  <div
                    key={`${rowIndex}-${colIndex}`}
                    className="rounded-[2px] cursor-pointer hover:ring-1 hover:ring-slate-400 transition-all flex items-center justify-center"
                    style={{
                      gridRow: rowIndex + 1,
                      gridColumn: colIndex + 1,
                      backgroundColor:
                        colors[LEVEL_COLORS[day.level]] || colors.empty,
                      width: responsiveCellSize,
                      height: responsiveCellSize,
                      border: "1px solid rgba(0,0,0,0.1)",
                    }}
                    data-date={day.date}
                    data-count={day.count}
                  >
                    {showCounts && day.count > 0 && (
                      <span
                        className="font-mono leading-none pointer-events-none font-bold"
                        style={{
                          fontSize: `${Math.max(8 + (responsiveCellSize > 16 ? 2 : responsiveCellSize > 14 ? 2 : 1), 7)}px`,
                          color: day.level <= 2 ? "#1f2937" : "#ffffff",
                          fontWeight: "700",
                          textShadow:
                            day.level <= 2
                              ? "0 0 2px rgba(255,255,255,0.3)"
                              : "0 0 1px rgba(0,0,0,0.2)",
                        }}
                      >
                        {day.count}
                      </span>
                    )}
                  </div>
                ),
              ),
            )
          : weeks.map((week, col) =>
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
                      width: responsiveCellSize,
                      height: responsiveCellSize,
                      border: "1px solid rgba(0,0,0,0.1)",
                    }}
                    data-date={day.date}
                    data-count={day.count}
                  >
                    {showCounts && day.count > 0 && (
                      <span
                        className="font-mono leading-none pointer-events-none font-bold"
                        style={{
                          fontSize: `${Math.max(8 + (responsiveCellSize > 16 ? 2 : responsiveCellSize > 14 ? 2 : 1), 7)}px`,
                          color: day.level <= 2 ? "#1f2937" : "#ffffff",
                          fontWeight: "700",
                          textShadow:
                            day.level <= 2
                              ? "0 0 2px rgba(255,255,255,0.3)"
                              : "0 0 1px rgba(0,0,0,0.2)",
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
