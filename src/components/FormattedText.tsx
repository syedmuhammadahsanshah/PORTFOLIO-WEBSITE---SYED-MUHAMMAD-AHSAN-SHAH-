import React from 'react';
import { formatExperienceText } from '../utils/dateUtils';

interface FormattedTextProps {
  text?: string;
  careerStartDate?: string;
  timeline?: Array<{ startDate?: string; year?: string }>;
  className?: string;
  boldClassName?: string;
}

/**
 * Parses and renders text with:
 * 1. Automatic variable expansion (e.g. {{TOTAL_YEARS_PLUS}}, {{TOTAL_YEARS}}, {{TOTAL_DURATION}}, etc.)
 * 2. Automatic dynamic regex replacement for hardcoded experience years
 * 3. Safe inline HTML tags: <strong>, <b>, <em>, <br />, &amp;
 */
export const FormattedText: React.FC<FormattedTextProps> = ({
  text,
  careerStartDate,
  timeline,
  className = '',
  boldClassName = 'font-semibold text-[#F2F5F9]'
}) => {
  if (!text) return null;

  // 1. Expand template variables and sync experience numbers
  const processedText = formatExperienceText(text, careerStartDate, timeline);

  // 2. Decode common HTML entities like &amp;, &lt;, &gt;, &quot;, &#39;
  const decoded = processedText
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');

  // 3. Fast check: if no HTML tags, return plain string
  if (!/<(?:strong|b|em|span|br)\b[^>]*>/i.test(decoded)) {
    return <span className={className}>{decoded}</span>;
  }

  // 4. Tokenize by <strong>, <b>, <em>, <br>
  const tokens = decoded.split(/(<strong>[\s\S]*?<\/strong>|<b>[\s\S]*?<\/b>|<em>[\s\S]*?<\/em>|<br\s*\/?>)/gi);

  return (
    <span className={className}>
      {tokens.map((token, index) => {
        if (!token) return null;

        // <strong>...</strong>
        const strongMatch = token.match(/^<strong>([\s\S]*?)<\/strong>$/i);
        if (strongMatch) {
          return (
            <strong key={index} className={boldClassName}>
              {strongMatch[1]}
            </strong>
          );
        }

        // <b>...</b>
        const bMatch = token.match(/^<b>([\s\S]*?)<\/b>$/i);
        if (bMatch) {
          return (
            <b key={index} className={boldClassName}>
              {bMatch[1]}
            </b>
          );
        }

        // <em>...</em>
        const emMatch = token.match(/^<em>([\s\S]*?)<\/em>$/i);
        if (emMatch) {
          return (
            <em key={index} className="italic text-[#E2E8F0]">
              {emMatch[1]}
            </em>
          );
        }

        // <br />
        if (/^<br\s*\/?>$/i.test(token)) {
          return <br key={index} />;
        }

        // Normal text segment
        return <React.Fragment key={index}>{token}</React.Fragment>;
      })}
    </span>
  );
};
