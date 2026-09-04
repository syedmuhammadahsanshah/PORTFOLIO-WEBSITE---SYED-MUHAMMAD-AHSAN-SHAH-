/**
 * Utility for formatting LinkedIn-style experience dates and duration calculation
 */

const MONTH_NAMES = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

export interface LinkedInDateDuration {
  startDateFormatted: string;
  endDateFormatted: string;
  dateRangeText: string;
  durationText: string;
  fullFormatted: string;
}

/**
 * Parses various date formats (e.g., '2022-06', '2022-06-15', 'Jun 2022', 'June 2022', '01/2013', '1/2013', '2022')
 */
function parseDateComponents(dateStr?: string): { year: number; month: number } | null {
  if (!dateStr || !dateStr.trim()) return null;
  const clean = dateStr.trim();

  // Format: YYYY-MM or YYYY-MM-DD or YYYY/MM or YYYY.MM
  const ymdMatch = clean.match(/^(\d{4})[-/.](\d{1,2})/);
  if (ymdMatch) {
    const year = parseInt(ymdMatch[1], 10);
    const month = parseInt(ymdMatch[2], 10);
    if (!isNaN(year) && month >= 1 && month <= 12) {
      return { year, month };
    }
  }

  // Format: MM/YYYY or MM-YYYY (e.g. '01/2013', '1/2013', '06-2022')
  const myMatch = clean.match(/^(\d{1,2})[-/.](\d{4})/);
  if (myMatch) {
    const month = parseInt(myMatch[1], 10);
    const year = parseInt(myMatch[2], 10);
    if (!isNaN(year) && month >= 1 && month <= 12) {
      return { year, month };
    }
  }

  // Format: 'Jun 2022' or 'June 2022' or 'Jan, 2013'
  const monthNameMatch = clean.match(/^([a-zA-Z]+)[,\s]+(\d{4})/);
  if (monthNameMatch) {
    const monthIdx = MONTH_NAMES.findIndex(
      m => m.toLowerCase() === monthNameMatch[1].slice(0, 3).toLowerCase()
    );
    const year = parseInt(monthNameMatch[2], 10);
    if (monthIdx !== -1 && !isNaN(year)) {
      return { year, month: monthIdx + 1 };
    }
  }

  // Format: '2022'
  const yearOnlyMatch = clean.match(/^(\d{4})$/);
  if (yearOnlyMatch) {
    return { year: parseInt(yearOnlyMatch[1], 10), month: 1 };
  }

  // 'Since June 2022' or 'From Jan 2013'
  const sinceMatch = clean.match(/(?:since|from)\s+([a-zA-Z]+)[,\s]+(\d{4})/i);
  if (sinceMatch) {
    const monthIdx = MONTH_NAMES.findIndex(
      m => m.toLowerCase() === sinceMatch[1].slice(0, 3).toLowerCase()
    );
    const year = parseInt(sinceMatch[2], 10);
    if (monthIdx !== -1 && !isNaN(year)) {
      return { year, month: monthIdx + 1 };
    }
  }

  // Fallback to standard Date parser
  const parsedTimestamp = Date.parse(clean);
  if (!isNaN(parsedTimestamp)) {
    const d = new Date(parsedTimestamp);
    return { year: d.getFullYear(), month: d.getMonth() + 1 };
  }

  return null;
}

export function formatMonthYear(year: number, month: number): string {
  const mName = MONTH_NAMES[month - 1] || 'Jan';
  return `${mName} ${year}`;
}

export function calculateDurationString(start: { year: number; month: number }, end: { year: number; month: number }): string {
  // LinkedIn calculates duration inclusive of both start and end months
  let totalMonths = (end.year - start.year) * 12 + (end.month - start.month) + 1;
  if (totalMonths < 1) totalMonths = 1;

  const years = Math.floor(totalMonths / 12);
  const remainingMonths = totalMonths % 12;

  const yearPart = years > 0 ? `${years} yr${years > 1 ? 's' : ''}` : '';
  const monthPart = remainingMonths > 0 ? `${remainingMonths} mo${remainingMonths > 1 ? 's' : ''}` : '';

  if (yearPart && monthPart) {
    return `${yearPart} ${monthPart}`;
  } else if (yearPart) {
    return yearPart;
  } else {
    return monthPart || '1 mo';
  }
}

/**
 * Computes LinkedIn style date & duration information
 */
