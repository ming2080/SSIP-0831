/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * 智慧船厂 - 加班管理数据定义与存储服务
 */

export type OvertimeType = 'workday' | 'weekend' | 'holiday';
export type OvertimeStatus = 'pending' | 'approved' | 'rejected' | 'completed';

export interface OvertimeRecord {
  id: string; // 加班单号, 如 OT-20260916-001
  empId: string; // 员工ID
  empName: string; // 员工姓名
  empCode: string; // 工号
  deptId: string; // 部门/班组ID
  deptName: string; // 部门/班组名称
  postJob: string; // 岗位工种
  projectId: string; // 关联项目ID
  projectName: string; // 项目/船舶名称
  workArea: string; // 施工作业区域/泊位
  overtimeType: OvertimeType; // 加班类型
  date: string; // 加班日期 YYYY-MM-DD
  startTime: string; // 开始时间 HH:mm
  endTime: string; // 结束时间 HH:mm
  hours: number; // 核定工时 (小时)
  reason: string; // 加班事由 / 作业内容
  isSpecialWork: boolean; // 是否属于特种/高危作业 (动火、受限空间、高空等)
  specialWorkType?: string; // 特种作业类别
  safetySupervisor: string; // 现场安全监护人
  tagCode?: string; // UWB定位标签编号
  tagStatus: 'normal' | 'low_battery' | 'not_worn'; // 定位标签状态
  status: OvertimeStatus; // 审批状态
  applicant: string; // 申报人
  applyTime: string; // 申报时间
  approver?: string; // 审批人
  approveTime?: string; // 审批时间
  remark?: string; // 审批意见/备注
}

