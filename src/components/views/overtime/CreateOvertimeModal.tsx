/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  X, 
  Clock, 
  User, 
  FolderKanban, 
  MapPin, 
  ShieldAlert, 
  AlertCircle, 
  CheckCircle2, 
  Calendar,
  Building2,
  HardHat
} from 'lucide-react';
import { OvertimeRecord, OvertimeType } from '@/src/data/overtimeData';
import { INITIAL_PERSONNEL_ITEMS } from '@/src/data/dhrPersonnelData';
import { MOCK_PROJECTS } from '@/src/data/mockProjects';

interface CreateOvertimeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (record: OvertimeRecord) => void;
}

export function CreateOvertimeModal({ isOpen, onClose, onSubmit }: CreateOvertimeModalProps) {
  const [selectedEmpId, setSelectedEmpId] = useState<string>(INITIAL_PERSONNEL_ITEMS[0]?.empID || '');
  const [selectedProjectId, setSelectedProjectId] = useState<string>(MOCK_PROJECTS[0]?.id || '');
  const [overtimeType, setOvertimeType] = useState<OvertimeType>('workday');
  const [date, setDate] = useState<string>('2026-09-16');
  const [startTime, setStartTime] = useState<string>('18:00');
  const [endTime, setEndTime] = useState<string>('22:00');
  const [hours, setHours] = useState<number>(4.0);
  const [workArea, setWorkArea] = useState<string>('1号船坞合拢段货舱区');
  const [reason, setReason] = useState<string>('');
  const [isSpecialWork, setIsSpecialWork] = useState<boolean>(false);
  const [specialWorkType, setSpecialWorkType] = useState<string>('二级动火作业');
  const [safetySupervisor, setSafetySupervisor] = useState<string>('周卫国 (安全工程师)');
  const [applicant, setApplicant] = useState<string>('现场班长/施工调度');

  if (!isOpen) return null;

  const currentEmp = INITIAL_PERSONNEL_ITEMS.find(p => p.empID === selectedEmpId) || INITIAL_PERSONNEL_ITEMS[0];
  const currentPrj = MOCK_PROJECTS.find(p => p.id === selectedProjectId) || MOCK_PROJECTS[0];

  const handleTimeChange = (start: string, end: string) => {
    setStartTime(start);
    setEndTime(end);
    try {
      const [sH, sM] = start.split(':').map(Number);
      const [eH, eM] = end.split(':').map(Number);
      let diffMinutes = (eH * 60 + eM) - (sH * 60 + sM);
      if (diffMinutes < 0) {
        diffMinutes += 24 * 60;
      }
      const calculatedHours = Math.round((diffMinutes / 60) * 10) / 10;
      setHours(calculatedHours > 0 ? calculatedHours : 1.0);
    } catch {
      // keep current hours
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) {
      alert('请填写加班事由与施工作业任务');
      return;
    }

    const newId = `OT-${date.replace(/-/g, '')}-${Math.floor(100 + Math.random() * 900)}`;

    const newRecord: OvertimeRecord = {
      id: newId,
      empId: currentEmp.empID,
      empName: currentEmp.name,
      empCode: currentEmp.empcode || 'DN-AUTO',
      deptId: currentEmp.DEPT_CODE,
      deptName: currentEmp.deptname,
      postJob: currentEmp.gwName || '造船技工',
      projectId: currentPrj.id,
      projectName: currentPrj.name,
      workArea: workArea.trim() || '船台作业区',
      overtimeType,
      date,
      startTime,
      endTime,
      hours: Number(hours),
      reason: reason.trim(),
      isSpecialWork,
      specialWorkType: isSpecialWork ? specialWorkType : undefined,
      safetySupervisor: isSpecialWork ? safetySupervisor : '车间巡检员',
      tagCode: currentEmp.tagCode || 'UWB-8801',
      tagStatus: 'normal',
      status: 'pending',
      applicant,
      applyTime: new Date().toISOString().replace('T', ' ').substring(0, 16)
    };

    onSubmit(newRecord);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-blue-600 text-white">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-800">加班申报登记</h2>
              <p className="text-xs text-slate-500">申报造船现场夜间、周末或节假日加班作业申请</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4 text-sm">
          {/* 人员选择 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                <span className="text-rose-500 mr-1">*</span>加班员工
              </label>
              <select
                value={selectedEmpId}
                onChange={(e) => setSelectedEmpId(e.target.value)}
                className="w-full h-9 px-3 rounded-md border border-slate-300 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-xs"
              >
                {INITIAL_PERSONNEL_ITEMS.map((p) => (
                  <option key={p.empID} value={p.empID}>
                    {p.name} ({p.empcode}) - {p.gwName || '技工'}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                所属组织与班组
              </label>
              <div className="w-full h-9 px-3 rounded-md border border-slate-200 bg-slate-50 text-slate-600 text-xs flex items-center truncate">
                <Building2 className="w-3.5 h-3.5 text-slate-400 mr-1.5 shrink-0" />
                <span className="truncate">{currentEmp.deptname}</span>
              </div>
            </div>
          </div>

          {/* 关联船舶项目与施工作业区域 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                <span className="text-rose-500 mr-1">*</span>关联项目/船舶
              </label>
              <select
                value={selectedProjectId}
                onChange={(e) => setSelectedProjectId(e.target.value)}
                className="w-full h-9 px-3 rounded-md border border-slate-300 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-xs"
              >
                {MOCK_PROJECTS.map((prj) => (
                  <option key={prj.id} value={prj.id}>
                    {prj.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                <span className="text-rose-500 mr-1">*</span>施工作业区域/泊位
              </label>
              <div className="relative">
                <MapPin className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={workArea}
                  onChange={(e) => setWorkArea(e.target.value)}
                  placeholder="例如: 1号船坞合拢口、2号泊位机舱"
                  className="w-full h-9 pl-8 pr-3 rounded-md border border-slate-300 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs"
                />
              </div>
            </div>
          </div>

          {/* 加班类型与日期时间 */}
          <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-blue-600" />
                加班类型与时段核定
              </span>
              <div className="flex items-center gap-3">
                <label className="inline-flex items-center text-xs text-slate-700 cursor-pointer">
                  <input
                    type="radio"
                    name="otType"
                    checked={overtimeType === 'workday'}
                    onChange={() => setOvertimeType('workday')}
                    className="mr-1 text-blue-600"
                  />
                  工作日延时
                </label>
                <label className="inline-flex items-center text-xs text-slate-700 cursor-pointer">
                  <input
                    type="radio"
                    name="otType"
                    checked={overtimeType === 'weekend'}
                    onChange={() => setOvertimeType('weekend')}
                    className="mr-1 text-blue-600"
                  />
                  休息日加班
                </label>
                <label className="inline-flex items-center text-xs text-slate-700 cursor-pointer">
                  <input
                    type="radio"
                    name="otType"
                    checked={overtimeType === 'holiday'}
                    onChange={() => setOvertimeType('holiday')}
                    className="mr-1 text-blue-600"
                  />
                  法定节假日
                </label>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div>
                <label className="block text-[11px] text-slate-500 mb-1">加班日期</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full h-8 px-2.5 rounded border border-slate-300 text-xs bg-white"
                />
              </div>
              <div>
                <label className="block text-[11px] text-slate-500 mb-1">开始时间</label>
                <input
                  type="time"
                  value={startTime}
                  onChange={(e) => handleTimeChange(e.target.value, endTime)}
                  className="w-full h-8 px-2.5 rounded border border-slate-300 text-xs bg-white"
                />
              </div>
              <div>
                <label className="block text-[11px] text-slate-500 mb-1">结束时间</label>
                <input
                  type="time"
                  value={endTime}
                  onChange={(e) => handleTimeChange(startTime, e.target.value)}
                  className="w-full h-8 px-2.5 rounded border border-slate-300 text-xs bg-white"
                />
              </div>
              <div>
                <label className="block text-[11px] text-slate-500 mb-1">核定工时(小时)</label>
                <input
                  type="number"
                  step="0.5"
                  min="0.5"
                  max="24"
                  value={hours}
                  onChange={(e) => setHours(Number(e.target.value))}
                  className="w-full h-8 px-2.5 rounded border border-slate-300 text-xs bg-white font-semibold text-blue-600"
                />
              </div>
            </div>
          </div>

          {/* 加班事由 / 作业任务 */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              <span className="text-rose-500 mr-1">*</span>加班事由与具体施工作业内容
            </label>
            <textarea
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="请详细描述作业内容，例如：机舱主发电机负荷试车及燃油管路打压检漏，配合船东代表夜间联锁试验"
              className="w-full p-2.5 rounded-md border border-slate-300 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* 特种与高危作业安全管控 */}
          <div className="p-3.5 rounded-lg border border-amber-200 bg-amber-50/50 space-y-3">
            <div className="flex items-center justify-between">
              <label className="inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={isSpecialWork}
                  onChange={(e) => setIsSpecialWork(e.target.checked)}
                  className="w-4 h-4 text-amber-600 rounded border-amber-300 focus:ring-amber-500"
                />
                <span className="ml-2 text-xs font-bold text-amber-900 flex items-center gap-1">
                  <ShieldAlert className="w-4 h-4 text-amber-600" />
                  涉及特种/危大作业（动火/密闭空间/高空吊装）
                </span>
              </label>
              {isSpecialWork && (
                <span className="text-[10px] px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-semibold border border-amber-300">
                  需双人现场监护
                </span>
              )}
            </div>

            {isSpecialWork && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-amber-200/60">
                <div>
                  <label className="block text-[11px] text-amber-900 font-medium mb-1">
                    特种作业类别
                  </label>
                  <select
                    value={specialWorkType}
                    onChange={(e) => setSpecialWorkType(e.target.value)}
                    className="w-full h-8 px-2.5 rounded border border-amber-300 bg-white text-xs text-slate-800"
                  >
                    <option value="二级动火作业">二级动火作业</option>
                    <option value="一级动火作业 (船坞油舱近区)">一级动火作业 (船坞油舱近区)</option>
                    <option value="密闭舱室作业 (强制通风检测)">密闭舱室作业 (强制通风检测)</option>
                    <option value="高处作业 (>15米脚手架)">高处作业 (&gt;15米脚手架)</option>
                    <option value="大型总段夜间特种吊装">大型总段夜间特种吊装</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] text-amber-900 font-medium mb-1">
                    现场安全监护人
                  </label>
                  <input
                    type="text"
                    value={safetySupervisor}
                    onChange={(e) => setSafetySupervisor(e.target.value)}
                    placeholder="填写现场持证安全监护人姓名"
                    className="w-full h-8 px-2.5 rounded border border-amber-300 bg-white text-xs text-slate-800"
                  />
                </div>
              </div>
            )}
          </div>

          {/* 申报人与定位标签提示 */}
          <div className="flex items-center justify-between text-xs text-slate-500 bg-slate-50 px-3 py-2 rounded-md border border-slate-200">
            <div className="flex items-center gap-1.5">
              <HardHat className="w-4 h-4 text-blue-600" />
              <span>佩戴标签：<span className="font-mono font-medium text-slate-700">{currentEmp.tagCode || '未绑定'}</span></span>
            </div>
            <div className="flex items-center gap-1.5">
              <span>申报人：</span>
              <input
                type="text"
                value={applicant}
                onChange={(e) => setApplicant(e.target.value)}
                className="w-32 h-6 px-1.5 border border-slate-300 rounded bg-white text-xs"
              />
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-200 bg-slate-50 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-600 bg-white border border-slate-300 rounded-md hover:bg-slate-100 transition-colors cursor-pointer"
          >
            取消
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="px-5 py-2 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors shadow-sm cursor-pointer"
          >
            提交加班审批
          </button>
        </div>
      </div>
    </div>
  );
}
