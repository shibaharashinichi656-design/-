import React from 'react';
import { ScheduleRow, HEADER_COLOR, MORNING_COLOR, EVENING_COLOR } from '../types';

interface ScheduleTableProps {
  data: ScheduleRow[];
}

const ScheduleTable: React.FC<ScheduleTableProps> = ({ data }) => {
  
  const renderMultiLine = (texts: string[]) => {
    return (
      <div className="flex flex-col items-center justify-center gap-0.5">
        {texts.map((t, i) => (
          <span key={i} className="font-medium text-gray-800 block text-xs md:text-sm">
            {t}
          </span>
        ))}
      </div>
    );
  };

  return (
    <div className="relative overflow-x-auto shadow-lg rounded-lg border border-gray-300 bg-white max-h-[70vh] md:max-h-none">
      <table className="min-w-full border-collapse table-auto md:table-fixed w-full">
        <thead className="sticky top-0 z-20 shadow-sm">
          <tr style={{ backgroundColor: HEADER_COLOR }}>
            {/* Sticky Date Column */}
            <th className="sticky left-0 z-30 py-3 px-2 text-white font-bold border-r border-white/20 text-xs md:text-sm w-14" style={{ backgroundColor: HEADER_COLOR }}>日期</th>
            <th className="py-3 px-2 text-white font-bold border-r border-white/20 text-xs md:text-sm w-12 whitespace-nowrap">星期</th>
            <th className="py-3 px-2 text-white font-bold border-r border-white/20 text-xs md:text-sm hidden sm:table-cell w-16 whitespace-nowrap">排班</th>
            <th className="py-3 px-2 text-white font-bold border-r border-white/20 text-xs md:text-sm w-16 whitespace-nowrap">班次</th>
            <th className="py-3 px-2 text-white font-bold border-r border-white/20 text-xs md:text-sm whitespace-nowrap min-w-[60px]">小卖铺</th>
            <th className="py-3 px-2 text-white font-bold border-r border-white/20 text-xs md:text-sm whitespace-nowrap min-w-[60px]">厨房</th>
            <th className="py-3 px-2 text-white font-bold border-r border-white/20 text-xs md:text-sm whitespace-nowrap min-w-[60px]">潮服</th>
            <th className="py-3 px-2 text-white font-bold text-xs md:text-sm w-16 bg-black/10 whitespace-nowrap">休息</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => {
            const isMorning = row.type === 'morning';
            const bgColor = isMorning ? MORNING_COLOR : EVENING_COLOR;
            const isLastOfDay = !isMorning; 
            const borderClass = isLastOfDay ? 'border-b-2 border-gray-300' : 'border-b border-gray-100';

            return (
              <tr key={index} style={{ backgroundColor: bgColor }} className={`${borderClass}`}>
                {/* Sticky Date Cell */}
                <td className="sticky left-0 z-10 py-3 px-1 text-center text-xs md:text-sm border-r border-white/50 font-medium text-gray-700 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]" style={{ backgroundColor: bgColor }}>
                  {row.dateStr}
                </td>
                
                <td className={`py-3 px-1 text-center text-xs md:text-sm border-r border-white/50 ${(row.weekday === '周六' || row.weekday === '周日') ? 'text-red-600 font-bold' : ''}`}>
                  {row.weekday}
                </td>
                <td className="py-3 px-1 text-center text-[10px] md:text-xs border-r border-white/50 whitespace-pre-wrap hidden sm:table-cell text-gray-500">
                  {row.weekLabel}
                </td>
                <td className="py-3 px-1 text-center text-xs md:text-sm border-r border-white/50 font-medium whitespace-pre-wrap">
                  {row.shiftName.split(' ')[0]}
                </td>
                
                <td className="py-2 px-1 text-center border-r border-white/50 align-middle">
                   {renderMultiLine(row.shop)}
                </td>
                <td className="py-2 px-1 text-center border-r border-white/50 align-middle">
                   {renderMultiLine(row.kitchen)}
                </td>
                <td className="py-2 px-1 text-center border-r border-white/50 align-middle">
                   {renderMultiLine(row.clothes)}
                </td>
                <td className="py-2 px-1 text-center align-middle bg-black/5">
                   {row.resting.length > 0 ? (
                     <span className="text-gray-400 font-bold text-xs">{row.resting[0]}</span>
                   ) : (
                     <span className="text-gray-300">-</span>
                   )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default ScheduleTable;