/**
 * Utility to check if a date string falls within a specified number of days.
 * Handles both real-world fresh data and older mock/seed datasets gracefully.
 */
export const isDateWithinDays = (
  dateStr: string | null | undefined,
  days: string,
  allDates?: (string | null | undefined)[]
): boolean => {
  if (!dateStr) return false;
  if (days === 'all') return true;

  const itemDate = new Date(dateStr);
  if (isNaN(itemDate.getTime())) return false;

  let referenceDate = new Date();

  // If a dataset is provided, detect if it contains only old mock/seed data.
  // If the latest record is older than 30 days, we anchor the reference date
  // to that latest record so relative filters (7/30/90 days) will display data.
  if (allDates && allDates.length > 0) {
    const times = allDates
      .filter((d): d is string => !!d)
      .map((d) => new Date(d).getTime())
      .filter((t) => !isNaN(t));
    if (times.length > 0) {
      const maxTime = Math.max(...times);
      const maxDate = new Date(maxTime);
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      if (maxDate < thirtyDaysAgo) {
        referenceDate = maxDate;
      }
    }
  }

  const cutoff = new Date(referenceDate);
  cutoff.setDate(cutoff.getDate() - parseInt(days, 10));
  
  // Set cutoff to the start of the day (00:00:00) so we don't exclude 
  // records created earlier on the cutoff day.
  cutoff.setHours(0, 0, 0, 0);

  return itemDate >= cutoff;
};
