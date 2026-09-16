/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { X, CheckCircle2, XCircle, AlertTriangle, ShieldCheck } from 'lucide-react';
import { OvertimeRecord } from '@/src/data/overtimeData';

interface OvertimeApproveModalProps {
  record: OvertimeRecord | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (record: OvertimeRecord, action: 'approved' | 'rejected', remark: string, approver: string) => void;
}

export function OvertimeApproveModal({
  record,
  isOpen,
  onClose,
  onConfirm
}: OvertimeApproveModalProps) {
  const [action, setAction] = useState<'approved' | 'rejected'>('approved');
  const [remark, setRemark] = useState<string>('同意加班。已核实测爆通风合格，作业必须佩戴UWB定位标签并设现场双人监护。');
  const [approver, setApprover] = useState<string>('张工 (系统管理员/车间主管)');

  if (!isOpen || !record) return null;

  const quickApproveRemarks = [
    '同意加班。已核实测爆通风合格，作业必须佩戴UWB定位标签并设现场双人监护。',
    '批准。现场吊运配合请提前做好警戒标志，穿戴反光工作服。',
    '同意延时作业，保障关键合拢节点，完工后及时清理焊渣灭火器归位。'
  ];

  const quickRejectRemarks = [
    '施工区域今晚有无损RT探伤强辐射作业，安全距离不足，驳回并顺延次日安排。',
    '未提供合格动火作业许可证与有限空间测爆记录，暂不予批准。',
    '当前连续加班工时已超上限，请调整安排其他班组人员轮岗。'
  ];

  const handleActionChange = (newAction: 'approved' | 'rejected') => {
    setAction(newAction);
    if (newAction === 'approved') {
      setRemark(quickApproveRemarks[0]);
    } else {
      setRemark(quickRejectRemarks[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirm(record, action, remark.trim(), approver);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-2.5">
            <div className={`p-2 rounded-lg text-white ${action === 'approved' ? 'bg-emerald-600' : 'bg-rose-600'}`}>
              {action === 'approved' ? <CheckCircle2 className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-800">加班审批处理</h2>
              <p className="text-xs text-slate-500">单号: {record.id} · {record.empName} ({record.postJob})</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-sm">
          {/* 简要概要 */}
          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs space-y-1.5">
            <div className="flex justify-between">
              <span className="text-slate-400">申报项目：</span>
              <span className="font-semibold text-slate-700">{record.projectName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">施工区域：</span>
              <span className="font-semibold text-slate-700">{record.workArea}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">加班时段：</span>
              <span className="font-mono text-blue-600 font-bold">{record.date} {record.startTime}~{record.endTime} ({record.hours}h)</span>
            </div>
            {record.isSpecialWork && (
              <div className="flex justify-between text-amber-700 font-medium">
                <span>特种高危作业：</span>
                <span>{record.specialWorkType} (监护人: {record.safetySupervisor})</span>
              </div>
            )}
          </div>

          {/* 审批动作单选 */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              审批决议
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handleActionChange('approved')}
                className={`py-2 px-3 rounded-lg border text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  action === 'approved' 
                    ? 'border-emerald-500 bg-emerald-50 text-emerald-700 ring-2 ring-emerald-200' 
                    : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                同意批准
              </button>
              <button
                type="button"
                onClick={() => handleActionChange('rejected')}
                className={`py-2 px-3 rounded-lg border text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  action === 'rejected' 
                    ? 'border-rose-500 bg-rose-50 text-rose-700 ring-2 ring-rose-200' 
                    : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                <XCircle className="w-4 h-4 text-rose-600" />
                驳回申请
              </button>
            </div>
          </div>

          {/* 快捷理由选择 */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              常用审批意见快捷置入
            </label>
            <div className="space-y-1">
              {(action === 'approved' ? quickApproveRemarks : quickRejectRemarks).map((text, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setRemark(text)}
                  className="w-full text-left text-[11px] p-1.5 rounded hover:bg-slate-100 text-slate-600 border border-transparent hover:border-slate-200 transition-colors line-clamp-1"
                >
                  · {text}
                </button>
              ))}
            </div>
          </div>

          {/* 审批意见文本框 */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              审批批注意见
            </label>
            <textarea
              rows={3}
              value={remark}
              onChange={(e) => setRemark(e.target.value)}
              className="w-full p-2.5 rounded-md border border-slate-300 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* 审批人 */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              审批人签名
            </label>
            <input
              type="text"
              value={approver}
              onChange={(e) => setApprover(e.target.value)}
              className="w-full h-8 px-2.5 rounded border border-slate-300 text-xs bg-slate-50 text-slate-700 font-medium"
            />
          </div>

          {/* Footer */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-600 bg-white border border-slate-300 rounded-md hover:bg-slate-100 transition-colors cursor-pointer"
            >
              取消
            </button>
            <button
              type="submit"
              className={`px-5 py-2 text-xs font-medium text-white rounded-md transition-colors shadow-sm cursor-pointer ${
                action === 'approved' 
                  ? 'bg-emerald-600 hover:bg-emerald-700' 
                  : 'bg-rose-600 hover:bg-rose-700'
              }`}
            >
              确认提交审批
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
