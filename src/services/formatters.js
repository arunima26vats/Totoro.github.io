export function formatDisplayDate(value) {
  if (!value) {
    return 'Not available yet';
  }

  let date;

  if (value?.toDate) {
    date = value.toDate();
  } else if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
    const [year, month, day] = value.split('-').map(Number);
    date = new Date(year, month - 1, day);
  } else {
    date = new Date(value);
  }

  if (Number.isNaN(date.getTime())) {
    return 'Invalid date';
  }

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
}

export function formatMinutes(totalMinutes = 0) {
  const minutes = Number(totalMinutes) || 0;
  const hours = Math.floor(minutes / 60);
  const remainder = minutes % 60;

  if (!hours) {
    return `${remainder} min`;
  }

  if (!remainder) {
    return `${hours} hr`;
  }

  return `${hours} hr ${remainder} min`;
}

function normalizeSessionDate(value) {
  if (!value) {
    return null;
  }

  if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return value;
  }

  const parsedDate = value?.toDate ? value.toDate() : new Date(value);

  if (Number.isNaN(parsedDate.getTime())) {
    return null;
  }

  const year = parsedDate.getFullYear();
  const month = String(parsedDate.getMonth() + 1).padStart(2, '0');
  const day = String(parsedDate.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

function addDays(dateString, days) {
  const [year, month, day] = dateString.split('-').map(Number);
  const nextDate = new Date(year, month - 1, day);
  nextDate.setDate(nextDate.getDate() + days);

  const nextYear = nextDate.getFullYear();
  const nextMonth = String(nextDate.getMonth() + 1).padStart(2, '0');
  const nextDay = String(nextDate.getDate()).padStart(2, '0');

  return `${nextYear}-${nextMonth}-${nextDay}`;
}

export function calculateStudyStreak(sessions = []) {
  const uniqueDates = Array.from(
    new Set(sessions.map((session) => normalizeSessionDate(session?.date)).filter(Boolean)),
  ).sort((left, right) => right.localeCompare(left));

  if (!uniqueDates.length) {
    return 0;
  }

  let streak = 1;

  for (let index = 1; index < uniqueDates.length; index += 1) {
    const previousDate = uniqueDates[index - 1];
    const currentDate = uniqueDates[index];
    const expectedPreviousDate = addDays(currentDate, 1);

    if (previousDate !== expectedPreviousDate) {
      break;
    }

    streak += 1;
  }

  return streak;
}

export function formatStudyStreakMessage(streak = 0) {
  if (!streak) {
    return 'Log a session today to start your streak.';
  }

  return `🔥 ${streak} day${streak === 1 ? '' : 's'} streak!`;
}

export function calculateWeeklyActivity(sessions = [], days = 7) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const totalsByDate = new Map();

  sessions.forEach((session) => {
    const sessionDate = normalizeSessionDate(session?.date);

    if (!sessionDate) {
      return;
    }

    totalsByDate.set(sessionDate, (totalsByDate.get(sessionDate) || 0) + Number(session?.duration || 0));
  });

  return Array.from({ length: days }, (_, index) => {
    const currentDate = new Date(today);
    currentDate.setDate(today.getDate() - (days - index - 1));

    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const day = String(currentDate.getDate()).padStart(2, '0');
    const key = `${year}-${month}-${day}`;

    return {
      key,
      label: currentDate.toLocaleDateString('en-US', { weekday: 'short' }),
      minutes: totalsByDate.get(key) || 0,
    };
  });
}