export function getLinkedInDateInfo(
  startDateStr?: string,
  endDateStr?: string,
  isCurrent?: boolean,
  fallbackYear?: string
): LinkedInDateDuration {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;

  let start = parseDateComponents(startDateStr);
  if (!start && fallbackYear) {
    start = parseDateComponents(fallbackYear);
  }

  if (!start) {
    const raw = fallbackYear || 'Present';
    return {
      startDateFormatted: raw,
      endDateFormatted: isCurrent ? 'Present' : '',
      dateRangeText: raw,
      durationText: '',
      fullFormatted: raw,
    };
  }

  const startFormatted = formatMonthYear(start.year, start.month);

  let endFormatted = 'Present';
  let end = { year: currentYear, month: currentMonth };

  if (isCurrent) {
    endFormatted = 'Present';
    end = { year: currentYear, month: currentMonth };
  } else if (endDateStr && endDateStr.trim()) {
    const parsedEnd = parseDateComponents(endDateStr);
    if (parsedEnd) {
      end = parsedEnd;
      endFormatted = formatMonthYear(end.year, end.month);
    } else {
      endFormatted = endDateStr;
    }
  } else if (!isCurrent) {
    // If neither isCurrent nor endDate provided, default end to start year/month
    end = { ...start };
    endFormatted = startFormatted;
  }

  const durationText = calculateDurationString(start, end);
  const dateRangeText = `${startFormatted} - ${endFormatted}`;
  const fullFormatted = durationText ? `${dateRangeText} · ${durationText}` : dateRangeText;

  return {
    startDateFormatted: startFormatted,
    endDateFormatted: endFormatted,
    dateRangeText,
    durationText,
    fullFormatted,
  };
}

export interface CareerTotalExperience {
  startYear: number;
  startMonth: number;
  startDateFormatted: string;
  totalMonths: number;
  years: number;
  months: number;
  yearsPlus: string;             // e.g. "13+"
  yearsPlusText: string;         // e.g. "13+ Years"
  yearsPlusTextLower: string;    // e.g. "13+ years"
  singleYearWithPlus: string;    // e.g. "13+ year"
  singleYearWithPlusTitle: string; // e.g. "13+ Year"
  linkedInDuration: string;      // e.g. "13 yrs 8 mos" or "13 yrs"
  fullDurationSpelled: string;   // e.g. "13 years and 8 months" or "13 years"
  displayBadge: string;          // e.g. "13+ Years"
}

/**
 * Calculates dynamic career-wide total experience from start date (or timeline) to current date.
 * Default baseline career start: '2013-01' (Clariant Chemical Pakistan).
 */
export function getTotalCareerExperience(
  careerStartDate?: string,
  timeline?: Array<{ startDate?: string; year?: string }>
): CareerTotalExperience {
  let effectiveStartDate = '';

  // Collect any valid timeline dates
  const timelineDates: Array<{ year: number; month: number }> = [];
  if (timeline && timeline.length > 0) {
    for (const item of timeline) {
      const parsed = parseDateComponents(item.startDate || item.year);
      if (parsed) timelineDates.push(parsed);
    }
    if (timelineDates.length > 0) {
      timelineDates.sort((a, b) => (a.year !== b.year ? a.year - b.year : a.month - b.month));
    }
  }

  // If careerStartDate is provided and valid, use it
  if (careerStartDate && careerStartDate.trim()) {
    const parsedStart = parseDateComponents(careerStartDate);
    if (parsedStart) {
      effectiveStartDate = `${parsedStart.year}-${String(parsedStart.month).padStart(2, '0')}`;
    }
  }

  // If not resolved from careerStartDate, use earliest date from timeline
  if (!effectiveStartDate && timelineDates.length > 0) {
    effectiveStartDate = `${timelineDates[0].year}-${String(timelineDates[0].month).padStart(2, '0')}`;
  }

  // Fallback to default start date
  if (!effectiveStartDate) {
    effectiveStartDate = '2013-01';
  }

  const parsedStart = parseDateComponents(effectiveStartDate) || { year: 2013, month: 1 };
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;

  let totalMonths = (currentYear - parsedStart.year) * 12 + (currentMonth - parsedStart.month) + 1;
  if (totalMonths < 1) totalMonths = 1;

  const years = Math.floor(totalMonths / 12);
  const months = totalMonths % 12;

  const yearsPlus = `${years}+`;
  const yearsPlusText = `${years}+ Years`;
  const yearsPlusTextLower = `${years}+ years`;
  const singleYearWithPlus = `${years}+ year`;
  const singleYearWithPlusTitle = `${years}+ Year`;

  let linkedInDuration = `${years} yrs`;
  if (months > 0) {
    linkedInDuration = `${years} yr${years !== 1 ? 's' : ''} ${months} mo${months !== 1 ? 's' : ''}`;
  }

  let fullDurationSpelled = `${years} year${years !== 1 ? 's' : ''}`;
  if (months > 0) {
    fullDurationSpelled = `${years} year${years !== 1 ? 's' : ''} and ${months} month${months !== 1 ? 's' : ''}`;
  }

  return {
    startYear: parsedStart.year,
    startMonth: parsedStart.month,
    startDateFormatted: formatMonthYear(parsedStart.year, parsedStart.month),
    totalMonths,
    years,
    months,
    yearsPlus,
    yearsPlusText,
    yearsPlusTextLower,
    singleYearWithPlus,
    singleYearWithPlusTitle,
    linkedInDuration,
    fullDurationSpelled,
    displayBadge: yearsPlusText,
  };
}

