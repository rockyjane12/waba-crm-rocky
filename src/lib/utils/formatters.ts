/**
 * Format number with comma separators and decimal places
 */
export const formatNumber = (
  value: number,
  options: { decimals?: number; prefix?: string; suffix?: string } = {},
): string => {
  const { decimals = 0, prefix = "", suffix = "" } = options;

  return `${prefix}${value.toLocaleString(undefined, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })}${suffix}`;
};

/**
 * Format currency with proper symbol and decimals
 */
export const formatCurrency = (
  value: number,
  currency: string = "USD",
  locale: string = "en-US",
): string => {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
  }).format(value);
};

/**
 * Format date with consistent formatting
 */
export const formatDate = (
  date: Date | string | number,
  options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  },
): string => {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("en-US", options).format(dateObj);
};

/**
 * Format relative time (e.g., "2 hours ago")
 */
export const formatRelativeTime = (date: Date | string | number): string => {
  const timeMs = typeof date === "string" ? new Date(date).getTime() : +date;
  const deltaSeconds = Math.round((timeMs - Date.now()) / 1000);

  const cutoffs = [
    { cutoff: 60, unit: "second" },
    { cutoff: 3600, unit: "minute" },
    { cutoff: 86400, unit: "hour" },
    { cutoff: 2592000, unit: "day" },
    { cutoff: 31536000, unit: "month" },
  ];

  const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

  for (const { cutoff, unit } of cutoffs) {
    if (Math.abs(deltaSeconds) < cutoff) {
      return rtf.format(
        Math.round(deltaSeconds / (cutoff / 60)),
        unit as Intl.RelativeTimeFormatUnit,
      );
    }
  }

  return rtf.format(Math.round(deltaSeconds / 31536000), "year");
};

/**
 * Format bytes to human readable string
 */
export const formatBytes = (bytes: number, decimals: number = 2): string => {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(decimals))} ${sizes[i]}`;
};

/**
 * Format phone number to consistent format
 */
export const formatPhoneNumber = (phoneNumber: string): string => {
  const cleaned = phoneNumber.replace(/\D/g, "");
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);

  if (match) {
    return "(" + match[1] + ") " + match[2] + "-" + match[3];
  }

  return phoneNumber;
};
