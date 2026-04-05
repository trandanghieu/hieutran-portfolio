export function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(" ");
}

export function formatDate(date: Date, format: string): string {
  const months = [
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
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const d = new Date(date);
  const year = d.getFullYear();
  const month = d.getMonth();
  const date_ = d.getDate();
  const day = d.getDay();

  return format
    .replace("yyyy", year.toString())
    .replace("MMMM", months[month])
    .replace("MMM", months[month])
    .replace("MM", String(month + 1).padStart(2, "0"))
    .replace("dd", String(date_).padStart(2, "0"))
    .replace("d", String(date_))
    .replace("EEEE", days[day])
    .replace("EEE", days[day]);
}
