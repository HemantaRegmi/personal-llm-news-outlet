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
  const punctuationAlarm = /!{2,}/.test(value);
  if (punctuationAlarm) {
    return false;
  }

  for (const token of ALARMIST_TERMS) {
    if (value.includes(token)) {
      return false;
    }
  }

  return true;
}
