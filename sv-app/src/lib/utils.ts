


export function getCurrentTimestamp (): number {
	const now = new Date();
	const nowTimestamp = now.getTime();
	return nowTimestamp;
}

export function getLastSundayTimestamp (): number {
	// Clone date to avoid modifying the original
	const lastSunday = new Date();

	// Calculate days to subtract to get last Sunday
	const day = lastSunday.getDay(); // 0 (Sun) to 6 (Sat)
	const daysToSubtract = day === 0 ? 7 : day;

	lastSunday.setDate(lastSunday.getDate() - daysToSubtract);
	lastSunday.setHours(0, 0, 0, 0); // Set time to midnight

	const lastSundayTimestamp = lastSunday.getTime();
	return lastSundayTimestamp;
}

export function timeAgo (timestamp: number) {
	// Convert to milliseconds if it's in seconds
	if (timestamp < 1000000000000) {
	  timestamp *= 1000;
	}
  
	const now = Date.now();
	const diff = now - timestamp;
  
	const seconds = Math.floor(diff / 1000);
	const minutes = Math.floor(diff / (1000 * 60));
	const hours = Math.floor(diff / (1000 * 60 * 60));
	const days = Math.floor(diff / (1000 * 60 * 60 * 24));
	const weeks = Math.floor(diff / (1000 * 60 * 60 * 24 * 7));
	const months = Math.floor(diff / (1000 * 60 * 60 * 24 * 30));
	const years = Math.floor(diff / (1000 * 60 * 60 * 24 * 365));
  
	if (seconds < 60) return 'just now';
	if (minutes < 60) return `${minutes} minute${minutes === 1 ? '' : 's'} ago`;
	if (hours < 24) return `${hours} hour${hours === 1 ? '' : 's'} ago`;
	if (days < 7) return `${days} day${days === 1 ? '' : 's'} ago`;
	if (weeks < 5) return `${weeks} week${weeks === 1 ? '' : 's'} ago`;
	if (months < 12) return `${months} month${months === 1 ? '' : 's'} ago`;
	return `${years} year${years === 1 ? '' : 's'} ago`;
}
  
