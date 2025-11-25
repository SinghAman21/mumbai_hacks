export function formatLastActivity(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const inputDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());

  let datePart: string;
  if (inputDate.getTime() === today.getTime()) {
    datePart = "Today";
  } else if (inputDate.getTime() === yesterday.getTime()) {
    datePart = "Yesterday";
  } else {
    const day = date.getDate();
    const month = date.toLocaleString('en-US', { month: 'short' });
    datePart = `${day} ${month}`;
  }

  const timePart = date.toLocaleString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });

  return `${datePart} • ${timePart}`;
}