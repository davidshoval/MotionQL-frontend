/**
 * Measured speed of MotionQL against MongoDB Compass, shown on /compare/compass.
 *
 * Source: tools/bench/compare/results-2026-10-06.md in the desktop app repo (MotionQL-Platform). screenwatch
 * performs the click or key itself and times the screen until the result stops changing, the same way for both
 * apps. Values are medians (p50) of 20 runs over two rounds; p95 in `p95`. Update this file, not the page, when
 * the benchmark is run again.
 */
export interface SpeedRow {
  step: string;
  detail: string;
  motionql: number;
  compass: number;
  motionqlP95: number;
  compassP95: number;
}

export const speedRows: SpeedRow[] = [
  { step: "Open a collection", detail: "100,000 orders, first page of 50", motionql: 81, compass: 219, motionqlP95: 92, compassP95: 248 },
  { step: "Filter", detail: "Indexed city and status", motionql: 77, compass: 353, motionqlP95: 83, compassP95: 369 },
  { step: "Sort on an indexed field", detail: "createdAt, newest first", motionql: 72, compass: 340, motionqlP95: 87, compassP95: 377 },
  {
    step: "Sort on an unindexed field",
    detail: "total, over 100,000 documents",
    motionql: 133,
    compass: 420,
    motionqlP95: 189,
    compassP95: 431,
  },
  { step: "Regex search", detail: "note matches /lorem/", motionql: 79, compass: 391, motionqlP95: 134, compassP95: 409 },
  { step: "Next page", detail: "Page of 50", motionql: 71, compass: 274, motionqlP95: 90, compassP95: 301 },
  { step: "Aggregation", detail: "$match, $group by city, $sort", motionql: 158, compass: 175, motionqlP95: 170, compassP95: 198 },
  { step: "Shell query", detail: "db.orders.find({})", motionql: 64, compass: 485, motionqlP95: 74, compassP95: 520 },
];

export const speedSetup = {
  date: "October 6, 2026",
  machine: "MacBook Air (M1), macOS 15.6",
  server: "Local MongoDB 5.0, the same server and data for both apps",
  versions: "MotionQL 1.2.1, MongoDB Compass 1.51.0",
  method:
    "Each app maximized, table view, 50 documents per page. A script clicks or types for each step and times the screen from that input to the final result, accurate to one display frame. 10 runs per step in each of two rounds; the chart shows the median.",
};
