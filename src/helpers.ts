export function convertISODurationToTime(isoDuration: string) {
	// Use a regular expression to extract days, hours, and minutes from the ISO 8601 duration
	const regex = /P(?:T(?:(\d+)D)?(?:(\d+)H)?(?:(\d+)M)?)/;
	const matches = isoDuration.match(regex) as any;

	let days = 0;
	let hours = 0;
	let minutes = 0;

	if (matches[1]) {
		// Convert days to hours (24 hours per day)
		days = parseInt(matches[1], 10) * 24;
	}

	if (matches[2]) {
		// Convert string hours to integer
		hours = parseInt(matches[2], 10);
	}

	if (matches[3]) {
		// Convert string minutes to integer
		minutes = parseInt(matches[3], 10);
	}

	// Total hours calculation including days converted to hours
	hours += days;

	// Format the time string; pad with zeros if necessary
	const formattedTime = `${hours.toString().padStart(2, "0")}h ${minutes
		.toString()
		.padStart(2, "0")}m`;
	return formattedTime;
}
