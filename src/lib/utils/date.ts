// lib/utils/date.ts
export function calculateDuration(startDate: string | Date, endDate: string | Date): string {
  const start = new Date(startDate).getTime();
  const end = new Date(endDate).getTime();
  
  if (isNaN(start) || isNaN(end)) return 'N/A';

  const secondsTotal = Math.floor(Math.max(0, end - start) / 1000);
  const hours = Math.floor(secondsTotal / 3600);
  const minutes = Math.floor((secondsTotal % 3600) / 60);
  const seconds = secondsTotal % 60;

  return `${hours}h ${minutes}mn ${seconds}s`;
}