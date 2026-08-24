export interface WibTimeInfo {
  currentTime: Date;
  timeString: string; // "14:35:08"
  dateStringId: string; // "Senin, 24 Agustus 2026"
  dateStringEn: string; // "Monday, 24 August 2026"
  shortDate: string; // "24 Aug 2026"
  shiftCode: "MORNING" | "EVENING" | "NIGHT";
  shiftLabelId: string; // "Shift Pagi (07:00 - 15:00 WIB)"
  shiftLabelEn: string; // "Morning Shift (07:00 - 15:00 WIB)"
  shiftShortId: string; // "Shift Pagi"
  shiftShortEn: string; // "Morning Shift"
  shiftProgressPercent: number;
  nextShiftInHours: number;
  dutyManagerName: string;
  isNightAuditTime: boolean; // 23:00 - 04:00
  timezone: "WIB (UTC+7)";
}

export function getWibTimeInfo(customDate?: Date): WibTimeInfo {
  // Use custom date or current date adjusted to UTC+7 WIB
  const now = customDate || new Date();
  
  // Calculate WIB time (UTC + 7 hours)
  const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
  const wibDate = new Date(utc + (3600000 * 7));

  const hours = wibDate.getHours();
  const minutes = wibDate.getMinutes();
  const seconds = wibDate.getSeconds();

  const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);
  const timeString = `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;

  // Determine operational hotel shift based on WIB hours
  // Morning Shift: 07:00 - 15:00 WIB
  // Evening Shift: 15:00 - 23:00 WIB
  // Night Shift:   23:00 - 07:00 WIB
  let shiftCode: "MORNING" | "EVENING" | "NIGHT" = "MORNING";
  let shiftLabelId = "Shift Pagi (07:00 - 15:00 WIB)";
  let shiftLabelEn = "Morning Shift (07:00 - 15:00 WIB)";
  let shiftShortId = "Shift Pagi";
  let shiftShortEn = "Morning Shift";
  let dutyManagerName = "Dewi Lestari (Front Desk Mgr)";
  let shiftStartHour = 7;
  let shiftDuration = 8;

  if (hours >= 7 && hours < 15) {
    shiftCode = "MORNING";
    shiftLabelId = "Shift Pagi (07:00 - 15:00 WIB)";
    shiftLabelEn = "Morning Shift (07:00 - 15:00 WIB)";
    shiftShortId = "Shift Pagi";
    shiftShortEn = "Morning Shift";
    dutyManagerName = "Dewi Lestari (Front Desk Mgr)";
    shiftStartHour = 7;
  } else if (hours >= 15 && hours < 23) {
    shiftCode = "EVENING";
    shiftLabelId = "Shift Sore (15:00 - 23:00 WIB)";
    shiftLabelEn = "Evening Shift (15:00 - 23:00 WIB)";
    shiftShortId = "Shift Sore";
    shiftShortEn = "Evening Shift";
    dutyManagerName = "Reza Pratama (Operations Mgr)";
    shiftStartHour = 15;
  } else {
    shiftCode = "NIGHT";
    shiftLabelId = "Shift Malam (23:00 - 07:00 WIB)";
    shiftLabelEn = "Night Shift (23:00 - 07:00 WIB)";
    shiftShortId = "Shift Malam";
    shiftShortEn = "Night Shift";
    dutyManagerName = "Bambang Sudiro (Night Auditor)";
    shiftStartHour = hours >= 23 ? 23 : -1; // 23 or rollover
  }

  // Calculate elapsed progress in current shift
  let elapsedMinutes = 0;
  if (shiftCode === "MORNING") {
    elapsedMinutes = (hours - 7) * 60 + minutes;
  } else if (shiftCode === "EVENING") {
    elapsedMinutes = (hours - 15) * 60 + minutes;
  } else {
    elapsedMinutes = hours >= 23 ? (hours - 23) * 60 + minutes : (hours + 1) * 60 + minutes;
  }
  const shiftProgressPercent = Math.min(100, Math.max(0, Math.round((elapsedMinutes / 480) * 100)));
  const nextShiftInHours = Number(((480 - elapsedMinutes) / 60).toFixed(1));

  const isNightAuditTime = hours >= 23 || hours < 5;

  // Indonesian localized day & month names
  const dayNamesId = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
  const monthNamesId = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni", 
    "Juli", "Agustus", "September", "Oktober", "November", "Desember"
  ];

  const dayNamesEn = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const monthNamesEn = [
    "January", "February", "March", "April", "May", "June", 
    "July", "August", "September", "October", "November", "December"
  ];
  const shortMonthEn = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  const dayOfWeek = wibDate.getDay();
  const dayOfMonth = wibDate.getDate();
  const month = wibDate.getMonth();
  const year = wibDate.getFullYear();

  const dateStringId = `${dayNamesId[dayOfWeek]}, ${dayOfMonth} ${monthNamesId[month]} ${year}`;
  const dateStringEn = `${dayNamesEn[dayOfWeek]}, ${dayOfMonth} ${monthNamesEn[month]} ${year}`;
  const shortDate = `${dayOfMonth} ${shortMonthEn[month]} ${year}`;

  return {
    currentTime: wibDate,
    timeString,
    dateStringId,
    dateStringEn,
    shortDate,
    shiftCode,
    shiftLabelId,
    shiftLabelEn,
    shiftShortId,
    shiftShortEn,
    shiftProgressPercent,
    nextShiftInHours,
    dutyManagerName,
    isNightAuditTime,
    timezone: "WIB (UTC+7)"
  };
}
