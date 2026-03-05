const ALARMIST_TERMS = [
  "panic",
  "catastrophe",
  "doomsday",
  "terrifying",
  "everyone will",
  "everything is broken",
  "you won't believe",
  "collapse",
  "disaster",
  "extinction",
  "killer",
  "apocalypse",
  "shocking",
];

export function isNonAlarmist(title: string, snippet: string): boolean {
  const value = `${title} ${snippet}`.toLowerCase();
  if (/!{2,}/.test(value)) {
    return false;
  }

  for (const token of ALARMIST_TERMS) {
    if (value.includes(token)) {
      return false;
    }
  }

  return true;
}
