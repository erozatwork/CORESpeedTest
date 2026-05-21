export const formatIsoDate = isoDate => {
    if (!isoDate) return "—";
    
    // Extract date part only to avoid UTC shift in negative timezones
    const datePart = typeof isoDate === 'string' ? isoDate.split('T')[0] : isoDate;
    const date = new Date(datePart);
    
    if (isNaN(date.getTime())) return "—";

    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const day = date.getDate();
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();
    
    return `${day} ${month}, ${year}`;
};