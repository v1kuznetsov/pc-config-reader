import chalk from "chalk";

export function percentColor(p: number) {
  return p >= 80 ? chalk.green : p >= 40 ? chalk.yellow : chalk.red;
}

export function toMB(bytes: number) {
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

export function toGB(bytes: number) {
  return `${(bytes / 1024 / 1024 / 1024).toFixed(2)} GB`;
}

export function minutesToTime(min: number | null) {
  if (!min || min < 0) return "—";
  const h = Math.floor(min / 60);
  const m = min % 60;
  return `${h}h ${m}m`;
}
