/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  X, 
  Clock, 
  User, 
  Building2, 
  FolderKanban, 
  MapPin, 
  ShieldAlert, 
  CheckCircle2, 
  AlertCircle, 
  XCircle,
  Radio, 
  Calendar,
  FileText,
  Check,
  Ban,
  HardHat,
  ArrowRight
} from 'lucide-react';
import { OvertimeRecord } from '@/src/data/overtimeData';

interface OvertimeDetailModalProps {
  record: OvertimeRecord | null;
  isOpen: boolean;
  onClose: () => void;
  onApprove?: (record: OvertimeRecord, remark?: string) => void;
  onReject?: (record: OvertimeRecord, remark?: string) => void;
  onComplete?: (record: OvertimeRecord) => void;
}

export function OvertimeDetailModal({ 
  record, 
  isOpen, 
  onClose,
  onApprove,
  onReject,
  onComplete
}: OvertimeDetailModalProps) {
  if (!isOpen || !record) return null;

  const getStatusBadge = (status: OvertimeRecord['status']) => {
    switch (status) {
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
            待审批
          </span>
        );
      case 'approved':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5" />
            已批准 (作业中)
          </span>
        );
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
            <Check className="w-3.5 h-3.5" />
            作业已完工
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
            <XCircle className="w-3.5 h-3.5" />
            已驳回
          </span>
        );
    }
  };

  const getTypeName = (type: OvertimeRecord['overtimeType']) => {
    switch (type) {
      case 'workday': return '工作日延时加班';
      case 'weekend': return '休息日加班';
      case 'holiday': return '法定节假日加班';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-600 text-white">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-800">加班单详情</h2>
                <span className="font-mono text-xs font-medium text-slate-500">{record.id}</span>
                {getStatusBadge(record.status)}
              </div>
              <p className="text-xs text-slate-500">申报时间：{record.applyTime} · 申报人：{record.applicant}</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5 text-sm">
          {/* 人员基本信息卡片 */}
          <div className="p-4 rounded-lg bg-slate-50/80 border border-slate-200/80 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-lg border border-blue-200 shrink-0">
                {record.empName.slice(0, 1)}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900 text-base">{record.empName}</span>
                  <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 text-xs font-medium border border-blue-200">
                    {record.postJob}
                  </span>
                  <span className="font-mono text-xs text-slate-500">工号: {record.empCode}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                  <Building2 className="w-3.5 h-3.5 text-slate-400" />
                  <span>{record.deptName}</span>
                </div>
              </div>
            </div>

            <div className="text-right">
              <div className="flex items-center gap-1.5 justify-end text-xs text-slate-600">
                <Radio className="w-3.5 h-3.5 text-blue-600" />
                <span className="font-mono">{record.tagCode || '未配发'}</span>
              </div>
              <div className="text-[11px] text-emerald-600 font-medium mt-0.5">
                ● 定位标签在线正常
              </div>
            </div>
          </div>

          {/* 加班核心信息矩阵 */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 rounded-lg border border-slate-200 bg-white">
              <div className="text-[11px] text-slate-400 mb-1">加班类型</div>
              <div className="text-xs font-bold text-slate-800">{getTypeName(record.overtimeType)}</div>
            </div>
            <div className="p-3 rounded-lg border border-slate-200 bg-white">
              <div className="text-[11px] text-slate-400 mb-1">加班日期</div>
              <div className="text-xs font-bold text-slate-800">{record.date}</div>
            </div>
            <div className="p-3 rounded-lg border border-slate-200 bg-white">
              <div className="text-[11px] text-slate-400 mb-1">作业时段</div>
              <div className="text-xs font-bold font-mono text-slate-800">{record.startTime} ~ {record.endTime}</div>
            </div>
            <div className="p-3 rounded-lg border border-blue-100 bg-blue-50/50">
              <div className="text-[11px] text-blue-600 mb-1">核定加班工时</div>
              <div className="text-sm font-black text-blue-700 font-mono">{record.hours} 小时</div>
            </div>
          </div>

          {/* 工程项目与施工作业位置 */}
          <div className="p-4 rounded-lg border border-slate-200 bg-white space-y-2.5">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
              <FolderKanban className="w-4 h-4 text-blue-600" />
              <span>工程项目与作业位置</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-slate-400">施工船舶项目：</span>
                <span className="font-semibold text-slate-800">{record.projectName}</span>
              </div>
              <div>
                <span className="text-slate-400">作业泊位/分段：</span>
                <span className="font-semibold text-slate-800">{record.workArea}</span>
              </div>
            </div>
          </div>

          {/* 作业事由与详细任务 */}
          <div className="p-4 rounded-lg border border-slate-200 bg-white space-y-2">
            <div className="text-xs font-bold text-slate-700 flex items-center gap-2">
              <FileText className="w-4 h-4 text-blue-600" />
              <span>加班事由与作业任务</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded border border-slate-200/60">
              {record.reason}
            </p>
          </div>

          {/* 特种与危大作业管控 */}
          <div className={`p-4 rounded-lg border ${record.isSpecialWork ? 'border-amber-300 bg-amber-50/60' : 'border-slate-200 bg-slate-50'} space-y-2`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                <ShieldAlert className={`w-4 h-4 ${record.isSpecialWork ? 'text-amber-600' : 'text-slate-400'}`} />
                <span>特种作业安全管控</span>
              </div>
              {record.isSpecialWork ? (
                <span className="text-[10px] px-2 py-0.5 rounded font-bold bg-amber-100 text-amber-800 border border-amber-300">
                  {record.specialWorkType || '特种作业'}
                </span>
              ) : (
                <span className="text-[10px] px-2 py-0.5 rounded text-slate-500 bg-slate-200">
                  常规普通作业
                </span>
              )}
            </div>

            {record.isSpecialWork && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-amber-900 pt-1">
                <div>现场安全监护人：<span className="font-semibold">{record.safetySupervisor}</span></div>
                <div>安全预警：<span className="text-amber-800 font-medium">严禁单人作业，测爆通风及防火器材到位</span></div>
              </div>
            )}
          </div>

          {/* 审批记录与意见 */}
          <div className="p-4 rounded-lg border border-slate-200 bg-white space-y-2.5">
            <div className="text-xs font-bold text-slate-700 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-blue-600" />
              <span>审批流转与批注意见</span>
            </div>
            {record.approver ? (
              <div className="space-y-1.5 text-xs">
                <div className="flex items-center justify-between text-slate-500">
                  <span>审批人：<strong className="text-slate-700">{record.approver}</strong></span>
                  <span>审批时间：<strong className="text-slate-700">{record.approveTime}</strong></span>
                </div>
                {record.remark && (
                  <div className="p-2.5 rounded bg-slate-50 border border-slate-200 text-slate-600">
                    {record.remark}
                  </div>
                )}
              </div>
            ) : (
              <div className="text-xs text-amber-600 bg-amber-50 p-2.5 rounded border border-amber-200">
                当前申请正在等待车间/制造部主管领导审批中
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-3.5 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="text-xs text-slate-400">
            船厂人员定位与工时考勤协同系统
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-600 bg-white border border-slate-300 rounded-md hover:bg-slate-100 transition-colors cursor-pointer"
            >
              关闭
            </button>

            {record.status === 'pending' && onReject && (
              <button
                onClick={() => {
                  onReject(record);
                  onClose();
                }}
                className="px-4 py-2 text-xs font-medium text-rose-700 bg-rose-50 border border-rose-200 rounded-md hover:bg-rose-100 transition-colors cursor-pointer"
              >
                驳回申请
              </button>
            )}

            {record.status === 'pending' && onApprove && (
              <button
                onClick={() => {
                  onApprove(record);
                  onClose();
                }}
                className="px-4 py-2 text-xs font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-md transition-colors shadow-sm cursor-pointer"
              >
                同意批准
              </button>
            )}

            {record.status === 'approved' && onComplete && (
              <button
                onClick={() => {
                  onComplete(record);
                  onClose();
                }}
                className="px-4 py-2 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors shadow-sm cursor-pointer"
              >
                作业完工核销
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