/**
 * Replaces template placeholders (e.g. {{TOTAL_YEARS_PLUS}}, {{TOTAL_YEARS}}, {{TOTAL_DURATION}}, etc.)
 * as well as hardcoded static experience mentions with dynamically calculated values.
 */
export function formatExperienceText(
  text?: string,
  careerStartDate?: string,
  timeline?: Array<{ startDate?: string; year?: string }>
): string {
  if (!text) return '';
  const exp = getTotalCareerExperience(careerStartDate, timeline);

  let updated = text;

  // 1. Template variables (exact template tags as seen in the user's other portfolio)
  updated = updated.replace(/\{\{\s*TOTAL_YEARS_PLUS\s*\}\}/g, exp.yearsPlus);
  updated = updated.replace(/\{\{\s*TOTAL_YEARS\s*\}\}/g, String(exp.years));
  updated = updated.replace(/\{\{\s*TOTAL_DURATION\s*\}\}/g, exp.linkedInDuration);
  updated = updated.replace(/\{\{\s*TOTAL_DURATION_SPELLED\s*\}\}/g, exp.fullDurationSpelled);
  updated = updated.replace(/\{\{\s*CAREER_START_YEAR\s*\}\}/g, String(exp.startYear));
  updated = updated.replace(/\{\{\s*CAREER_START_DATE\s*\}\}/g, exp.startDateFormatted);
  updated = updated.replace(/\{\{\s*EXPERIENCE_TEXT\s*\}\}/g, exp.yearsPlusText);
  updated = updated.replace(/\{\{\s*EXPERIENCE_TEXT_LOWER\s*\}\}/g, exp.yearsPlusTextLower);

  // 2. Spelled out durations: e.g. "15 years and 6 months", "12 years and 5 months", "15 years, 6 months"
  updated = updated.replace(/\b\d+\s*years?(?:[,\s]+and\s*|[,\s]+)\d+\s*months?\b/gi, exp.fullDurationSpelled);

  // 3. Short LinkedIn durations: e.g. "12 yrs 5 mos" / "13 yrs 9 mos"
  updated = updated.replace(/\b\d+\s*yrs?\s*\d+\s*mos?\b/gi, exp.linkedInDuration);

  // 4. Hyphenated: e.g. "12-year", "12+-year", "13-year"
  updated = updated.replace(/\b\d+\+?-year\b/gi, `${exp.years}+-year`);

  // 5. Specific experience phrases with prepositions or suffixes
  updated = updated.replace(/\b\d+\+?\s*years?\s+of\s+overall\s+experience\b/gi, `${exp.yearsPlusTextLower} of overall experience`);
  updated = updated.replace(/\b\d+\+?\s*years?\s+of\s+experience\b/gi, `${exp.yearsPlusTextLower} of experience`);
  updated = updated.replace(/\b\d+\+?\s*years?\s+across\b/gi, `${exp.yearsPlusTextLower} across`);
  updated = updated.replace(/\bacross\s+\d+\+?\s*years\b/gi, `across ${exp.yearsPlusTextLower}`);
  updated = updated.replace(/\bover\s+\d+\+?\s*years\b/gi, `over ${exp.yearsPlusTextLower}`);
  updated = updated.replace(/\bwith\s+\d+\+?\s*years\b/gi, `with ${exp.yearsPlusTextLower}`);
  updated = updated.replace(/\bspanning\s+\d+\+?\s*years\b/gi, `spanning ${exp.yearsPlusTextLower}`);
  updated = updated.replace(/\b\d+\+?\s*year\s+journey\b/gi, `${exp.singleYearWithPlus} journey`);
  updated = updated.replace(/\b\d+\+?\s*Year\s+Journey\b/gi, `${exp.singleYearWithPlusTitle} Journey`);

  // 6. Title Case "X+ Years" / "X+ Year"
  updated = updated.replace(/\b\d+\+\s*Years\b/g, exp.yearsPlusText);
  updated = updated.replace(/\b\d+\+\s*Year\b/g, exp.singleYearWithPlusTitle);

  // 7. Lower Case "X+ years" / "X+ year"
  updated = updated.replace(/\b\d+\+\s*years\b/g, exp.yearsPlusTextLower);
  updated = updated.replace(/\b\d+\+\s*year\b/g, exp.singleYearWithPlus);

  // 8. General catch-all for any standalone "X+ years" or "X+ Years"
  updated = updated.replace(/\b\d+\+\s*years?\b/gi, (match) => {
    if (match.includes('Years') || match.includes('Year')) {
      return exp.yearsPlusText;
    }
    return exp.yearsPlusTextLower;
  });

  return updated;
}
