// Helper function to parse time string like "09:00 AM" to Date
const parseTimeString = (timeStr: string): Date => {
    const parts = timeStr.split(' ');
    const time = parts[0] || '00:00';
    const period = parts[1];
    const timeParts = time.split(':').map(Number);
    let hours = timeParts[0] || 0;
    const minutes = timeParts[1] || 0;
    
    if (period?.toUpperCase() === 'PM' && hours !== 12) {
        hours += 12;
    } else if (period?.toUpperCase() === 'AM' && hours === 12) {
        hours = 0;
    }
    
    // Use a fixed date, only the time portion matters for @db.Time
    const date = new Date('1970-01-01');
    date.setHours(hours, minutes, 0, 0);
    return date;
};

export default parseTimeString;