export interface ScheduleRow {
  dateStr: string;
  weekday: string;
  weekLabel: string;
  shiftName: string;
  shop: string[];     // Array for people
  kitchen: string[];  // Array for people
  clothes: string[];  // Array for people
  resting: string[];  // Who is off today
  type: 'morning' | 'evening';
}

export const GROUP_A = ['汪弋凡', '曹文娇', '刘璇', '王可馨'];
export const GROUP_B = ['俞欣妍', '陈杏柳', '王仪', '何姐'];

export const HEADER_COLOR = '#4080bf';
export const MORNING_COLOR = '#fffbe7';
export const EVENING_COLOR = '#e3f2fd';
export const REST_BG_COLOR = '#f9fafb';
export const REST_TEXT_COLOR = '#9ca3af';