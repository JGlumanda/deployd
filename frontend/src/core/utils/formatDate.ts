/**
 * Formats a date string from "YYYY-MM" to "Mon YYYY" format
 * @param dateStr - Date string in format "YYYY-MM"
 * @returns Formatted date string like "Dec 2025"
 */
export function formatDate(dateStr: string): string {
  if (!dateStr || !dateStr.match(/^\d{4}-\d{2}$/)) {
    return dateStr
  }

  const [year, month] = dateStr.split('-')
  const monthIndex = parseInt(month, 10) - 1

  const monthNames = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ]

  return `${monthNames[monthIndex]} ${year}`
}