export const INITIAL_OVERTIME_RECORDS: OvertimeRecord[] = [
  {
    id: 'OT-20260916-001',
    empId: 'EMP-1001',
    empName: '陈建国',
    empCode: 'DN-8001',
    deptId: 'DEPT-0101',
    deptName: '东南船厂//制造部//船体电焊一组',
    postJob: '船舶电焊工',
    projectId: 'PRJ-2026-LNG01',
    projectName: '17.4万m³ 薄膜型大型LNG船 1号舰',
    workArea: '1号船坞合拢段货舱双层底区域',
    overtimeType: 'workday',
    date: '2026-09-16',
    startTime: '18:00',
    endTime: '22:00',
    hours: 4.0,
    reason: '货舱双层底纵骨焊缝平位探伤前抢焊，确保明日无损射线检测(RT)准时开展',
    isSpecialWork: true,
    specialWorkType: '二级动火作业 + 密闭舱室作业',
    safetySupervisor: '周卫国 (注册安全工程师)',
    tagCode: 'UWB-1001',
    tagStatus: 'normal',
    status: 'approved',
    applicant: '李大为 (班组长)',
    applyTime: '2026-09-16 14:20',
    approver: '张建军 (制造部部长)',
    approveTime: '2026-09-16 15:45',
    remark: '批准加班。已核实测爆通风合格，作业时必须佩戴UWB人员定位标签并设双人监护。'
  },
  {
    id: 'OT-20260916-002',
    empId: 'EMP-1002',
    empName: '林少伟',
    empCode: 'DN-8002',
    deptId: 'DEPT-0101',
    deptName: '东南船厂//制造部//船体电焊一组',
    postJob: '船舶电焊工',
    projectId: 'PRJ-2026-LNG01',
    projectName: '17.4万m³ 薄膜型大型LNG船 1号舰',
    workArea: '1号船坞主甲板3号分段搭接区',
    overtimeType: 'workday',
    date: '2026-09-16',
    startTime: '18:00',
    endTime: '21:30',
    hours: 3.5,
    reason: '主甲板横向通舱件加强板自动埋弧焊补强作业',
    isSpecialWork: true,
    specialWorkType: '二级动火作业',
    safetySupervisor: '周卫国 (注册安全工程师)',
    tagCode: 'UWB-1002',
    tagStatus: 'normal',
    status: 'pending',
    applicant: '李大为 (班组长)',
    applyTime: '2026-09-16 16:10',
    remark: '待车间主管审核动火作业许可证'
  },
  {
    id: 'OT-20260916-003',
    empId: 'EMP-1003',
    empName: '黄德华',
    empCode: 'DN-8003',
    deptId: 'DEPT-0102',
    deptName: '东南船厂//制造部//船体装配二班',
    postJob: '船体装配工',
    projectId: 'PRJ-2026-BOX12',
    projectName: '24,000 TEU 超大型集装箱船',
    workArea: '船台东侧5号总组平台',
    overtimeType: 'workday',
    date: '2026-09-16',
    startTime: '18:30',
    endTime: '22:30',
    hours: 4.0,
    reason: '超大型导轨架立体预装配定位调整，避开日间吊车占用高峰',
    isSpecialWork: false,
    safetySupervisor: '赵铁柱 (现场班长)',
    tagCode: 'UWB-1003',
    tagStatus: 'normal',
    status: 'approved',
    applicant: '赵铁柱 (现场班长)',
    applyTime: '2026-09-16 11:30',
    approver: '王海川 (车间主任)',
    approveTime: '2026-09-16 13:10',
    remark: '同意，夜间注意现场照明，吊装配合需佩戴对讲机。'
  },
  {
    id: 'OT-20260915-004',
    empId: 'EMP-1004',
    empName: '吴天明',
    empCode: 'MW-8004',
    deptId: 'DEPT-0501',
    deptName: '马尾造船厂//机电工程部//船舶主电缆敷设班',
    postJob: '船舶电工',
    projectId: 'PRJ-2026-LNG01',
    projectName: '17.4万m³ 薄膜型大型LNG船 1号舰',
    workArea: '机舱主配电板间与集控室',
    overtimeType: 'workday',
    date: '2026-09-15',
    startTime: '17:30',
    endTime: '21:30',
    hours: 4.0,
    reason: '主机监控报警与自动遥控台接线端子校核及绝缘耐压测试',
    isSpecialWork: false,
    safetySupervisor: '陈广胜 (机电总管)',
    tagCode: 'UWB-1004',
    tagStatus: 'normal',
    status: 'completed',
    applicant: '陈广胜 (机电总管)',
    applyTime: '2026-09-15 14:00',
    approver: '何立峰 (机电部部长)',
    approveTime: '2026-09-15 15:20',
    remark: '测试完成，绝缘达标已归档。'
  },
  {
    id: 'OT-20260915-005',
    empId: 'EMP-1005',
    empName: '郑志强',
    empCode: 'MW-8005',
    deptId: 'DEPT-0502',
    deptName: '马尾造船厂//机电工程部//轮机调试一组',
    postJob: '轮机检验员',
    projectId: 'PRJ-2026-BOX12',
    projectName: '24,000 TEU 超大型集装箱船',
    workArea: '系泊码头2号泊位 辅机舱',
    overtimeType: 'workday',
    date: '2026-09-15',
    startTime: '18:00',
    endTime: '23:00',
    hours: 5.0,
    reason: '3号主发电机负荷试车及燃油高压共轨回油泄漏报警联锁验证',
    isSpecialWork: true,
    specialWorkType: '高压动力设备连续试运行',
    safetySupervisor: '孙志清 (安全总监)',
    tagCode: 'UWB-1005',
    tagStatus: 'normal',
    status: 'completed',
    applicant: '郑志强',
    applyTime: '2026-09-15 10:20',
    approver: '何立峰 (机电部部长)',
    approveTime: '2026-09-15 11:45',
    remark: '联锁测试圆满完成，机组参数正常。'
  },
  {
    id: 'OT-20260914-006',
    empId: 'EMP-1006',
    empName: '刘宏伟',
    empCode: 'DN-8006',
    deptId: 'DEPT-0201',
    deptName: '东南船厂//搭载部//大合拢搭载班',
    postJob: '船体合拢工',
    projectId: 'PRJ-2026-LNG01',
    projectName: '17.4万m³ 薄膜型大型LNG船 1号舰',
    workArea: '1号船坞 船艏总段合拢缝',
    overtimeType: 'weekend',
    date: '2026-09-14',
    startTime: '08:30',
    endTime: '17:30',
    hours: 8.0,
    reason: '周末连续作业进行船艏大球鼻艏立体合龙定位与拉线校正',
    isSpecialWork: true,
    specialWorkType: '高空立体搭载作业 (>15米)',
    safetySupervisor: '周卫国 (安全工程师)',
    tagCode: 'UWB-1006',
    tagStatus: 'normal',
    status: 'completed',
    applicant: '刘宏伟',
    applyTime: '2026-09-13 16:30',
    approver: '王海川 (制造部主管)',
    approveTime: '2026-09-13 17:15',
    remark: '合拢线已按精度基准到位。'
  },
  {
    id: 'OT-20260916-007',
    empId: 'EMP-1007',
    empName: '郭庆林',
    empCode: 'DN-8007',
    deptId: 'DEPT-0103',
    deptName: '东南船厂//制造部//气割与等离子切割组',
    postJob: '数控切割工',
    projectId: 'PRJ-2026-BOX12',
    projectName: '24,000 TEU 超大型集装箱船',
    workArea: '钢料预处理切割车间2号数控下料机',
    overtimeType: 'workday',
    date: '2026-09-16',
    startTime: '18:00',
    endTime: '22:00',
    hours: 4.0,
    reason: '止裂钢特厚板高精度坡口数控等离子连续套料切割',
    isSpecialWork: false,
    safetySupervisor: '徐向东 (车间安全员)',
    tagCode: 'UWB-1007',
    tagStatus: 'normal',
    status: 'pending',
    applicant: '郭庆林',
    applyTime: '2026-09-16 15:30',
    remark: '待车间材料排产调度审核'
  },
  {
    id: 'OT-20260913-008',
    empId: 'EMP-1008',
    empName: '张福胜',
    empCode: 'SUB-9001',
    deptId: 'DEPT-0701',
    deptName: '外协工程施工分队//利亚工程施工队//外协脚手架搭设班',
    postJob: '搭架工',
    projectId: 'PRJ-2026-LNG01',
    projectName: '17.4万m³ 薄膜型大型LNG船 1号舰',
    workArea: '2号货舱绝热层专用脚手架',
    overtimeType: 'weekend',
    date: '2026-09-13',
    startTime: '08:00',
    endTime: '16:00',
    hours: 7.0,
    reason: '外协搭设殷瓦钢绝热箱安装专用超轻复合脚手架平台',
    isSpecialWork: true,
    specialWorkType: '特级高空作业 (22米) + 密闭空间',
    safetySupervisor: '周卫国 (安全工程师)',
    tagCode: 'UWB-1008',
    tagStatus: 'normal',
    status: 'completed',
    applicant: '张福胜',
    applyTime: '2026-09-12 14:00',
    approver: '张建军 (制造部部长)',
    approveTime: '2026-09-12 16:30',
    remark: '脚手架验收合格，已挂绿色合格通行牌。'
  },
  {
    id: 'OT-20260912-009',
    empId: 'EMP-1009',
    empName: '孙保平',
    empCode: 'SUB-9002',
    deptId: 'DEPT-0702',
    deptName: '外协工程施工分队//利亚工程施工队//外协舱室打磨打砂班',
    postJob: '打砂工',
    projectId: 'PRJ-2026-BOX12',
    projectName: '24,000 TEU 超大型集装箱船',
    workArea: '涂装分段1号喷砂密闭房',
    overtimeType: 'workday',
    date: '2026-09-12',
    startTime: '19:00',
    endTime: '23:30',
    hours: 4.5,
    reason: '压载舱特种环氧防腐涂装前Sa2.5级高压除锈喷砂',
    isSpecialWork: true,
    specialWorkType: '粉尘密闭空间作业 + 强制正压送风呼吸',
    safetySupervisor: '王明安 (安全员)',
    tagCode: 'UWB-1009',
    tagStatus: 'normal',
    status: 'completed',
    applicant: '孙保平',
    applyTime: '2026-09-12 15:10',
    approver: '王海川 (车间主任)',
    approveTime: '2026-09-12 16:40',
    remark: '除锈粗糙度评定达标，已换气通风。'
  },
  {
    id: 'OT-20260911-010',
    empId: 'EMP-1010',
    empName: '郑长富',
    empCode: 'DN-8010',
    deptId: 'DEPT-0101',
    deptName: '东南船厂//制造部//船体电焊一组',
    postJob: '船舶电焊工',
    projectId: 'PRJ-2026-LNG01',
    projectName: '17.4万m³ 薄膜型大型LNG船 1号舰',
    workArea: '合拢口舷侧外板',
    overtimeType: 'workday',
    date: '2026-09-11',
    startTime: '18:00',
    endTime: '21:00',
    hours: 3.0,
    reason: '外板纵缝打底及盖面填充焊接',
    isSpecialWork: true,
    specialWorkType: '二级动火作业',
    safetySupervisor: '周卫国 (安全工程师)',
    tagCode: 'UWB-1010',
    tagStatus: 'normal',
    status: 'rejected',
    applicant: '郑长富',
    applyTime: '2026-09-11 16:50',
    approver: '张建军 (制造部部长)',
    approveTime: '2026-09-11 17:30',
    remark: '当晚该施工区域有探伤强辐射交叉作业，安全距离不足，驳回申请，建议顺延至次日清晨安排。'
  }
];

const STORAGE_KEY = 'shipyard_overtime_data';

export function getStoredOvertimeRecords(): OvertimeRecord[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.error('Failed to load overtime records from localStorage', e);
  }
  return INITIAL_OVERTIME_RECORDS;
}

export function saveStoredOvertimeRecords(records: OvertimeRecord[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
    window.dispatchEvent(new CustomEvent('overtime_data_updated', { detail: { records } }));
  } catch (e) {
    console.error('Failed to save overtime records to localStorage', e);
  }
}
