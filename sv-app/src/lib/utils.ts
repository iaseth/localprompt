


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
