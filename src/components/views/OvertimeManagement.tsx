/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * 加班管理功能模块
 * 涵盖：加班申报、安全交底核查、审批流转、特种作业现场双人监护追踪、工时报表导出
 */

import React, { useState, useMemo, useEffect } from 'react';
import { 
  Clock, 
  Search, 
  Filter, 
  Plus, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Download, 
  RotateCcw, 
  Building2, 
  FolderKanban, 
  MapPin, 
  ShieldAlert, 
  Radio, 
  Check, 
  Eye, 
  Sparkles,
  Layers,
  HardHat,
  Calendar,
  Users
} from 'lucide-react';
import { 
  OvertimeRecord, 
  OvertimeType, 
  OvertimeStatus,
  getStoredOvertimeRecords, 
  saveStoredOvertimeRecords 
} from '@/src/data/overtimeData';
import { MOCK_PROJECTS } from '@/src/data/mockProjects';
import { CreateOvertimeModal } from './overtime/CreateOvertimeModal';
import { OvertimeDetailModal } from './overtime/OvertimeDetailModal';
import { OvertimeApproveModal } from './overtime/OvertimeApproveModal';

export function OvertimeManagement() {
  const [records, setRecords] = useState<OvertimeRecord[]>(() => getStoredOvertimeRecords());
  
  // 筛选状态
  const [searchKeyword, setSearchKeyword] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [typeFilter, setTypeFilter] = useState<string>('ALL');
  const [projectFilter, setProjectFilter] = useState<string>('ALL');
  const [onlySpecialWork, setOnlySpecialWork] = useState<boolean>(false);

  // 选中的记录（批量操作）
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // 模态框状态
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [detailRecord, setDetailRecord] = useState<OvertimeRecord | null>(null);
  const [approveRecord, setApproveRecord] = useState<OvertimeRecord | null>(null);

  // 监听跨组件变更
  useEffect(() => {
    const handleUpdate = (e: any) => {
      if (e.detail?.records) {
        setRecords(e.detail.records);
      }
    };
    window.addEventListener('overtime_data_updated', handleUpdate);
    return () => window.removeEventListener('overtime_data_updated', handleUpdate);
  }, []);

  const updateRecords = (newRecords: OvertimeRecord[]) => {
    setRecords(newRecords);
    saveStoredOvertimeRecords(newRecords);
  };

  // 过滤后的数据
  const filteredRecords = useMemo(() => {
    return records.filter(item => {
      // 关键字搜索
      if (searchKeyword.trim()) {
        const kw = searchKeyword.toLowerCase();
        const matchName = item.empName.toLowerCase().includes(kw);
        const matchCode = item.empCode.toLowerCase().includes(kw);
        const matchJob = item.postJob.toLowerCase().includes(kw);
        const matchId = item.id.toLowerCase().includes(kw);
        const matchArea = item.workArea.toLowerCase().includes(kw);
        const matchReason = item.reason.toLowerCase().includes(kw);
        if (!matchName && !matchCode && !matchJob && !matchId && !matchArea && !matchReason) {
          return false;
        }
      }

      // 状态筛选
      if (statusFilter !== 'ALL' && item.status !== statusFilter) {
        return false;
      }

      // 类型筛选
      if (typeFilter !== 'ALL' && item.overtimeType !== typeFilter) {
        return false;
      }

      // 项目筛选
      if (projectFilter !== 'ALL' && item.projectId !== projectFilter) {
        return false;
      }

      // 特种作业筛选
      if (onlySpecialWork && !item.isSpecialWork) {
        return false;
      }

      return true;
    });
  }, [records, searchKeyword, statusFilter, typeFilter, projectFilter, onlySpecialWork]);

  // 统计指标
  const metrics = useMemo(() => {
    const totalToday = records.filter(r => r.date === '2026-09-16' && r.status !== 'rejected').length;
    const totalHours = records
      .filter(r => r.status === 'approved' || r.status === 'completed')
      .reduce((sum, r) => sum + r.hours, 0);
    const pendingCount = records.filter(r => r.status === 'pending').length;
    const specialCount = records.filter(r => r.isSpecialWork && r.status !== 'rejected').length;

    return {
      totalToday,
      totalHours: Math.round(totalHours * 10) / 10,
      pendingCount,
      specialCount
    };
  }, [records]);

  // 新增申报保存
  const handleCreateSubmit = (newRecord: OvertimeRecord) => {
    const next = [newRecord, ...records];
    updateRecords(next);
  };

  // 审批提交
  const handleApproveConfirm = (
    target: OvertimeRecord, 
    action: 'approved' | 'rejected', 
    remark: string, 
    approver: string
  ) => {
    const now = new Date().toISOString().replace('T', ' ').substring(0, 16);
    const next = records.map(r => {
      if (r.id === target.id) {
        return {
          ...r,
          status: action,
          approver,
          approveTime: now,
          remark
        };
      }
      return r;
    });
    updateRecords(next);
  };

  // 完工核销
  const handleComplete = (target: OvertimeRecord) => {
    const next = records.map(r => {
      if (r.id === target.id) {
        return {
          ...r,
          status: 'completed' as OvertimeStatus
        };
      }
      return r;
    });
    updateRecords(next);
  };

  // 批量批准待审批单
  const handleBatchApprove = () => {
    const pendingSelected = records.filter(r => selectedIds.has(r.id) && r.status === 'pending');
    if (pendingSelected.length === 0) {
      alert('请先勾选状态为“待审批”的加班记录');
      return;
    }

    if (confirm(`确定一键批量批准选中的 ${pendingSelected.length} 条加班申请吗？`)) {
      const now = new Date().toISOString().replace('T', ' ').substring(0, 16);
      const next = records.map(r => {
        if (selectedIds.has(r.id) && r.status === 'pending') {
          return {
            ...r,
            status: 'approved' as OvertimeStatus,
            approver: '张工 (系统管理员/批量审批)',
            approveTime: now,
            remark: '批量审批同意，已确认人员持证与定位标签在线。'
          };
        }
        return r;
      });
      updateRecords(next);
      setSelectedIds(new Set());
    }
  };

  // 导出 CSV 报表
  const handleExportCsv = () => {
    if (filteredRecords.length === 0) {
      alert('当前暂无符合条件的加班记录可导出');
      return;
    }

    const headers = [
      '加班单号',
      '员工姓名',
      '员工工号',
      '所属部门班组',
      '岗位工种',
      '施工项目',
      '施工作业区域',
      '加班类型',
      '加班日期',
      '时段区间',
      '核定工时(h)',
      '特种高危作业',
      '安全监护人',
      '审批状态',
      '申报人',
      '申报时间',
      '审批人',
      '审批意见'
    ];

    const typeMap: Record<OvertimeType, string> = {
      workday: '工作日延时',
      weekend: '休息日加班',
      holiday: '法定节假日'
    };

    const statusMap: Record<OvertimeStatus, string> = {
      pending: '待审批',
      approved: '已批准',
      completed: '已完工',
      rejected: '已驳回'
    };

    const rows = filteredRecords.map(r => [
      `"${r.id}"`,
      `"${r.empName}"`,
      `"${r.empCode}"`,
      `"${r.deptName}"`,
      `"${r.postJob}"`,
      `"${r.projectName}"`,
      `"${r.workArea}"`,
      `"${typeMap[r.overtimeType] || r.overtimeType}"`,
      `"${r.date}"`,
      `"${r.startTime}~${r.endTime}"`,
      r.hours,
      `"${r.isSpecialWork ? r.specialWorkType || '是' : '否'}"`,
      `"${r.safetySupervisor}"`,
      `"${statusMap[r.status] || r.status}"`,
      `"${r.applicant}"`,
      `"${r.applyTime}"`,
      `"${r.approver || ''}"`,
      `"${(r.remark || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `智慧船厂_加班考勤报表_${new Date().toISOString().substring(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // 全选/反选
  const handleToggleSelectAll = () => {
    if (selectedIds.size === filteredRecords.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredRecords.map(r => r.id)));
    }
  };

  const handleToggleSelect = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    setSelectedIds(next);
  };

  const resetFilters = () => {
    setSearchKeyword('');
    setStatusFilter('ALL');
    setTypeFilter('ALL');
    setProjectFilter('ALL');
    setOnlySpecialWork(false);
  };

  return (
    <div className="space-y-4">
      {/* 顶部指标概览看板 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="p-3.5 rounded-xl bg-white border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-[11px] font-medium text-slate-400">今日在厂加班人数</div>
            <div className="text-2xl font-bold text-slate-800 font-mono mt-0.5">
              {metrics.totalToday} <span className="text-xs font-normal text-slate-500">人</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
            <Users className="w-5 h-5" />
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-white border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-[11px] font-medium text-slate-400">本月核定有效工时</div>
            <div className="text-2xl font-bold text-blue-600 font-mono mt-0.5">
              {metrics.totalHours} <span className="text-xs font-normal text-slate-500">小时</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-white border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-[11px] font-medium text-slate-400">待审批加班单</div>
            <div className="text-2xl font-bold text-amber-600 font-mono mt-0.5">
              {metrics.pendingCount} <span className="text-xs font-normal text-slate-500">单</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
            <AlertCircle className="w-5 h-5" />
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-white border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-[11px] font-medium text-slate-400">特种/危大作业申报</div>
            <div className="text-2xl font-bold text-rose-600 font-mono mt-0.5">
              {metrics.specialCount} <span className="text-xs font-normal text-slate-500">处</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
            <ShieldAlert className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* 筛选过滤与操作栏 */}
      <div className="p-3.5 rounded-xl bg-white border border-slate-200/80 shadow-xs space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* 左侧搜索与筛选 */}
          <div className="flex flex-wrap items-center gap-2.5 flex-1 min-w-[280px]">
            {/* 关键字搜索 */}
            <div className="relative w-64">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                placeholder="搜索姓名、工号、区域或作业内容..."
                className="w-full h-8 pl-8 pr-3 rounded-md border border-slate-200 bg-slate-50/70 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
              />
            </div>

            {/* 状态过滤 */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-8 px-2.5 rounded-md border border-slate-200 bg-slate-50/70 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              <option value="ALL">全部状态</option>
              <option value="pending">待审批</option>
              <option value="approved">已批准 (作业中)</option>
              <option value="completed">已完工</option>
              <option value="rejected">已驳回</option>
            </select>

            {/* 加班类型 */}
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="h-8 px-2.5 rounded-md border border-slate-200 bg-slate-50/70 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              <option value="ALL">全部加班类型</option>
              <option value="workday">工作日延时</option>
              <option value="weekend">休息日加班</option>
              <option value="holiday">法定节假日</option>
            </select>

            {/* 项目过滤 */}
            <select
              value={projectFilter}
              onChange={(e) => setProjectFilter(e.target.value)}
              className="h-8 px-2.5 rounded-md border border-slate-200 bg-slate-50/70 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer max-w-[180px] truncate"
            >
              <option value="ALL">全部船舶项目</option>
              {MOCK_PROJECTS.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>

            {/* 特种作业勾选 */}
            <label className="inline-flex items-center text-xs text-slate-600 select-none cursor-pointer bg-slate-50 px-2.5 py-1.5 rounded-md border border-slate-200 hover:bg-slate-100 transition-colors">
              <input
                type="checkbox"
                checked={onlySpecialWork}
                onChange={(e) => setOnlySpecialWork(e.target.checked)}
                className="mr-1.5 text-blue-600 rounded border-slate-300"
              />
              仅显示特种/危大作业
            </label>

            {/* 重置 */}
            {(searchKeyword || statusFilter !== 'ALL' || typeFilter !== 'ALL' || projectFilter !== 'ALL' || onlySpecialWork) && (
              <button
                onClick={resetFilters}
                className="h-8 px-2.5 text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1 rounded hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                重置
              </button>
            )}
          </div>

          {/* 右侧动作按钮 */}
          <div className="flex items-center gap-2">
            {selectedIds.size > 0 && (
              <button
                onClick={handleBatchApprove}
                className="h-8 px-3 text-xs font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-md flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Check className="w-3.5 h-3.5" />
                批量批准 ({selectedIds.size})
              </button>
            )}

            <button
              onClick={handleExportCsv}
              className="h-8 px-3 text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-md flex items-center gap-1.5 transition-colors shadow-2xs cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              导出报表
            </button>

            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="h-8 px-3.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-md flex items-center gap-1.5 transition-colors shadow-2xs cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              加班申报
            </button>
          </div>
        </div>
      </div>

      {/* 数据表格 */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-medium">
              <tr>
                <th className="w-10 px-3 py-3 text-center">
                  <input
                    type="checkbox"
                    checked={filteredRecords.length > 0 && selectedIds.size === filteredRecords.length}
                    onChange={handleToggleSelectAll}
                    className="rounded border-slate-300 text-blue-600"
                  />
                </th>
                <th className="px-3 py-3">加班单号</th>
                <th className="px-3 py-3">申报员工</th>
                <th className="px-3 py-3">所属部门/班组</th>
                <th className="px-3 py-3">施工船舶项目 / 作业区域</th>
                <th className="px-3 py-3">加班类型</th>
                <th className="px-3 py-3">加班时段与工时</th>
                <th className="px-3 py-3">特种作业与安全监护</th>
                <th className="px-3 py-3">审批状态</th>
                <th className="px-3 py-3 text-right">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-12 text-center text-slate-400">
                    <div className="flex flex-col items-center justify-center">
                      <Clock className="w-10 h-10 text-slate-300 stroke-1 mb-2" />
                      <p className="text-sm font-medium text-slate-600">暂无符合条件的加班申报记录</p>
                      <p className="text-xs text-slate-400 mt-1">您可以调整筛选条件或点击右上角“加班申报”新增记录</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredRecords.map((item) => {
                  const isChecked = selectedIds.has(item.id);

                  return (
                    <tr 
                      key={item.id}
                      className={`hover:bg-slate-50/70 transition-colors ${isChecked ? 'bg-blue-50/40' : ''}`}
                    >
                      {/* 选择框 */}
                      <td className="px-3 py-3 text-center">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleToggleSelect(item.id)}
                          className="rounded border-slate-300 text-blue-600 cursor-pointer"
                        />
                      </td>

                      {/* 单号 */}
                      <td className="px-3 py-3 font-mono text-[11px] font-medium text-slate-600 whitespace-nowrap">
                        {item.id}
                      </td>

                      {/* 员工信息 */}
                      <td className="px-3 py-3 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs shrink-0">
                            {item.empName.slice(0, 1)}
                          </div>
                          <div>
                            <div className="font-semibold text-slate-900 flex items-center gap-1.5">
                              <span>{item.empName}</span>
                              <span className="font-mono text-[10px] text-slate-400">({item.empCode})</span>
                            </div>
                            <div className="text-[11px] text-slate-500 font-medium">
                              {item.postJob}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* 所属部门 */}
                      <td className="px-3 py-3 max-w-[180px] truncate text-slate-600" title={item.deptName}>
                        <div className="truncate text-xs">{item.deptName.split('//').pop()}</div>
                        <div className="text-[10px] text-slate-400 truncate">{item.deptName.split('//')[0]}</div>
                      </td>

                      {/* 船舶项目与施工区域 */}
                      <td className="px-3 py-3 max-w-[220px]">
                        <div className="font-medium text-slate-900 truncate" title={item.projectName}>
                          {item.projectName}
                        </div>
                        <div className="flex items-center gap-1 text-[11px] text-slate-500 truncate mt-0.5" title={item.workArea}>
                          <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                          <span className="truncate">{item.workArea}</span>
                        </div>
                      </td>

                      {/* 加班类型 */}
                      <td className="px-3 py-3 whitespace-nowrap">
                        {item.overtimeType === 'workday' && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-blue-50 text-blue-700 border border-blue-200">
                            工作日延时
                          </span>
                        )}
                        {item.overtimeType === 'weekend' && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-purple-50 text-purple-700 border border-purple-200">
                            休息日加班
                          </span>
                        )}
                        {item.overtimeType === 'holiday' && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-amber-50 text-amber-800 border border-amber-200 font-bold">
                            法定节假日
                          </span>
                        )}
                      </td>

                      {/* 加班时段 */}
                      <td className="px-3 py-3 whitespace-nowrap">
                        <div className="font-mono text-slate-800 font-semibold flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-400" />
                          <span>{item.startTime} ~ {item.endTime}</span>
                          <span className="text-[10px] text-blue-600 bg-blue-50 px-1 rounded font-bold">
                            {item.hours}h
                          </span>
                        </div>
                        <div className="text-[10px] text-slate-400 mt-0.5">
                          {item.date}
                        </div>
                      </td>

                      {/* 特种作业与安全监护 */}
                      <td className="px-3 py-3 whitespace-nowrap">
                        {item.isSpecialWork ? (
                          <div>
                            <div className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-300">
                              <ShieldAlert className="w-3 h-3 text-amber-600" />
                              {item.specialWorkType || '特种作业'}
                            </div>
                            <div className="text-[10px] text-slate-500 mt-0.5">
                              监护人: <span className="text-slate-700 font-medium">{item.safetySupervisor}</span>
                            </div>
                          </div>
                        ) : (
                          <div className="text-slate-400 text-[11px]">
                            常规作业 · 巡检组
                          </div>
                        )}
                      </td>

                      {/* 审批状态 */}
                      <td className="px-3 py-3 whitespace-nowrap">
                        {item.status === 'pending' && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                            待审批
                          </span>
                        )}
                        {item.status === 'approved' && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            已批准
                          </span>
                        )}
                        {item.status === 'completed' && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                            <Check className="w-3 h-3 text-blue-600" />
                            已完工
                          </span>
                        )}
                        {item.status === 'rejected' && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                            <XCircle className="w-3 h-3 text-rose-600" />
                            已驳回
                          </span>
                        )}
                      </td>

                      {/* 操作 */}
                      <td className="px-3 py-3 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setDetailRecord(item)}
                            className="p-1 rounded text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                            title="查看详情"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          {item.status === 'pending' && (
                            <button
                              onClick={() => setApproveRecord(item)}
                              className="px-2 py-1 rounded text-[11px] font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors cursor-pointer shadow-2xs"
                            >
                              审批
                            </button>
                          )}

                          {item.status === 'approved' && (
                            <button
                              onClick={() => handleComplete(item)}
                              className="px-2 py-1 rounded text-[11px] font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 transition-colors cursor-pointer"
                              title="确认作业完成并核销"
                            >
                              完工核销
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* 表格底部信息 */}
        <div className="px-4 py-3 bg-slate-50/60 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <div>
            共 <span className="font-semibold text-slate-800">{filteredRecords.length}</span> 条加班记录
            {filteredRecords.length > 0 && (
              <span className="ml-2 text-slate-400">
                (核定工时合计: <strong className="text-blue-600">{filteredRecords.reduce((s, r) => s + r.hours, 0)}</strong> 小时)
              </span>
            )}
          </div>
          <div className="flex items-center gap-4 text-[11px] text-slate-400">
            <span>数据源: 船厂现场考勤与UWB定位协同系统</span>
            <span>更新频率: 实时</span>
          </div>
        </div>
      </div>

      {/* 模态框组 */}
      <CreateOvertimeModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateSubmit}
      />

      <OvertimeDetailModal
        record={detailRecord}
        isOpen={!!detailRecord}
        onClose={() => setDetailRecord(null)}
        onApprove={(rec) => {
          setDetailRecord(null);
          setApproveRecord(rec);
        }}
        onReject={(rec) => {
          setDetailRecord(null);
          setApproveRecord(rec);
        }}
        onComplete={(rec) => {
          handleComplete(rec);
          setDetailRecord(null);
        }}
      />

      <OvertimeApproveModal
        record={approveRecord}
        isOpen={!!approveRecord}
        onClose={() => setApproveRecord(null)}
        onConfirm={handleApproveConfirm}
      />
    </div>
  );
}
