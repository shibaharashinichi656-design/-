import { GROUP_A, GROUP_B, ScheduleRow } from '../types';

interface DailyAssignment {
  shop: string[];
  kitchen: string[];
  clothes: string[];
  resting: string[];
}

// Get the Monday of the week for a specific date
const getMonday = (d: Date) => {
  const date = new Date(d);
  const day = date.getDay();
  const diff = date.getDate() - day + (day === 0 ? -6 : 1); 
  return new Date(date.setDate(diff));
};

// Shift Rotation Reference (Weekly swap)
const REFERENCE_MONDAY_SHIFT = new Date(2025, 1, 3); // Feb 3, 2025
const MS_PER_WEEK = 1000 * 60 * 60 * 24 * 7;

const getMorningGroupForWeek = (date: Date): string[] => {
  const currentMonday = getMonday(date);
  const diffTime = currentMonday.getTime() - REFERENCE_MONDAY_SHIFT.getTime();
  const diffWeeks = Math.round(diffTime / MS_PER_WEEK);
  // Week 0 (Feb 3) -> Group B, Week 1 -> Group A
  return diffWeeks % 2 === 0 ? GROUP_B : GROUP_A;
};

// Scientific Staggered Rest Logic
// Requirement: 6 days off per 30 days = 1 day off every 5 days.
// Cycle: 4 Days Work -> 1 Day Rest.
const getDailyAssignment = (group: string[], dayOfYear: number): DailyAssignment => {
  const peopleCount = group.length; // 4
  const cycleLength = 5; // 5 day cycle

  const resting: string[] = [];
  const working: string[] = [];

  for (let i = 0; i < peopleCount; i++) {
    // Each person has a different offset in the 5-day cycle so they don't rest together.
    // Person 0 rests on day 0, 5, 10...
    // Person 1 rests on day 1, 6, 11...
    if ((dayOfYear % cycleLength) === i) {
      resting.push(group[i]);
    } else {
      working.push(group[i]);
    }
  }

  // Station Rotation
  // We rotate which station gets the "Double" (if 4 people) or how 3 people are distributed.
  // We use dayOfYear to rotate this so no one is stuck in Kitchen forever.
  
  let shop: string[] = [];
  let kitchen: string[] = [];
  let clothes: string[] = [];

  // Shuffle the working people based on day so their assignment changes daily
  // We create a rotated version of the working array
  const shiftAmount = dayOfYear % working.length;
  const rotatedWorkers = [
    ...working.slice(shiftAmount),
    ...working.slice(0, shiftAmount)
  ];

  if (working.length === 3) {
    // 3 People: 1 per station
    shop = [rotatedWorkers[0]];
    kitchen = [rotatedWorkers[1]];
    clothes = [rotatedWorkers[2]];
  } else {
    // 4 People: 3 stations. One station gets 2 people.
    // Rotate which station gets the double team:
    const doubleStationIdx = dayOfYear % 3; // 0=Shop, 1=Kitchen, 2=Clothes
    
    // Assignment strategy:
    // P0, P1 -> Station A
    // P2 -> Station B
    // P3 -> Station C
    
    if (doubleStationIdx === 0) { // Shop Pair
      shop = [rotatedWorkers[0], rotatedWorkers[1]];
      kitchen = [rotatedWorkers[2]];
      clothes = [rotatedWorkers[3]];
    } else if (doubleStationIdx === 1) { // Kitchen Pair
      shop = [rotatedWorkers[0]];
      kitchen = [rotatedWorkers[1], rotatedWorkers[2]];
      clothes = [rotatedWorkers[3]];
    } else { // Clothes Pair
      shop = [rotatedWorkers[0]];
      kitchen = [rotatedWorkers[1]];
      clothes = [rotatedWorkers[2], rotatedWorkers[3]];
    }
  }

  return { shop, kitchen, clothes, resting };
};

export const generateSchedule = (year: number, month: number): ScheduleRow[] => {
  const finalRows: ScheduleRow[] = [];
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const startOfYear = new Date(year, 0, 0);

  for (let day = 1; day <= daysInMonth; day++) {
     const date = new Date(year, month, day);
     const dateStr = `${(month + 1).toString().padStart(2, '0')}/${day.toString().padStart(2, '0')}`;
     const jsDay = date.getDay();
     const weekCn = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'][jsDay];

    // Group Logic
    const morningGroup = getMorningGroupForWeek(date);
    const eveningGroup = morningGroup === GROUP_A ? GROUP_B : GROUP_A;

    const morningName = morningGroup === GROUP_A ? "A" : "B";
    const eveningName = eveningGroup === GROUP_A ? "A" : "B";
    
    // Simple label to avoid clutter
    const weekLabel = `${morningName}早${eveningName}晚`;

    // Continuous Day Index
    const diffTime = date.getTime() - startOfYear.getTime();
    const dayOfYear = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    // We offset the evening group logic by 2 days effectively "Shifting" their cycle
    // This reduces the chance that both groups have a person resting on the same day (though it's allowed)
    const mAssign = getDailyAssignment(morningGroup, dayOfYear);
    const eAssign = getDailyAssignment(eveningGroup, dayOfYear + 2);

    finalRows.push({
        dateStr,
        weekday: weekCn,
        weekLabel,
        shiftName: '早班 (13-18)',
        shop: mAssign.shop,
        kitchen: mAssign.kitchen,
        clothes: mAssign.clothes,
        resting: mAssign.resting,
        type: 'morning'
    });

    finalRows.push({
        dateStr,
        weekday: weekCn,
        weekLabel,
        shiftName: '晚班 (19-24)',
        shop: eAssign.shop,
        kitchen: eAssign.kitchen,
        clothes: eAssign.clothes,
        resting: eAssign.resting,
        type: 'evening'
    });
  }

  return finalRows;
};