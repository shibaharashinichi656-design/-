import React, { useMemo, useState } from 'react';
import { generateSchedule } from './utils/scheduleGenerator';
import ScheduleTable from './components/ScheduleTable';
import { Download, ChevronLeft, ChevronRight, Calendar, UserCheck, Smartphone } from 'lucide-react';

function App() {
  const [currentDate, setCurrentDate] = useState(new Date(2025, 1, 1)); // Start Feb 2025

  const scheduleData = useMemo(() => {
    return generateSchedule(currentDate.getFullYear(), currentDate.getMonth());
  }, [currentDate]);

  const handlePrint = () => {
    window.print();
  };

  const changeMonth = (delta: number) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + delta);
    setCurrentDate(newDate);
  };

  const formattedDateTitle = currentDate.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long' });

  return (
    <div className="min-h-screen bg-gray-50 py-4 px-1 md:py-6 md:px-6 lg:px-8 font-sans">
      <div className="max-w-6xl mx-auto">
        
        {/* Header Section - Hide on Print */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-4 flex flex-col gap-4 print:hidden">
          
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 w-full">
            <h1 className="text-xl md:text-2xl font-bold text-gray-800 flex items-center gap-2 text-center md:text-left">
              📅 直播间智能排班表
            </h1>
            
            <button 
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-900 transition-colors shadow-sm text-sm font-medium w-full md:w-auto justify-center"
            >
              <Download size={18} />
              保存表格 (PDF)
            </button>
          </div>

          {/* Controls */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center justify-between w-full md:w-auto gap-4 bg-gray-50 p-2 rounded-lg border border-gray-200">
              <button 
                onClick={() => changeMonth(-1)}
                className="p-2 hover:bg-white hover:shadow-sm rounded-md transition-all text-gray-600 hover:text-blue-600"
              >
                <ChevronLeft size={24} />
              </button>
              
              <div className="flex items-center gap-2 px-4 min-w-[120px] justify-center font-bold text-lg text-gray-800">
                <Calendar size={20} className="text-blue-500"/>
                {formattedDateTitle}
              </div>

              <button 
                onClick={() => changeMonth(1)}
                className="p-2 hover:bg-white hover:shadow-sm rounded-md transition-all text-gray-600 hover:text-blue-600"
              >
                <ChevronRight size={24} />
              </button>
            </div>

            <div className="w-full md:w-auto flex items-center gap-2 text-xs md:text-sm text-gray-600 bg-blue-50 px-3 py-2 rounded-lg border border-blue-100">
               <UserCheck size={18} className="text-blue-600 shrink-0" />
               <span>错峰轮休：每人每5天休1天 (全勤日双人上岗)</span>
            </div>
          </div>
        </div>

        {/* Print Only Header */}
        <div className="hidden print:block text-center mb-6">
           <h1 className="text-2xl font-bold mb-2">{formattedDateTitle} 直播排班表</h1>
           <p className="text-sm text-gray-500">科学错峰轮休 · 每日至少3人在岗</p>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-2 mb-3 px-1 print:hidden">
           <div className="bg-[#fffbe7] px-3 py-1 rounded-full border border-yellow-200 text-xs text-yellow-800 font-medium">
              ☀️ 早班
           </div>
           <div className="bg-[#e3f2fd] px-3 py-1 rounded-full border border-blue-200 text-xs text-blue-800 font-medium">
              🌙 晚班
           </div>
           <div className="bg-gray-100 px-3 py-1 rounded-full border border-gray-200 text-xs text-gray-500 font-medium ml-auto">
              <span className="hidden md:inline">提示: </span> 表格可左右滑动
           </div>
        </div>

        {/* Schedule Table Component */}
        <ScheduleTable data={scheduleData} />

        <footer className="mt-8 mb-4 text-center print:hidden">
           <p className="text-gray-400 text-xs">
            生成的排班表可永久保存 · 适用于所有设备查看
           </p>
        </footer>

      </div>
    </div>
  );
}

export default App;