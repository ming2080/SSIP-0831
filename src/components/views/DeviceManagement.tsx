import React, { useState, useMemo } from 'react';
import { 
  Search, 
  RotateCcw, 
  Plus, 
  Radio, 
  Trash2,
  X, 
  Flame,
  Volume2,
  Video,
  Calendar,
  Layers,
  Cpu,
  Tv,
  AlertTriangle,
  Ship,
  Info
} from 'lucide-react';
import { MOCK_PROJECTS } from '@/src/data/mockProjects';

export type DeviceTab = 'main_station' | 'gas_detector' | 'alarm' | 'camera';

// BIM 3D 模型分层定义
export interface ModelLayerOption {
  id: string; // 'deck' | 'middle' | 'bottom' | 'engine' | 'bridge'
  name: string;
  fullName: string;
  elevation: string;
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;
  dotBg: string;
}

export const MODEL_LAYER_OPTIONS: ModelLayerOption[] = [
  {
    id: 'deck',
    name: '甲板层',
    fullName: '甲板层 (主甲板/露天作业区)',
    elevation: '+18.5m ~ +24.0m',
    badgeBg: 'bg-emerald-50',
    badgeText: 'text-emerald-700',
    badgeBorder: 'border-emerald-200',
    dotBg: 'bg-emerald-500'
  },
  {
    id: 'middle',
    name: '中舱层',
    fullName: '中舱层 (货舱上部/中层平台)',
    elevation: '+8.0m ~ +18.5m',
    badgeBg: 'bg-sky-50',
    badgeText: 'text-sky-700',
    badgeBorder: 'border-sky-200',
    dotBg: 'bg-sky-500'
  },
  {
    id: 'bottom',
    name: '底舱层',
    fullName: '底舱层 (双层底/压载密闭舱)',
    elevation: '0.0m ~ +8.0m',
    badgeBg: 'bg-fuchsia-50',
    badgeText: 'text-fuchsia-700',
    badgeBorder: 'border-fuchsia-200',
    dotBg: 'bg-fuchsia-500'
  },
  {
    id: 'engine',
    name: '机舱区',
    fullName: '机舱动力区 (主机/辅机与管系舱)',
    elevation: '-2.0m ~ +12.0m',
    badgeBg: 'bg-amber-50',
    badgeText: 'text-amber-700',
    badgeBorder: 'border-amber-200',
    dotBg: 'bg-amber-500'
  },
  {
    id: 'bridge',
    name: '驾驶台',
    fullName: '驾驶台 (上层建筑/驾控生活区)',
    elevation: '+24.0m ~ +36.0m',
    badgeBg: 'bg-purple-50',
    badgeText: 'text-purple-700',
    badgeBorder: 'border-purple-200',
    dotBg: 'bg-purple-500'
  }
];

export function getLayerOption(levelId?: string): ModelLayerOption | undefined {
  return MODEL_LAYER_OPTIONS.find(l => l.id === levelId);
}

// 1. 主基站类型
export interface BaseStationDevice {
  id: string;
  seq: number;
  code: string;           // 基站编码
  name: string;           // 基站名称
  associationType?: 'global' | 'project'; // 关联模式: 全厂通用设备 | 造船项目
  projectId?: string;     // 项目ID (如 PRJ-2026-LNG01)
  project: string;        // 所属项目或全厂通用
  modelLevel?: string;    // 模型分层 (deck | middle | bottom | engine | bridge)
  modelLevelName?: string;// 模型分层名称
  status: '在线' | '离线'; // 基站状态
  recycleStatus: string;  // 基站回收状态（设备安装、临时撤场等）
  location: string;       // 安装位置
  floor?: string;         // 安装楼层
  signalLossTime?: string; // 信号丢失时间
  attenuationCoeff?: string; // 衰减系数
  coverageRange?: string; // 覆盖范围
  auxPositioning: '是' | '否'; // 辅助定位
  lastUpdated?: string;   // 最后更新时间
  ipAddress?: string;     // IP地址
  macAddress?: string;    // MAC地址
  firmwareVersion?: string; // 固件版本
}

// 2. 气体探测器类型
export interface GasDetectorDevice {
  id: string;
  seq: number;
  createdAt: string;       // 创建时间
  sn: string;              // 设备SN
  name: string;            // 设备名称
  associationType?: 'global' | 'project'; // 关联模式: 全厂通用设备 | 造船项目
  projectId?: string;     // 项目ID
  project: string;         // 所属项目或全厂通用
  modelLevel?: string;    // 模型分层
  modelLevelName?: string;// 模型分层名称
  location: string;        // 安装位置
  floor?: string;          // 安装楼层
  gasType?: string;        // 检测气体类型
  alarmThreshold?: string; // 告警阀值
}

// 3. 声光报警器类型
export interface AlarmDevice {
  id: string;
  seq: number;
  createdAt: string;       // 创建时间
  sn: string;              // 设备SN
  name: string;            // 设备名称
  associationType?: 'global' | 'project'; // 关联模式: 全厂通用设备 | 造船项目
  projectId?: string;     // 项目ID
  project: string;         // 所属项目或全厂通用
  modelLevel?: string;    // 模型分层
  modelLevelName?: string;// 模型分层名称
  location: string;        // 安装位置
  floor?: string;          // 安装楼层
  decibel?: string;        // 报警声级dB
}

// 4. 摄像头类型
export interface CameraDevice {
  id: string;
  seq: number;
  code: string;            // 设备编码 (如 test-003)
  name: string;            // 设备名称 (如 香烟识别摄像头)
  modelCategory: string;   // 模型类别 (如 --)
  apiUrl: string;          // API接口
  associationType?: 'global' | 'project'; // 关联模式: 全厂通用设备 | 造船项目
  projectId?: string;     // 项目ID
  project: string;         // 所属项目或全厂通用
  modelLevel?: string;    // 模型分层
  modelLevelName?: string;// 模型分层名称
  createdAt: string;       // 创建时间
  isStreaming: boolean;    // 推流状态 (true: 推流中, false: 停止推流)
  rtspUrl?: string;        // RTSP视频流
}

// 初始数据：主基站
const initialBaseStations: BaseStationDevice[] = [
  {
    id: 'BS-01',
    seq: 1,
    code: '115D6DBC4AD7592E54',
    name: '11（使用中）',
    associationType: 'global',
    projectId: '',
    project: '全厂通用设备',
    modelLevel: 'all',
    modelLevelName: '全厂公共区域',
    status: '在线',
    recycleStatus: '设备安装',
    location: '制造部边跨路口',
    floor: '',
    signalLossTime: '6',
    attenuationCoeff: '19',
    coverageRange: '23m',
    auxPositioning: '是',
    lastUpdated: '2026-08-29 21:19:43',
    ipAddress: '192.168.10.111',
    macAddress: '11:5D:6D:BC:4A:D7',
    firmwareVersion: 'v2.4.12'
  },
  {
    id: 'BS-02',
    seq: 2,
    code: '115D6DBC4AD7593354',
    name: '7',
    associationType: 'project',
    projectId: 'PRJ-2026-LNG01',
    project: '17.4万m³ 薄膜型大型LNG船 1号舰',
    modelLevel: 'bottom',
    modelLevelName: '底舱层 (双层底/压载密闭舱)',
    status: '在线',
    recycleStatus: '设备安装',
    location: '2万吨船台尾段',
    floor: '5',
    signalLossTime: '0',
    attenuationCoeff: '0',
    coverageRange: '50m',
    auxPositioning: '是',
    lastUpdated: '2026-08-29 21:17:38',
    ipAddress: '192.168.10.107',
    macAddress: '11:5D:6D:BC:33:54',
    firmwareVersion: 'v2.4.12'
  },
  {
    id: 'BS-03',
    seq: 3,
    code: '115D6DBC4AD7595354',
    name: '5（使用中）',
    associationType: 'project',
    projectId: 'PRJ-2026-BOX12',
    project: '24,000 TEU 超大型集装箱船',
    modelLevel: 'engine',
    modelLevelName: '机舱动力区 (主机/辅机与管系舱)',
    status: '离线',
    recycleStatus: '设备安装',
    location: '机电仓库',
    floor: '5',
    signalLossTime: '',
    attenuationCoeff: '',
    coverageRange: '',
    auxPositioning: '是',
    lastUpdated: '2026-08-29 21:03:17',
    ipAddress: '192.168.10.105',
    macAddress: '11:5D:6D:BC:53:54',
    firmwareVersion: 'v2.4.10'
  },
  {
    id: 'BS-04',
    seq: 4,
    code: '115D6DBC4AD7595754',
    name: '8',
    associationType: 'global',
    projectId: '',
    project: '全厂通用设备',
    modelLevel: 'all',
    modelLevelName: '全厂公共区域',
    status: '离线',
    recycleStatus: '临时撤场',
    location: '登船口',
    floor: '5',
    signalLossTime: '0',
    attenuationCoeff: '0',
    coverageRange: '50m',
    auxPositioning: '否',
    lastUpdated: '',
    ipAddress: '192.168.10.108',
    macAddress: '11:5D:6D:BC:57:54',
    firmwareVersion: 'v2.4.08'
  },
  {
    id: 'BS-05',
    seq: 5,
    code: '115D6DBC4AD7594A54',
    name: '13',
    associationType: 'project',
    projectId: 'PRJ-2026-TANK02',
    project: '30万吨 VLCC 超大型原油船',
    modelLevel: 'deck',
    modelLevelName: '甲板层 (主甲板/露天作业区)',
    status: '离线',
    recycleStatus: '设备安装',
    location: '4号浮动码头路口',
    floor: '5',
    signalLossTime: '19',
    attenuationCoeff: '19',
    coverageRange: '23m',
    auxPositioning: '是',
    lastUpdated: '2026-08-29 21:09:37',
    ipAddress: '192.168.10.113',
    macAddress: '11:5D:6D:BC:4A:54',
    firmwareVersion: 'v2.4.12'
  },
  {
    id: 'BS-06',
    seq: 6,
    code: '115D6DBC4AD7591752',
    name: '15',
    associationType: 'global',
    projectId: '',
    project: '全厂通用设备',
    status: '在线',
    recycleStatus: '设备安装',
    location: '北区办公楼',
    floor: '5',
    signalLossTime: '19',
    attenuationCoeff: '19',
    coverageRange: '23m',
    auxPositioning: '是',
    lastUpdated: '2026-08-29 21:17:42',
    ipAddress: '192.168.10.115',
    macAddress: '11:5D:6D:BC:17:52',
    firmwareVersion: 'v2.4.12'
  },
  {
    id: 'BS-07',
    seq: 7,
    code: '115D6DBC4AD7595654',
    name: '14',
    associationType: 'project',
    projectId: 'PRJ-2026-LNG01',
    project: '17.4万m³ 薄膜型大型LNG船 1号舰',
    modelLevel: 'middle',
    modelLevelName: '中舱层 (货舱上部/中层平台)',
    status: '在线',
    recycleStatus: '设备安装',
    location: '一号轨道路口',
    floor: '5',
    signalLossTime: '19',
    attenuationCoeff: '19',
    coverageRange: '23m',
    auxPositioning: '是',
    lastUpdated: '2026-08-29 21:21:33',
    ipAddress: '192.168.10.114',
    macAddress: '11:5D:6D:BC:56:54',
    firmwareVersion: 'v2.4.12'
  },
  {
    id: 'BS-08',
    seq: 8,
    code: '115D6DBC4AD7595454',
    name: '16',
    associationType: 'project',
    projectId: 'PRJ-2026-BULK04',
    project: '82,000 DWT 卡姆萨尔型散货船',
    modelLevel: 'bridge',
    modelLevelName: '驾驶台 (上层建筑/驾控生活区)',
    status: '在线',
    recycleStatus: '设备安装',
    location: '露天专焊10T中',
    floor: '5',
    signalLossTime: '19',
    attenuationCoeff: '19',
    coverageRange: '23m',
    auxPositioning: '是',
    lastUpdated: '2026-08-29 21:20:01',
    ipAddress: '192.168.10.116',
    macAddress: '11:5D:6D:BC:54:54',
    firmwareVersion: 'v2.4.11'
  }
];

// 初始数据：气体探测器
const initialGasDetectors: GasDetectorDevice[] = [
  { id: 'GD-01', seq: 1, createdAt: '2026-08-20 14:32:59', sn: '866833080749440', name: '866833080749440', associationType: 'project', projectId: 'PRJ-2026-LNG01', project: '17.4万m³ 薄膜型大型LNG船 1号舰', modelLevel: 'engine', modelLevelName: '机舱动力区 (主机/辅机与管系舱)', location: '517-9号船机舱', floor: '', gasType: '多气体四合一 (O2/CO/H2S/EX)', alarmThreshold: 'O2 < 19.5%' },
  { id: 'GD-02', seq: 2, createdAt: '2026-08-20 14:32:46', sn: '866833080749051', name: '866833080749051', associationType: 'project', projectId: 'PRJ-2026-LNG01', project: '17.4万m³ 薄膜型大型LNG船 1号舰', modelLevel: 'bottom', modelLevelName: '底舱层 (双层底/压载密闭舱)', location: '519-1机舱', floor: '', gasType: '氧气/一氧化碳', alarmThreshold: 'CO > 30ppm' },
  { id: 'GD-03', seq: 3, createdAt: '2026-08-20 14:32:32', sn: '866833080749630', name: '866833080749630', associationType: 'project', projectId: 'PRJ-2026-BOX12', project: '24,000 TEU 超大型集装箱船', modelLevel: 'engine', modelLevelName: '机舱动力区 (主机/辅机与管系舱)', location: '平船台机舱', floor: '', gasType: '硫化氢监测探头', alarmThreshold: 'H2S > 10ppm' },
  { id: 'GD-04', seq: 4, createdAt: '2026-08-20 14:32:17', sn: '866833080748954', name: '866833080748954', associationType: 'global', projectId: '', project: '全厂通用设备', location: '预处理车间', floor: '', gasType: '可燃气体 (EX)', alarmThreshold: 'EX > 20%LEL' },
  { id: 'GD-05', seq: 5, createdAt: '2026-08-20 14:31:56', sn: '866833080749267', name: '866833080749267', associationType: 'project', projectId: 'PRJ-2026-TANK02', project: '30万吨 VLCC 超大型原油船', modelLevel: 'engine', modelLevelName: '机舱动力区 (主机/辅机与管系舱)', location: '628-7机舱', floor: '', gasType: '四合一测气仪', alarmThreshold: '标准防爆设置' },
  { id: 'GD-06', seq: 6, createdAt: '2026-08-20 14:31:41', sn: '866833080749283', name: '866833080749283', associationType: 'project', projectId: 'PRJ-2026-TANK02', project: '30万吨 VLCC 超大型原油船', modelLevel: 'bottom', modelLevelName: '底舱层 (双层底/压载密闭舱)', location: '628-8机舱', floor: '', gasType: '四合一测气仪', alarmThreshold: '标准防爆设置' },
  { id: 'GD-07', seq: 7, createdAt: '2026-08-20 14:31:26', sn: '866833080749689', name: '866833080749689', associationType: 'project', projectId: 'PRJ-2026-LNG01', project: '17.4万m³ 薄膜型大型LNG船 1号舰', modelLevel: 'middle', modelLevelName: '中舱层 (货舱上部/中层平台)', location: '716-10机舱', floor: '', gasType: '氧气检测仪', alarmThreshold: 'O2 < 19.5%' },
  { id: 'GD-08', seq: 8, createdAt: '2026-08-20 14:31:12', sn: '866833080909333', name: '866833080909333', associationType: 'global', projectId: '', project: '全厂通用设备', location: '涂装车间', floor: '', gasType: '一氧化碳检测', alarmThreshold: 'CO > 50ppm' },
  { id: 'GD-09', seq: 9, createdAt: '2026-08-20 14:30:58', sn: '866833080749341', name: '866833080749341', associationType: 'global', projectId: '', project: '全厂通用设备', location: '危化品仓库', floor: '', gasType: '四合一测气仪', alarmThreshold: '标准设置' },
  { id: 'GD-10', seq: 10, createdAt: '2026-08-20 14:30:42', sn: '866833080749317', name: '866833080749317', associationType: 'project', projectId: 'PRJ-2026-BULK04', project: '82,000 DWT 卡姆萨尔型散货船', modelLevel: 'engine', modelLevelName: '机舱动力区 (主机/辅机与管系舱)', location: '14500-3机舱', floor: '', gasType: '硫化氢/VOC', alarmThreshold: 'VOC > 100ppm' }
];

// 初始数据：声光报警器
const initialAlarms: AlarmDevice[] = [
  { id: 'AL-01', seq: 1, createdAt: '2026-08-20 14:35:57', sn: '867655086345884', name: '867655086345884', associationType: 'project', projectId: 'PRJ-2026-LNG01', project: '17.4万m³ 薄膜型大型LNG船 1号舰', modelLevel: 'engine', modelLevelName: '机舱动力区', location: '145-3机舱', floor: '', decibel: '110dB' },
  { id: 'AL-02', seq: 2, createdAt: '2026-08-20 14:35:29', sn: '867655086341883', name: '867655086341883', associationType: 'project', projectId: 'PRJ-2026-LNG01', project: '17.4万m³ 薄膜型大型LNG船 1号舰', modelLevel: 'middle', modelLevelName: '中舱层', location: '519-1机舱', floor: '', decibel: '105dB' },
  { id: 'AL-03', seq: 3, createdAt: '2026-08-20 14:35:17', sn: '867655086341560', name: '867655086341560', associationType: 'project', projectId: 'PRJ-2026-TANK02', project: '30万吨 VLCC 超大型原油船', modelLevel: 'engine', modelLevelName: '机舱动力区', location: '628-7机舱', floor: '', decibel: '110dB' },
  { id: 'AL-04', seq: 4, createdAt: '2026-08-20 14:35:05', sn: '867655085879206', name: '867655085879206', associationType: 'global', projectId: '', project: '全厂通用设备', location: '气瓶集中存放区', floor: '', decibel: '100dB' },
  { id: 'AL-05', seq: 5, createdAt: '2026-08-20 14:34:51', sn: '867655086346148', name: '867655086346148', associationType: 'global', projectId: '', project: '全厂通用设备', location: '配电中心', floor: '', decibel: '115dB (防爆型)' },
  { id: 'AL-06', seq: 6, createdAt: '2026-08-20 14:34:40', sn: '867655086344929', name: '867655086344929', associationType: 'project', projectId: 'PRJ-2026-BOX12', project: '24,000 TEU 超大型集装箱船', modelLevel: 'deck', modelLevelName: '甲板层', location: '716-10机舱', floor: '', decibel: '110dB' },
  { id: 'AL-07', seq: 7, createdAt: '2026-08-20 14:34:27', sn: '867655085878844', name: '867655085878844', associationType: 'project', projectId: 'PRJ-2026-TANK02', project: '30万吨 VLCC 超大型原油船', modelLevel: 'bottom', modelLevelName: '底舱层', location: '628-8机舱', floor: '', decibel: '105dB' },
  { id: 'AL-08', seq: 8, createdAt: '2026-08-20 14:34:14', sn: '867655086346221', name: '867655086346221', associationType: 'project', projectId: 'PRJ-2026-PSV01', project: '75M 动力定位平台供应船 (DP-2)', modelLevel: 'bridge', modelLevelName: '驾驶台', location: '平船台机舱', floor: '', decibel: '110dB' },
  { id: 'AL-09', seq: 9, createdAt: '2026-08-20 14:33:59', sn: '867655086347864', name: '867655086347864', associationType: 'project', projectId: 'PRJ-2026-LNG01', project: '17.4万m³ 薄膜型大型LNG船 1号舰', modelLevel: 'deck', modelLevelName: '甲板层', location: '517-9号船机舱', floor: '', decibel: '110dB' },
  { id: 'AL-10', seq: 10, createdAt: '2026-08-19 14:49:25', sn: '867655086345926', name: '867655086345926', associationType: 'global', projectId: '', project: '全厂通用设备', location: '变电站房', floor: '', decibel: '105dB' }
];

// 初始数据：摄像头
const initialCameras: CameraDevice[] = [
  { id: 'CAM-01', seq: 1, code: 'test-003', name: '香烟识别摄像头', modelCategory: '--', apiUrl: 'http://192.168.205.110:7571', associationType: 'global', projectId: '', project: '全厂通用设备', createdAt: '2026-06-10 16:49:35', isStreaming: true, rtspUrl: 'rtsp://192.168.205.110:554/live/smoke_01' },
  { id: 'CAM-02', seq: 2, code: 'test1006', name: '安全帽识别摄像头', modelCategory: '--', apiUrl: 'http://192.168.205.110:7570', associationType: 'project', projectId: 'PRJ-2026-LNG01', project: '17.4万m³ 薄膜型大型LNG船 1号舰', modelLevel: 'deck', modelLevelName: '甲板层', createdAt: '2026-05-13 13:47:20', isStreaming: true, rtspUrl: 'rtsp://192.168.205.110:554/live/helmet_01' },
  { id: 'CAM-03', seq: 3, code: 'test1005', name: '手机识别摄像头', modelCategory: '--', apiUrl: 'http://192.168.205.110:7572', associationType: 'global', projectId: '', project: '全厂通用设备', createdAt: '2026-05-13 13:47:04', isStreaming: true, rtspUrl: 'rtsp://192.168.205.110:554/live/phone_01' },
  { id: 'CAM-04', seq: 4, code: 'test1008', name: '反光衣未穿戴识别摄像头', modelCategory: '未穿戴防护检测', apiUrl: 'http://192.168.205.110:7573', associationType: 'project', projectId: 'PRJ-2026-BOX12', project: '24,000 TEU 超大型集装箱船', modelLevel: 'middle', modelLevelName: '中舱层', createdAt: '2026-05-10 11:20:15', isStreaming: true, rtspUrl: 'rtsp://192.168.205.110:554/live/vest_01' },
  { id: 'CAM-05', seq: 5, code: 'test1009', name: '烟火违章识别摄像头', modelCategory: '火灾烟雾识别', apiUrl: 'http://192.168.205.110:7574', associationType: 'project', projectId: 'PRJ-2026-TANK02', project: '30万吨 VLCC 超大型原油船', modelLevel: 'bottom', modelLevelName: '底舱层', createdAt: '2026-04-28 09:30:00', isStreaming: false, rtspUrl: 'rtsp://192.168.205.110:554/live/fire_01' }
];

export function DeviceManagement() {
  // 当前激活的设备 Tab 页 (主基站 | 气体探测器 | 声光报警器 | 摄像头)
  const [activeTab, setActiveTab] = useState<DeviceTab>('main_station');

  // 数据列表状态
  const [baseStations, setBaseStations] = useState<BaseStationDevice[]>(initialBaseStations);
  const [gasDetectors, setGasDetectors] = useState<GasDetectorDevice[]>(initialGasDetectors);
  const [alarms, setAlarms] = useState<AlarmDevice[]>(initialAlarms);
  const [cameras, setCameras] = useState<CameraDevice[]>(initialCameras);

  // 1. 搜索条件
  const [searchCode, setSearchCode] = useState<string>('');        // 设备编码/SN/设备名称
  const [selectedProject, setSelectedProject] = useState<string>(''); // 所属项目
  const [selectedModelLevel, setSelectedModelLevel] = useState<string>(''); // 模型分层
  const [startDate, setStartDate] = useState<string>('');          // 开始日期（摄像头专用）
  const [endDate, setEndDate] = useState<string>('');            // 结束日期（摄像头专用）

  // 生效的查询条件
  const [activeQuery, setActiveQuery] = useState({
    code: '',
    project: '',
    modelLevel: '',
    startDate: '',
    endDate: ''
  });

  // 模态框与选中的设备
  const [modalMode, setModalMode] = useState<'create' | 'edit' | 'detail' | 'preview' | null>(null);
  const [selectedDevice, setSelectedDevice] = useState<any>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  // 表单临时编辑状态
  const [formFields, setFormFields] = useState<Record<string, any>>({});

  // 顶部筛选与表单用到的全量项目列表
  const projectOptions = useMemo(() => {
    return [
      '全厂通用设备',
      ...MOCK_PROJECTS.map(p => p.name)
    ];
  }, []);

  // 点击“查询/搜索”
  const handleSearch = () => {
    setActiveQuery({
      code: searchCode.trim(),
      project: selectedProject,
      modelLevel: selectedModelLevel,
      startDate,
      endDate
    });
  };

  // 点击“重置”
  const handleReset = () => {
    setSearchCode('');
    setSelectedProject('');
    setSelectedModelLevel('');
    setStartDate('');
    setEndDate('');
    setActiveQuery({
      code: '',
      project: '',
      modelLevel: '',
      startDate: '',
      endDate: ''
    });
  };

  // 过滤后的主基站数据
  const filteredBaseStations = useMemo(() => {
    return baseStations.filter(d => {
      const matchCode = !activeQuery.code || 
        d.code.toLowerCase().includes(activeQuery.code.toLowerCase()) || 
        d.name.toLowerCase().includes(activeQuery.code.toLowerCase());
      const matchProject = !activeQuery.project || d.project === activeQuery.project || d.projectId === activeQuery.project;
      const matchModelLevel = !activeQuery.modelLevel || d.modelLevel === activeQuery.modelLevel;
      return matchCode && matchProject && matchModelLevel;
    });
  }, [baseStations, activeQuery]);

  // 过滤后的气体探测器数据
  const filteredGasDetectors = useMemo(() => {
    return gasDetectors.filter(d => {
      const matchSn = !activeQuery.code || 
        d.sn.toLowerCase().includes(activeQuery.code.toLowerCase()) || 
        d.name.toLowerCase().includes(activeQuery.code.toLowerCase());
      const matchProject = !activeQuery.project || d.project === activeQuery.project || d.projectId === activeQuery.project;
      const matchModelLevel = !activeQuery.modelLevel || d.modelLevel === activeQuery.modelLevel;
      return matchSn && matchProject && matchModelLevel;
    });
  }, [gasDetectors, activeQuery]);

  // 过滤后的声光报警器数据
  const filteredAlarms = useMemo(() => {
    return alarms.filter(d => {
      const matchSn = !activeQuery.code || 
        d.sn.toLowerCase().includes(activeQuery.code.toLowerCase()) || 
        d.name.toLowerCase().includes(activeQuery.code.toLowerCase());
      const matchProject = !activeQuery.project || d.project === activeQuery.project || d.projectId === activeQuery.project;
      const matchModelLevel = !activeQuery.modelLevel || d.modelLevel === activeQuery.modelLevel;
      return matchSn && matchProject && matchModelLevel;
    });
  }, [alarms, activeQuery]);

  // 过滤后的摄像头数据
  const filteredCameras = useMemo(() => {
    return cameras.filter(d => {
      const matchName = !activeQuery.code || 
        d.name.toLowerCase().includes(activeQuery.code.toLowerCase()) || 
        d.code.toLowerCase().includes(activeQuery.code.toLowerCase());
      const matchProject = !activeQuery.project || d.project === activeQuery.project || d.projectId === activeQuery.project;
      const matchModelLevel = !activeQuery.modelLevel || d.modelLevel === activeQuery.modelLevel;
      let matchDate = true;
      if (activeQuery.startDate && d.createdAt < activeQuery.startDate) matchDate = false;
      if (activeQuery.endDate && d.createdAt > activeQuery.endDate + ' 23:59:59') matchDate = false;
      return matchName && matchProject && matchModelLevel && matchDate;
    });
  }, [cameras, activeQuery]);

  // 切换分类 Tab
  const handleTabChange = (tab: DeviceTab) => {
    setActiveTab(tab);
    handleReset();
  };

  // 切换推流状态
  const toggleCameraStreaming = (camId: string) => {
    setCameras(prev => prev.map(c => c.id === camId ? { ...c, isStreaming: !c.isStreaming } : c));
  };

  // 打开新增模态框
  const handleOpenCreate = () => {
    const timeStr = new Date().toISOString().replace('T', ' ').substring(0, 19);
    const defaultAssociation = 'global';
    const defaultProj = '全厂通用设备';

    if (activeTab === 'main_station') {
      const randomHex = Math.random().toString(16).substring(2, 8).toUpperCase();
      setFormFields({
        code: `115D6DBC4AD7${randomHex}`,
        name: `${baseStations.length + 1}`,
        associationType: defaultAssociation,
        projectId: '',
        project: defaultProj,
        modelLevel: 'deck',
        modelLevelName: MODEL_LAYER_OPTIONS[0].fullName,
        status: '在线',
        recycleStatus: '设备安装',
        location: '制造部边跨路口',
        floor: '5',
        signalLossTime: '0',
        attenuationCoeff: '19',
        coverageRange: '23m',
        auxPositioning: '是'
      });
    } else if (activeTab === 'gas_detector') {
      const randomSn = '866833080' + Math.floor(100050 + Math.random() * 899900);
      setFormFields({
        createdAt: timeStr,
        sn: randomSn,
        name: randomSn,
        associationType: defaultAssociation,
        projectId: '',
        project: defaultProj,
        modelLevel: 'deck',
        modelLevelName: MODEL_LAYER_OPTIONS[0].fullName,
        location: '517-9号船机舱',
        floor: '',
        gasType: '多气体四合一 (O2/CO/H2S/EX)',
        alarmThreshold: 'O2 < 19.5%'
      });
    } else if (activeTab === 'alarm') {
      const randomSn = '867655086' + Math.floor(100050 + Math.random() * 899900);
      setFormFields({
        createdAt: timeStr,
        sn: randomSn,
        name: randomSn,
        associationType: defaultAssociation,
        projectId: '',
        project: defaultProj,
        modelLevel: 'deck',
        modelLevelName: MODEL_LAYER_OPTIONS[0].fullName,
        location: '145-3机舱',
        floor: '',
        decibel: '110dB'
      });
    } else if (activeTab === 'camera') {
      setFormFields({
        code: `test${1000 + cameras.length + 1}`,
        name: '未穿戴安全帽识别摄像头',
        modelCategory: '--',
        apiUrl: `http://192.168.205.110:${7570 + cameras.length}`,
        associationType: defaultAssociation,
        projectId: '',
        project: defaultProj,
        modelLevel: 'deck',
        modelLevelName: MODEL_LAYER_OPTIONS[0].fullName,
        createdAt: timeStr,
        isStreaming: true,
        rtspUrl: `rtsp://192.168.205.110:554/live/cam_${cameras.length + 1}`
      });
    }
    setModalMode('create');
  };

  // 打开编辑模态框
  const handleOpenEdit = (item: any) => {
    setSelectedDevice(item);
    const isGlobal = item.associationType === 'global' || item.project === '全厂通用设备';
    const targetPrjId = item.projectId || (MOCK_PROJECTS.find(p => p.name === item.project)?.id || MOCK_PROJECTS[0].id);
    const targetPrjName = item.project || (isGlobal ? '全厂通用设备' : MOCK_PROJECTS[0].name);

    setFormFields({
      ...item,
      associationType: isGlobal ? 'global' : 'project',
      projectId: isGlobal ? '' : targetPrjId,
      project: targetPrjName,
      modelLevel: item.modelLevel || 'deck',
      modelLevelName: item.modelLevelName || getLayerOption(item.modelLevel)?.fullName || MODEL_LAYER_OPTIONS[0].fullName
    });
    setModalMode('edit');
  };

  // 打开详情模态框
  const handleOpenDetail = (item: any) => {
    setSelectedDevice(item);
    setModalMode('detail');
  };

  // 保存新增或修改
  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    
    // 计算最终关联模式与造船项目
    const assocType = formFields.associationType || (formFields.project === '全厂通用设备' ? 'global' : 'project');
    const isGlobal = assocType === 'global';

    let finalProjectId = '';
    let finalProjectName = '全厂通用设备';
    let finalModelLevel = 'all';
    let finalModelLevelName = '全厂公共区域';

    if (!isGlobal) {
      const selectedPrj = MOCK_PROJECTS.find(p => p.id === formFields.projectId) || 
                          MOCK_PROJECTS.find(p => p.name === formFields.project) || 
                          MOCK_PROJECTS[0];
      finalProjectId = selectedPrj.id;
      finalProjectName = selectedPrj.name;

      const layerOpt = getLayerOption(formFields.modelLevel) || MODEL_LAYER_OPTIONS[0];
      finalModelLevel = layerOpt.id;
      finalModelLevelName = layerOpt.fullName;
    }

    if (activeTab === 'main_station') {
      if (modalMode === 'create') {
        const newItem: BaseStationDevice = {
          id: `BS-${Date.now().toString().slice(-4)}`,
          seq: baseStations.length + 1,
          code: formFields.code || '',
          name: formFields.name || '',
          associationType: assocType,
          projectId: finalProjectId,
          project: finalProjectName,
          modelLevel: finalModelLevel,
          modelLevelName: finalModelLevelName,
          status: formFields.status || '在线',
          recycleStatus: formFields.recycleStatus || '设备安装',
          location: formFields.location || '厂区路口',
          floor: formFields.floor || '',
          signalLossTime: formFields.signalLossTime || '0',
          attenuationCoeff: formFields.attenuationCoeff || '19',
          coverageRange: formFields.coverageRange || '23m',
          auxPositioning: formFields.auxPositioning || '是',
          lastUpdated: new Date().toISOString().replace('T', ' ').substring(0, 19),
          ipAddress: `192.168.10.${100 + baseStations.length}`,
          macAddress: `11:5D:6D:BC:${Math.floor(10+Math.random()*89)}:${Math.floor(10+Math.random()*89)}`,
          firmwareVersion: 'v2.4.12'
        };
        setBaseStations([newItem, ...baseStations]);
      } else if (modalMode === 'edit' && selectedDevice) {
        setBaseStations(prev => prev.map(d => d.id === selectedDevice.id ? { 
          ...d, 
          ...formFields, 
          associationType: assocType, 
          projectId: finalProjectId,
          project: finalProjectName,
          modelLevel: finalModelLevel,
          modelLevelName: finalModelLevelName
        } : d));
      }
    } else if (activeTab === 'gas_detector') {
      if (modalMode === 'create') {
        const newItem: GasDetectorDevice = {
          id: `GD-${Date.now().toString().slice(-4)}`,
          seq: gasDetectors.length + 1,
          createdAt: formFields.createdAt || new Date().toISOString().replace('T', ' ').substring(0, 19),
          sn: formFields.sn || '',
          name: formFields.name || formFields.sn || '',
          associationType: assocType,
          projectId: finalProjectId,
          project: finalProjectName,
          modelLevel: finalModelLevel,
          modelLevelName: finalModelLevelName,
          location: formFields.location || '',
          floor: formFields.floor || '',
          gasType: formFields.gasType || '四合一测气仪',
          alarmThreshold: formFields.alarmThreshold || '标准设置'
        };
        setGasDetectors([newItem, ...gasDetectors]);
      } else if (modalMode === 'edit' && selectedDevice) {
        setGasDetectors(prev => prev.map(d => d.id === selectedDevice.id ? { 
          ...d, 
          ...formFields, 
          associationType: assocType, 
          projectId: finalProjectId,
          project: finalProjectName,
          modelLevel: finalModelLevel,
          modelLevelName: finalModelLevelName
        } : d));
      }
    } else if (activeTab === 'alarm') {
      if (modalMode === 'create') {
        const newItem: AlarmDevice = {
          id: `AL-${Date.now().toString().slice(-4)}`,
          seq: alarms.length + 1,
          createdAt: formFields.createdAt || new Date().toISOString().replace('T', ' ').substring(0, 19),
          sn: formFields.sn || '',
          name: formFields.name || formFields.sn || '',
          associationType: assocType,
          projectId: finalProjectId,
          project: finalProjectName,
          modelLevel: finalModelLevel,
          modelLevelName: finalModelLevelName,
          location: formFields.location || '',
          floor: formFields.floor || '',
          decibel: formFields.decibel || '110dB'
        };
        setAlarms([newItem, ...alarms]);
      } else if (modalMode === 'edit' && selectedDevice) {
        setAlarms(prev => prev.map(d => d.id === selectedDevice.id ? { 
          ...d, 
          ...formFields, 
          associationType: assocType, 
          projectId: finalProjectId,
          project: finalProjectName,
          modelLevel: finalModelLevel,
          modelLevelName: finalModelLevelName
        } : d));
      }
    } else if (activeTab === 'camera') {
      if (modalMode === 'create') {
        const newItem: CameraDevice = {
          id: `CAM-${Date.now().toString().slice(-4)}`,
          seq: cameras.length + 1,
          code: formFields.code || '',
          name: formFields.name || '',
          modelCategory: formFields.modelCategory || '--',
          apiUrl: formFields.apiUrl || '',
          associationType: assocType,
          projectId: finalProjectId,
          project: finalProjectName,
          modelLevel: finalModelLevel,
          modelLevelName: finalModelLevelName,
          createdAt: formFields.createdAt || new Date().toISOString().replace('T', ' ').substring(0, 19),
          isStreaming: formFields.isStreaming !== undefined ? formFields.isStreaming : true,
          rtspUrl: formFields.rtspUrl || ''
        };
        setCameras([newItem, ...cameras]);
      } else if (modalMode === 'edit' && selectedDevice) {
        setCameras(prev => prev.map(d => d.id === selectedDevice.id ? { 
          ...d, 
          ...formFields, 
          associationType: assocType, 
          projectId: finalProjectId,
          project: finalProjectName,
          modelLevel: finalModelLevel,
          modelLevelName: finalModelLevelName
        } : d));
      }
    }
    setModalMode(null);
    setSelectedDevice(null);
  };

  // 执行删除操作
  const confirmDelete = () => {
    if (!deleteTargetId) return;
    if (activeTab === 'gas_detector') {
      setGasDetectors(prev => prev.filter(d => d.id !== deleteTargetId));
    } else if (activeTab === 'alarm') {
      setAlarms(prev => prev.filter(d => d.id !== deleteTargetId));
    } else if (activeTab === 'camera') {
      setCameras(prev => prev.filter(d => d.id !== deleteTargetId));
    } else if (activeTab === 'main_station') {
      setBaseStations(prev => prev.filter(d => d.id !== deleteTargetId));
    }
    setDeleteTargetId(null);
    setModalMode(null);
    setSelectedDevice(null);
  };

  // 表格单元格渲染器：项目与 3D BIM 模型分层信息
  const renderProjectAndLayerCell = (device: {
    associationType?: 'global' | 'project';
    projectId?: string;
    project: string;
    modelLevel?: string;
    modelLevelName?: string;
  }) => {
    const isGlobal = device.associationType === 'global' || device.project === '全厂通用设备';
    if (isGlobal) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-purple-50 text-purple-700 border border-purple-200 shadow-2xs">
          <span className="w-1.5 h-1.5 rounded-full bg-purple-500"></span>
          🏢 全厂通用设备
        </span>
      );
    }

    const layer = getLayerOption(device.modelLevel);

    return (
      <div className="flex flex-col items-center justify-center gap-1 py-0.5">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[11px] font-medium bg-sky-50/90 text-sky-800 border border-sky-200/90 max-w-[220px]" title={`${device.projectId ? '[' + device.projectId + '] ' : ''}${device.project}`}>
          <Ship className="w-3.5 h-3.5 text-sky-600 shrink-0" />
          {device.projectId && (
            <span className="font-mono text-sky-700 font-bold text-[10px] bg-sky-100/80 px-1 py-0.2 rounded">
              {device.projectId}
            </span>
          )}
          <span className="truncate">{device.project}</span>
        </div>
        
        {layer ? (
          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold border ${layer.badgeBg} ${layer.badgeText} ${layer.badgeBorder}`}>
            <Layers className="w-3 h-3 shrink-0" />
            <span>{layer.name}</span>
          </span>
        ) : device.modelLevelName ? (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
            <Layers className="w-3 h-3" />
            <span>{device.modelLevelName}</span>
          </span>
        ) : null}
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-3 h-full bg-slate-50/50 p-1 font-sans text-slate-800">
      
      {/* 1. 顶部设备类型 Tab 切换栏 */}
      <div className="bg-white border border-slate-200/90 rounded-lg px-4 shadow-2xs flex items-center">
        <div className="flex items-center gap-8 border-b-0 text-sm font-medium">
          {/* 选项卡 1: 主基站 */}
          <button
            onClick={() => handleTabChange('main_station')}
            className={`py-3 px-1.5 border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'main_station'
                ? 'border-blue-600 text-blue-600 font-bold'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>主基站</span>
          </button>

          {/* 选项卡 2: 气体探测器 */}
          <button
            onClick={() => handleTabChange('gas_detector')}
            className={`py-3 px-1.5 border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'gas_detector'
                ? 'border-blue-600 text-blue-600 font-bold'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>气体探测器</span>
          </button>

          {/* 选项卡 3: 声光报警器 */}
          <button
            onClick={() => handleTabChange('alarm')}
            className={`py-3 px-1.5 border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'alarm'
                ? 'border-blue-600 text-blue-600 font-bold'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>声光报警器</span>
          </button>

          {/* 选项卡 4: 摄像头 */}
          <button
            onClick={() => handleTabChange('camera')}
            className={`py-3 px-1.5 border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'camera'
                ? 'border-blue-600 text-blue-600 font-bold'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>摄像头</span>
          </button>
        </div>
      </div>

      {/* 2. 顶部查询与筛选面板 */}
      <div className="bg-white border border-slate-200/90 rounded-lg p-3.5 shadow-2xs flex flex-wrap items-center gap-4 justify-between">
        <div className="flex flex-wrap items-center gap-5 text-xs text-slate-700">
          
          {/* 条件 1：编码/SN/设备名称 */}
          <div className="flex items-center gap-2">
            <span className="text-slate-600 font-medium whitespace-nowrap">
              {activeTab === 'main_station' && '设备编码'}
              {activeTab === 'gas_detector' && '设备SN'}
              {activeTab === 'alarm' && '设备SN'}
              {activeTab === 'camera' && '设备名称'}
            </span>
            <input 
              type="text" 
              value={searchCode}
              onChange={(e) => setSearchCode(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder={
                activeTab === 'main_station' ? '请输入设备编码' :
                activeTab === 'gas_detector' ? '请输入设备SN' :
                activeTab === 'alarm' ? '请输入设备SN' : '请输入设备名称'
              }
              className="w-48 px-3 py-1.5 border border-slate-300 rounded text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white transition-all"
            />
          </div>

          {/* 条件 2：所属项目 */}
          <div className="flex items-center gap-2">
            <span className="text-slate-600 font-medium whitespace-nowrap">所属项目</span>
            <select
              value={selectedProject}
              onChange={(e) => setSelectedProject(e.target.value)}
              className="w-48 px-3 py-1.5 border border-slate-300 rounded text-xs text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white transition-all cursor-pointer"
            >
              <option value="">全部造船项目</option>
              {projectOptions.map(p => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>

          {/* 条件 3：模型分层（新增精准分层筛选） */}
          <div className="flex items-center gap-2">
            <span className="text-slate-600 font-medium whitespace-nowrap">模型分层</span>
            <select
              value={selectedModelLevel}
              onChange={(e) => setSelectedModelLevel(e.target.value)}
              className="w-48 px-3 py-1.5 border border-slate-300 rounded text-xs text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white transition-all cursor-pointer"
            >
              <option value="">全部模型分层</option>
              {MODEL_LAYER_OPTIONS.map(l => (
                <option key={l.id} value={l.id}>
                  📐 {l.fullName}
                </option>
              ))}
            </select>
          </div>

          {/* 条件 4：创建时间（摄像头Tab专属） */}
          {activeTab === 'camera' && (
            <div className="flex items-center gap-2">
              <span className="text-slate-600 font-medium whitespace-nowrap">创建时间</span>
              <div className="flex items-center border border-slate-300 rounded px-2 py-1 bg-white focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500">
                <Calendar className="w-3.5 h-3.5 text-slate-400 mr-1.5" />
                <input 
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="text-xs text-slate-700 outline-none bg-transparent w-28"
                  placeholder="开始日期"
                />
                <span className="mx-1 text-slate-400">-</span>
                <input 
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="text-xs text-slate-700 outline-none bg-transparent w-28"
                  placeholder="结束日期"
                />
              </div>
            </div>
          )}

          {/* 按钮组 */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={handleSearch}
              className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-medium rounded text-xs transition-colors flex items-center gap-1.5 shadow-2xs cursor-pointer"
            >
              <Search className="w-3.5 h-3.5" />
              <span>查询</span>
            </button>

            <button
              onClick={handleReset}
              className="px-4 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-medium rounded text-xs transition-colors flex items-center gap-1.5 shadow-2xs cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
              <span>重置</span>
            </button>
          </div>
        </div>
      </div>

      {/* 3. 操作与新增区域 */}
      <div className="bg-white border border-slate-200/90 rounded-lg p-2.5 px-3.5 shadow-2xs flex justify-between items-center">
        <button
          onClick={handleOpenCreate}
          className="px-3.5 py-1.5 bg-blue-50/80 hover:bg-blue-100/90 text-blue-600 border border-blue-200/80 rounded font-medium text-xs transition-colors flex items-center gap-1.5 shadow-2xs cursor-pointer"
        >
          <Plus className="w-4 h-4 text-blue-600 stroke-[2.5]" />
          <span>新增设备</span>
        </button>

        <div className="text-[11px] text-slate-500 font-mono flex items-center gap-4">
          <span>
            共找到 <strong className="text-blue-600 font-bold">
              {activeTab === 'main_station' && filteredBaseStations.length}
              {activeTab === 'gas_detector' && filteredGasDetectors.length}
              {activeTab === 'alarm' && filteredAlarms.length}
              {activeTab === 'camera' && filteredCameras.length}
            </strong> 台设备
          </span>
          {activeTab === 'main_station' && (
            <>
              <span className="hidden sm:inline">|</span>
              <span className="hidden sm:inline flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span>
                在线: {filteredBaseStations.filter(d => d.status === '在线').length}
              </span>
              <span className="hidden sm:inline flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-rose-500 inline-block"></span>
                离线: {filteredBaseStations.filter(d => d.status === '离线').length}
              </span>
            </>
          )}
          {activeTab === 'camera' && (
            <>
              <span className="hidden sm:inline">|</span>
              <span className="hidden sm:inline flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span>
                推流中: {filteredCameras.filter(d => d.isStreaming).length}
              </span>
            </>
          )}
        </div>
      </div>

      {/* 4. 数据表格区域 */}
      <div className="bg-white border border-slate-200/90 rounded-lg shadow-2xs overflow-hidden flex-1 flex flex-col min-h-0">
        <div className="overflow-x-auto flex-1 scrollbar-thin scrollbar-thumb-slate-300">
          
          {/* TAB 1: 主基站表格 */}
          {activeTab === 'main_station' && (
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-slate-50/90 text-slate-600 border-b border-slate-200 sticky top-0 z-10 font-medium">
                <tr>
                  <th className="py-2.5 px-2 text-center whitespace-nowrap w-12 border-r border-slate-100">序号</th>
                  <th className="py-2.5 px-3 text-center whitespace-nowrap border-r border-slate-100">基站编码</th>
                  <th className="py-2.5 px-3 text-center whitespace-nowrap border-r border-slate-100">基站名称</th>
                  <th className="py-2.5 px-4 text-center whitespace-nowrap border-r border-slate-100 min-w-[180px]">关联项目 / 船型分层</th>
                  <th className="py-2.5 px-3 text-center whitespace-nowrap border-r border-slate-100">基站状态</th>
                  <th className="py-2.5 px-3 text-center whitespace-nowrap border-r border-slate-100">回收状态</th>
                  <th className="py-2.5 px-3 text-center whitespace-nowrap border-r border-slate-100">安装位置</th>
                  <th className="py-2.5 px-3 text-center whitespace-nowrap border-r border-slate-100">安装楼层</th>
                  <th className="py-2.5 px-3 text-center whitespace-nowrap border-r border-slate-100">覆盖范围</th>
                  <th className="py-2.5 px-3 text-center whitespace-nowrap border-r border-slate-100">辅助定位</th>
                  <th className="py-2.5 px-3 text-center whitespace-nowrap border-r border-slate-100">最后更新</th>
                  <th className="py-2.5 px-3 text-center whitespace-nowrap min-w-[120px]">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700 bg-white">
                {filteredBaseStations.length === 0 ? (
                  <tr>
                    <td colSpan={12} className="py-12 text-center text-slate-400">
                      暂无符合条件的主基站设备记录
                    </td>
                  </tr>
                ) : (
                  filteredBaseStations.map((device, idx) => (
                    <tr key={device.id} className="hover:bg-blue-50/30 transition-colors">
                      <td className="py-2.5 px-2 text-center text-slate-500 font-mono text-[11px] border-r border-slate-50">{idx + 1}</td>
                      <td className="py-2.5 px-3 text-center font-mono text-slate-800 text-[11px] whitespace-nowrap border-r border-slate-50">{device.code}</td>
                      <td className="py-2.5 px-3 text-center text-slate-800 font-medium whitespace-nowrap border-r border-slate-50">{device.name}</td>
                      <td className="py-2.5 px-3 text-center border-r border-slate-50">
                        {renderProjectAndLayerCell(device)}
                      </td>
                      <td className="py-2.5 px-3 text-center whitespace-nowrap border-r border-slate-50">
                        {device.status === '在线' ? (
                          <span className="text-emerald-600 font-bold text-[11px] bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">在线</span>
                        ) : (
                          <span className="text-rose-600 font-bold text-[11px] bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-full">离线</span>
                        )}
                      </td>
                      <td className="py-2.5 px-3 text-center text-slate-700 whitespace-nowrap border-r border-slate-50">{device.recycleStatus}</td>
                      <td className="py-2.5 px-3 text-center text-slate-800 whitespace-nowrap border-r border-slate-50">{device.location}</td>
                      <td className="py-2.5 px-3 text-center font-mono text-slate-600 text-[11px] border-r border-slate-50">{device.floor || '-'}</td>
                      <td className="py-2.5 px-3 text-center font-mono text-slate-600 text-[11px] border-r border-slate-50">{device.coverageRange || '-'}</td>
                      <td className="py-2.5 px-3 text-center text-slate-700 whitespace-nowrap border-r border-slate-50">{device.auxPositioning}</td>
                      <td className="py-2.5 px-3 text-center font-mono text-slate-500 text-[11px] whitespace-nowrap border-r border-slate-50">{device.lastUpdated || '-'}</td>
                      <td className="py-2.5 px-3 text-center whitespace-nowrap">
                        <div className="flex items-center justify-center gap-2">
                          <button onClick={() => handleOpenDetail(device)} className="text-sky-600 hover:text-sky-800 font-medium hover:underline text-[11px] cursor-pointer">查看</button>
                          <button onClick={() => handleOpenEdit(device)} className="text-sky-600 hover:text-sky-800 font-medium hover:underline text-[11px] cursor-pointer">编辑</button>
                          <button onClick={() => setDeleteTargetId(device.id)} className="text-rose-500 hover:text-rose-700 font-medium hover:underline text-[11px] cursor-pointer">删除</button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}

          {/* TAB 2: 气体探测器表格 */}
          {activeTab === 'gas_detector' && (
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-slate-50/90 text-slate-600 border-b border-slate-200 sticky top-0 z-10 font-medium">
                <tr>
                  <th className="py-2.5 px-2 text-center whitespace-nowrap w-12 border-r border-slate-100">序号</th>
                  <th className="py-2.5 px-4 text-center whitespace-nowrap border-r border-slate-100">创建时间</th>
                  <th className="py-2.5 px-4 text-center whitespace-nowrap border-r border-slate-100">设备SN</th>
                  <th className="py-2.5 px-4 text-center whitespace-nowrap border-r border-slate-100 min-w-[180px]">关联项目 / 船型分层</th>
                  <th className="py-2.5 px-4 text-center whitespace-nowrap border-r border-slate-100">安装位置</th>
                  <th className="py-2.5 px-4 text-center whitespace-nowrap border-r border-slate-100">气体检测类型</th>
                  <th className="py-2.5 px-4 text-center whitespace-nowrap border-r border-slate-100">告警阀值</th>
                  <th className="py-2.5 px-4 text-center whitespace-nowrap min-w-[140px]">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700 bg-white">
                {filteredGasDetectors.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-slate-400">
                      暂无气体探测器数据记录
                    </td>
                  </tr>
                ) : (
                  filteredGasDetectors.map((device, idx) => (
                    <tr key={device.id} className="hover:bg-blue-50/30 transition-colors">
                      <td className="py-2.5 px-2 text-center text-slate-500 font-mono text-[11px] border-r border-slate-50">{idx + 1}</td>
                      <td className="py-2.5 px-4 text-center font-mono text-slate-600 text-[11px] whitespace-nowrap border-r border-slate-50">{device.createdAt}</td>
                      <td className="py-2.5 px-4 text-center font-mono text-slate-800 text-[11px] whitespace-nowrap border-r border-slate-50">{device.sn}</td>
                      <td className="py-2.5 px-4 text-center border-r border-slate-50">
                        {renderProjectAndLayerCell(device)}
                      </td>
                      <td className="py-2.5 px-4 text-center text-slate-800 whitespace-nowrap border-r border-slate-50">{device.location}</td>
                      <td className="py-2.5 px-4 text-center text-amber-700 font-semibold whitespace-nowrap border-r border-slate-50">{device.gasType}</td>
                      <td className="py-2.5 px-4 text-center font-mono text-slate-700 text-[11px] border-r border-slate-50">{device.alarmThreshold}</td>
                      <td className="py-2.5 px-4 text-center whitespace-nowrap">
                        <div className="flex items-center justify-center gap-2.5">
                          <button onClick={() => handleOpenDetail(device)} className="text-sky-600 hover:text-sky-800 font-medium hover:underline text-[11px] cursor-pointer">查看</button>
                          <button onClick={() => handleOpenEdit(device)} className="text-sky-600 hover:text-sky-800 font-medium hover:underline text-[11px] cursor-pointer">编辑</button>
                          <button onClick={() => setDeleteTargetId(device.id)} className="text-rose-500 hover:text-rose-700 font-medium hover:underline text-[11px] cursor-pointer">删除</button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}

          {/* TAB 3: 声光报警器表格 */}
          {activeTab === 'alarm' && (
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-slate-50/90 text-slate-600 border-b border-slate-200 sticky top-0 z-10 font-medium">
                <tr>
                  <th className="py-2.5 px-2 text-center whitespace-nowrap w-12 border-r border-slate-100">序号</th>
                  <th className="py-2.5 px-4 text-center whitespace-nowrap border-r border-slate-100">创建时间</th>
                  <th className="py-2.5 px-4 text-center whitespace-nowrap border-r border-slate-100">设备SN</th>
                  <th className="py-2.5 px-4 text-center whitespace-nowrap border-r border-slate-100 min-w-[180px]">关联项目 / 船型分层</th>
                  <th className="py-2.5 px-4 text-center whitespace-nowrap border-r border-slate-100">安装位置</th>
                  <th className="py-2.5 px-4 text-center whitespace-nowrap border-r border-slate-100">报警声级 (dB)</th>
                  <th className="py-2.5 px-4 text-center whitespace-nowrap min-w-[140px]">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700 bg-white">
                {filteredAlarms.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-slate-400">
                      暂无声光报警器数据记录
                    </td>
                  </tr>
                ) : (
                  filteredAlarms.map((device, idx) => (
                    <tr key={device.id} className="hover:bg-blue-50/30 transition-colors">
                      <td className="py-2.5 px-2 text-center text-slate-500 font-mono text-[11px] border-r border-slate-50">{idx + 1}</td>
                      <td className="py-2.5 px-4 text-center font-mono text-slate-600 text-[11px] whitespace-nowrap border-r border-slate-50">{device.createdAt}</td>
                      <td className="py-2.5 px-4 text-center font-mono text-slate-800 text-[11px] whitespace-nowrap border-r border-slate-50">{device.sn}</td>
                      <td className="py-2.5 px-4 text-center border-r border-slate-50">
                        {renderProjectAndLayerCell(device)}
                      </td>
                      <td className="py-2.5 px-4 text-center text-slate-800 whitespace-nowrap border-r border-slate-50">{device.location}</td>
                      <td className="py-2.5 px-4 text-center font-mono text-rose-600 font-bold text-[11px] border-r border-slate-50">{device.decibel || '110dB'}</td>
                      <td className="py-2.5 px-4 text-center whitespace-nowrap">
                        <div className="flex items-center justify-center gap-2.5">
                          <button onClick={() => handleOpenDetail(device)} className="text-sky-600 hover:text-sky-800 font-medium hover:underline text-[11px] cursor-pointer">查看</button>
                          <button onClick={() => handleOpenEdit(device)} className="text-sky-600 hover:text-sky-800 font-medium hover:underline text-[11px] cursor-pointer">编辑</button>
                          <button onClick={() => setDeleteTargetId(device.id)} className="text-rose-500 hover:text-rose-700 font-medium hover:underline text-[11px] cursor-pointer">删除</button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}

          {/* TAB 4: 摄像头表格 */}
          {activeTab === 'camera' && (
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-slate-50/90 text-slate-600 border-b border-slate-200 sticky top-0 z-10 font-medium">
                <tr>
                  <th className="py-2.5 px-2 text-center whitespace-nowrap w-12 border-r border-slate-100">序号</th>
                  <th className="py-2.5 px-3 text-center whitespace-nowrap border-r border-slate-100">设备编码</th>
                  <th className="py-2.5 px-4 text-center whitespace-nowrap border-r border-slate-100">设备名称</th>
                  <th className="py-2.5 px-3 text-center whitespace-nowrap border-r border-slate-100">AI模型类别</th>
                  <th className="py-2.5 px-4 text-center whitespace-nowrap border-r border-slate-100 min-w-[180px]">关联项目 / 船型分层</th>
                  <th className="py-2.5 px-4 text-center whitespace-nowrap border-r border-slate-100">API接口</th>
                  <th className="py-2.5 px-4 text-center whitespace-nowrap border-r border-slate-100">创建时间</th>
                  <th className="py-2.5 px-4 text-center whitespace-nowrap min-w-[200px]">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700 bg-white">
                {filteredCameras.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-slate-400">
                      暂无摄像头设备记录
                    </td>
                  </tr>
                ) : (
                  filteredCameras.map((device, idx) => (
                    <tr key={device.id} className="hover:bg-blue-50/30 transition-colors">
                      <td className="py-2.5 px-2 text-center text-slate-500 font-mono text-[11px] border-r border-slate-50">{idx + 1}</td>
                      <td className="py-2.5 px-3 text-center font-mono text-slate-800 text-[11px] whitespace-nowrap border-r border-slate-50">{device.code}</td>
                      <td className="py-2.5 px-4 text-center text-slate-800 font-medium whitespace-nowrap border-r border-slate-50">{device.name}</td>
                      <td className="py-2.5 px-3 text-center text-slate-600 font-mono text-[11px] whitespace-nowrap border-r border-slate-50">{device.modelCategory}</td>
                      <td className="py-2.5 px-4 text-center border-r border-slate-50">
                        {renderProjectAndLayerCell(device)}
                      </td>
                      <td className="py-2.5 px-4 text-center font-mono text-sky-700 text-[11px] whitespace-nowrap border-r border-slate-50">{device.apiUrl}</td>
                      <td className="py-2.5 px-4 text-center font-mono text-slate-600 text-[11px] whitespace-nowrap border-r border-slate-50">{device.createdAt}</td>
                      <td className="py-2.5 px-4 text-center whitespace-nowrap">
                        <div className="flex items-center justify-center gap-2">
                          <button onClick={() => { setSelectedDevice(device); setModalMode('preview'); }} className="text-sky-600 hover:text-sky-800 font-medium hover:underline text-[11px] cursor-pointer">画面</button>
                          <button 
                            onClick={() => toggleCameraStreaming(device.id)} 
                            className={`${device.isStreaming ? 'text-amber-500 hover:text-amber-600' : 'text-emerald-600 hover:text-emerald-700'} font-medium hover:underline text-[11px] cursor-pointer`}
                          >
                            {device.isStreaming ? '停止推流' : '开启推流'}
                          </button>
                          <button onClick={() => handleOpenEdit(device)} className="text-sky-600 hover:text-sky-800 font-medium hover:underline text-[11px] cursor-pointer">编辑</button>
                          <button onClick={() => handleOpenDetail(device)} className="text-sky-600 hover:text-sky-800 font-medium hover:underline text-[11px] cursor-pointer">详情</button>
                          <button onClick={() => setDeleteTargetId(device.id)} className="text-rose-500 hover:text-rose-700 font-medium hover:underline text-[11px] cursor-pointer">删除</button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}

        </div>

        {/* 底部页码统计 */}
        <div className="px-4 py-2 bg-slate-50 border-t border-slate-200 text-xs text-slate-500 flex justify-between items-center shrink-0">
          <span>
            显示 1 到 {
              activeTab === 'main_station' ? filteredBaseStations.length :
              activeTab === 'gas_detector' ? filteredGasDetectors.length :
              activeTab === 'alarm' ? filteredAlarms.length : filteredCameras.length
            } 条，共 {
              activeTab === 'main_station' ? filteredBaseStations.length :
              activeTab === 'gas_detector' ? filteredGasDetectors.length :
              activeTab === 'alarm' ? filteredAlarms.length : filteredCameras.length
            } 条设备数据
          </span>
          <div className="flex items-center gap-1 text-[11px]">
            <button className="px-2 py-1 bg-white border border-slate-200 rounded text-slate-400 cursor-not-allowed">上一页</button>
            <button className="px-2.5 py-1 bg-blue-600 text-white rounded font-bold">1</button>
            <button className="px-2 py-1 bg-white border border-slate-200 rounded text-slate-400 cursor-not-allowed">下一页</button>
          </div>
        </div>
      </div>

      {/* 5. 新增 / 编辑 模态框 (包含造船项目及 3D BIM 模型分层关联配置) */}
      {(modalMode === 'create' || modalMode === 'edit') && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-xl overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="px-5 py-3.5 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
              <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                {activeTab === 'main_station' && <Radio className="w-4 h-4 text-blue-600" />}
                {activeTab === 'gas_detector' && <Flame className="w-4 h-4 text-amber-500" />}
                {activeTab === 'alarm' && <Volume2 className="w-4 h-4 text-rose-500" />}
                {activeTab === 'camera' && <Video className="w-4 h-4 text-sky-600" />}
                <span>
                  {modalMode === 'create' ? `新增${
                    activeTab === 'main_station' ? '主基站设备' :
                    activeTab === 'gas_detector' ? '气体探测器' :
                    activeTab === 'alarm' ? '声光报警器' : '识别摄像头'
                  }` : `编辑设备参数：${formFields.code || formFields.sn || formFields.name}`}
                </span>
              </h3>
              <button 
                onClick={() => setModalMode(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-200/60 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveForm} className="p-5 space-y-4 text-xs">
              
              {/* [通用的关联模式选择区域] */}
              <div className="col-span-2 bg-slate-50/80 p-3 rounded-lg border border-slate-200/80">
                <label className="block text-slate-700 font-bold mb-1.5 text-xs">设备关联范围设置</label>
                <div className="flex items-center gap-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="associationType"
                      checked={formFields.associationType === 'global'}
                      onChange={() => setFormFields({ ...formFields, associationType: 'global', projectId: '', project: '全厂通用设备' })}
                      className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-xs font-semibold text-purple-700">🏢 全厂通用设备（不绑定特定船卡项目）</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="associationType"
                      checked={formFields.associationType === 'project'}
                      onChange={() => setFormFields({ 
                        ...formFields, 
                        associationType: 'project', 
                        projectId: MOCK_PROJECTS[0].id, 
                        project: MOCK_PROJECTS[0].name,
                        modelLevel: formFields.modelLevel || 'deck',
                        modelLevelName: formFields.modelLevelName || MODEL_LAYER_OPTIONS[0].fullName
                      })}
                      className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-xs font-semibold text-sky-700">🚢 关联造船工程项目与船型分层</span>
                  </label>
                </div>
              </div>

              {/* [关联造船项目及船型分层卡片] */}
              {formFields.associationType === 'project' && (
                <div className="bg-sky-50/40 p-3.5 rounded-xl border border-sky-200/80 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800 text-xs flex items-center gap-1.5">
                      <Ship className="w-4 h-4 text-blue-600" />
                      关联造船工程项目与船型分层
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    {/* 关联造船工程项目 */}
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1 text-[11px]">
                        选择造船工程项目 <span className="text-rose-500">*</span>
                      </label>
                      <select
                        value={formFields.projectId || (MOCK_PROJECTS.find(p => p.name === formFields.project)?.id || MOCK_PROJECTS[0].id)}
                        onChange={(e) => {
                          const selectedPrj = MOCK_PROJECTS.find(p => p.id === e.target.value);
                          if (selectedPrj) {
                            setFormFields({
                              ...formFields,
                              projectId: selectedPrj.id,
                              project: selectedPrj.name
                            });
                          }
                        }}
                        className="w-full px-2.5 py-1.5 border border-slate-300 rounded text-xs text-slate-800 focus:outline-none focus:border-blue-500 bg-white font-sans cursor-pointer shadow-2xs"
                      >
                        {MOCK_PROJECTS.map(prj => (
                          <option key={prj.id} value={prj.id}>
                            🚢 [{prj.id}] {prj.name} ({prj.shipType})
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* 关联船型模型分层 */}
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1 text-[11px]">
                        模型分层选择 <span className="text-rose-500">*</span>
                      </label>
                      <select
                        value={formFields.modelLevel || 'deck'}
                        onChange={(e) => {
                          const layerOpt = MODEL_LAYER_OPTIONS.find(l => l.id === e.target.value);
                          setFormFields({
                            ...formFields,
                            modelLevel: e.target.value,
                            modelLevelName: layerOpt ? layerOpt.fullName : ''
                          });
                        }}
                        className="w-full px-2.5 py-1.5 border border-slate-300 rounded text-xs text-slate-800 focus:outline-none focus:border-blue-500 bg-white font-sans cursor-pointer shadow-2xs"
                      >
                        {MODEL_LAYER_OPTIONS.map(layer => (
                          <option key={layer.id} value={layer.id}>
                            📐 {layer.fullName}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* 实时模型分层预览说明 */}
                  {(() => {
                    const activePrj = MOCK_PROJECTS.find(p => p.id === formFields.projectId) || MOCK_PROJECTS[0];
                    const activeLayer = MODEL_LAYER_OPTIONS.find(l => l.id === formFields.modelLevel) || MODEL_LAYER_OPTIONS[0];
                    return (
                      <div className="bg-white p-2.5 rounded-lg border border-sky-200/90 shadow-2xs space-y-1.5">
                        <div className="flex items-center justify-between text-[11px]">
                          <div className="flex items-center gap-1.5">
                            <span className="font-mono font-bold bg-blue-100 text-blue-800 px-1.5 py-0.2 rounded text-[10px]">
                              {activePrj.id}
                            </span>
                            <span className="font-bold text-slate-800">{activePrj.name}</span>
                          </div>
                          <span className="text-slate-500">工程阶段: <strong className="text-blue-700">{activePrj.phase}</strong></span>
                        </div>

                        <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-100">
                          <div className="flex items-center gap-1.5">
                            <span className="text-slate-500">模型分层绑定:</span>
                            <span className={`inline-flex items-center gap-1 px-2 py-0.2 rounded text-[10px] font-bold border ${activeLayer.badgeBg} ${activeLayer.badgeText} ${activeLayer.badgeBorder}`}>
                              <Layers className="w-3 h-3" />
                              {activeLayer.fullName}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              )}

              {/* [模态表单 1] 主基站特定属性 */}
              {activeTab === 'main_station' && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-600 font-medium mb-1">基站编码 <span className="text-rose-500">*</span></label>
                    <input
                      type="text"
                      required
                      value={formFields.code || ''}
                      onChange={(e) => setFormFields({ ...formFields, code: e.target.value })}
                      placeholder="如: 115D6DBC4AD7592E54"
                      className="w-full px-3 py-1.5 border border-slate-300 rounded focus:outline-none focus:border-blue-500 font-mono text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-medium mb-1">基站名称/编号 <span className="text-rose-500">*</span></label>
                    <input
                      type="text"
                      required
                      value={formFields.name || ''}
                      onChange={(e) => setFormFields({ ...formFields, name: e.target.value })}
                      placeholder="例如: 11（使用中）"
                      className="w-full px-3 py-1.5 border border-slate-300 rounded focus:outline-none focus:border-blue-500 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-medium mb-1">基站状态</label>
                    <select
                      value={formFields.status || '在线'}
                      onChange={(e) => setFormFields({ ...formFields, status: e.target.value })}
                      className="w-full px-3 py-1.5 border border-slate-300 rounded focus:outline-none focus:border-blue-500 text-xs"
                    >
                      <option value="在线">在线</option>
                      <option value="离线">离线</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-600 font-medium mb-1">回收状态</label>
                    <select
                      value={formFields.recycleStatus || '设备安装'}
                      onChange={(e) => setFormFields({ ...formFields, recycleStatus: e.target.value })}
                      className="w-full px-3 py-1.5 border border-slate-300 rounded focus:outline-none focus:border-blue-500 text-xs"
                    >
                      <option value="设备安装">设备安装</option>
                      <option value="临时撤场">临时撤场</option>
                      <option value="拟拆除">拟拆除</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-600 font-medium mb-1">安装位置</label>
                    <input
                      type="text"
                      value={formFields.location || ''}
                      onChange={(e) => setFormFields({ ...formFields, location: e.target.value })}
                      placeholder="如: 制造部边跨路口"
                      className="w-full px-3 py-1.5 border border-slate-300 rounded focus:outline-none focus:border-blue-500 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-medium mb-1">覆盖范围</label>
                    <input
                      type="text"
                      value={formFields.coverageRange || ''}
                      onChange={(e) => setFormFields({ ...formFields, coverageRange: e.target.value })}
                      placeholder="如: 23m 或 50m"
                      className="w-full px-3 py-1.5 border border-slate-300 rounded focus:outline-none focus:border-blue-500 text-xs"
                    />
                  </div>
                </div>
              )}

              {/* [模态表单 2] 气体探测器特定属性 */}
              {activeTab === 'gas_detector' && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-600 font-medium mb-1">设备SN编号 <span className="text-rose-500">*</span></label>
                    <input
                      type="text"
                      required
                      value={formFields.sn || ''}
                      onChange={(e) => setFormFields({ ...formFields, sn: e.target.value, name: e.target.value })}
                      placeholder="如: 866833080749440"
                      className="w-full px-3 py-1.5 border border-slate-300 rounded focus:outline-none focus:border-blue-500 font-mono text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-medium mb-1">气体检测类型</label>
                    <input
                      type="text"
                      value={formFields.gasType || ''}
                      onChange={(e) => setFormFields({ ...formFields, gasType: e.target.value })}
                      placeholder="如: 多气体四合一 (O2/CO/H2S/EX)"
                      className="w-full px-3 py-1.5 border border-slate-300 rounded focus:outline-none focus:border-blue-500 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-medium mb-1">安装位置</label>
                    <input
                      type="text"
                      value={formFields.location || ''}
                      onChange={(e) => setFormFields({ ...formFields, location: e.target.value })}
                      placeholder="如: 517-9号船机舱"
                      className="w-full px-3 py-1.5 border border-slate-300 rounded focus:outline-none focus:border-blue-500 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-medium mb-1">告警阀值</label>
                    <input
                      type="text"
                      value={formFields.alarmThreshold || ''}
                      onChange={(e) => setFormFields({ ...formFields, alarmThreshold: e.target.value })}
                      placeholder="如: O2 < 19.5%"
                      className="w-full px-3 py-1.5 border border-slate-300 rounded focus:outline-none focus:border-blue-500 text-xs"
                    />
                  </div>
                </div>
              )}

              {/* [模态表单 3] 声光报警器特定属性 */}
              {activeTab === 'alarm' && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-600 font-medium mb-1">设备SN编号 <span className="text-rose-500">*</span></label>
                    <input
                      type="text"
                      required
                      value={formFields.sn || ''}
                      onChange={(e) => setFormFields({ ...formFields, sn: e.target.value, name: e.target.value })}
                      placeholder="如: 867655086345884"
                      className="w-full px-3 py-1.5 border border-slate-300 rounded focus:outline-none focus:border-blue-500 font-mono text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-medium mb-1">安装位置</label>
                    <input
                      type="text"
                      value={formFields.location || ''}
                      onChange={(e) => setFormFields({ ...formFields, location: e.target.value })}
                      placeholder="如: 145-3机舱"
                      className="w-full px-3 py-1.5 border border-slate-300 rounded focus:outline-none focus:border-blue-500 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-medium mb-1">报警分贝 (dB)</label>
                    <input
                      type="text"
                      value={formFields.decibel || ''}
                      onChange={(e) => setFormFields({ ...formFields, decibel: e.target.value })}
                      placeholder="如: 110dB (高音警笛)"
                      className="w-full px-3 py-1.5 border border-slate-300 rounded focus:outline-none focus:border-blue-500 text-xs"
                    />
                  </div>
                </div>
              )}

              {/* [模态表单 4] 摄像头特定属性 */}
              {activeTab === 'camera' && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-600 font-medium mb-1">设备编码 <span className="text-rose-500">*</span></label>
                    <input
                      type="text"
                      required
                      value={formFields.code || ''}
                      onChange={(e) => setFormFields({ ...formFields, code: e.target.value })}
                      placeholder="如: test-003"
                      className="w-full px-3 py-1.5 border border-slate-300 rounded focus:outline-none focus:border-blue-500 font-mono text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-medium mb-1">设备名称 <span className="text-rose-500">*</span></label>
                    <input
                      type="text"
                      required
                      value={formFields.name || ''}
                      onChange={(e) => setFormFields({ ...formFields, name: e.target.value })}
                      placeholder="如: 香烟识别摄像头"
                      className="w-full px-3 py-1.5 border border-slate-300 rounded focus:outline-none focus:border-blue-500 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-medium mb-1">AI模型类别</label>
                    <input
                      type="text"
                      value={formFields.modelCategory || ''}
                      onChange={(e) => setFormFields({ ...formFields, modelCategory: e.target.value })}
                      placeholder="如: 未穿戴防护检测"
                      className="w-full px-3 py-1.5 border border-slate-300 rounded focus:outline-none focus:border-blue-500 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-medium mb-1">API接口URL</label>
                    <input
                      type="text"
                      value={formFields.apiUrl || ''}
                      onChange={(e) => setFormFields({ ...formFields, apiUrl: e.target.value })}
                      placeholder="如: http://192.168.205.110:7571"
                      className="w-full px-3 py-1.5 border border-slate-300 rounded focus:outline-none focus:border-blue-500 font-mono text-xs"
                    />
                  </div>
                </div>
              )}

              <div className="pt-3 border-t border-slate-200 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setModalMode(null)}
                  className="px-4 py-1.5 bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 rounded text-xs font-medium cursor-pointer"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-medium cursor-pointer shadow-2xs"
                >
                  保存提交
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 6. 详情 Modal 弹窗 */}
      {modalMode === 'detail' && selectedDevice && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="px-5 py-3.5 bg-slate-900 text-white flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Cpu className="w-4 h-4 text-cyan-400" />
                <span className="font-bold text-sm">
                  {activeTab === 'main_station' && '基站设备详情'}
                  {activeTab === 'gas_detector' && '气体探测器参数详情'}
                  {activeTab === 'alarm' && '声光报警器状态详情'}
                  {activeTab === 'camera' && '智能摄像头详细配置'}
                </span>
              </div>
              <button 
                onClick={() => setModalMode(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs text-slate-700">
              
              {/* 核心参数列表 */}
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1.5 font-mono">
                <div className="flex justify-between">
                  <span className="text-slate-500">唯一识别码：</span>
                  <span className="font-bold text-slate-900">{selectedDevice.code || selectedDevice.sn || selectedDevice.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">设备名称：</span>
                  <span className="font-bold text-blue-700">{selectedDevice.name}</span>
                </div>
              </div>

              {/* 造船工程项目与船型分层卡片 */}
              <div className="p-3 bg-gradient-to-br from-slate-50 to-blue-50/30 rounded-lg border border-slate-200/90 space-y-2 text-xs">
                <div className="flex items-center justify-between pb-1.5 border-b border-slate-200/60">
                  <span className="font-bold text-slate-800 flex items-center gap-1.5">
                    <Ship className="w-4 h-4 text-blue-600" />
                    关联造船工程项目与船型分层
                  </span>
                  {selectedDevice.associationType === 'global' || selectedDevice.project === '全厂通用设备' ? (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-700">
                      全厂通用配置
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-sky-100 text-sky-800">
                      指定项目 3D 绑定
                    </span>
                  )}
                </div>

                {selectedDevice.associationType === 'project' && selectedDevice.project !== '全厂通用设备' ? (
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500">工程项目编码及名称：</span>
                      <div className="flex items-center gap-1.5 font-bold text-slate-900">
                        <span className="font-mono bg-blue-100 text-blue-800 px-1.5 py-0.2 rounded text-[11px]">
                          {selectedDevice.projectId || 'PRJ'}
                        </span>
                        <span>{selectedDevice.project}</span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-slate-500">船型模型分层：</span>
                      {(() => {
                        const l = getLayerOption(selectedDevice.modelLevel);
                        return l ? (
                          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-bold border ${l.badgeBg} ${l.badgeText} ${l.badgeBorder}`}>
                            <Layers className="w-3.5 h-3.5" />
                            <span>{l.fullName}</span>
                          </span>
                        ) : (
                          <span className="font-semibold text-slate-800">{selectedDevice.modelLevelName || '通用视角'}</span>
                        );
                      })()}
                    </div>
                  </div>
                ) : (
                  <div className="text-slate-600 font-medium py-1">
                    🏢 全厂通用设备，无特定造船工程项目关联，可在全厂各大车间、码头与公共区域统一使用与定位。
                  </div>
                )}
              </div>

              {/* 其他补充参数 */}
              <div className="grid grid-cols-2 gap-x-4 gap-y-2.5">
                {activeTab === 'main_station' && (
                  <>
                    <div className="flex justify-between border-b border-slate-100 pb-1.5"><span className="text-slate-500">回收状态：</span><span className="font-medium text-slate-800">{selectedDevice.recycleStatus}</span></div>
                    <div className="flex justify-between border-b border-slate-100 pb-1.5"><span className="text-slate-500">安装位置：</span><span className="font-medium text-slate-800">{selectedDevice.location}</span></div>
                    <div className="flex justify-between border-b border-slate-100 pb-1.5"><span className="text-slate-500">覆盖范围：</span><span className="font-mono text-blue-600 font-bold">{selectedDevice.coverageRange || '23m'}</span></div>
                    <div className="flex justify-between border-b border-slate-100 pb-1.5"><span className="text-slate-500">辅助定位：</span><span className="font-medium text-slate-800">{selectedDevice.auxPositioning}</span></div>
                  </>
                )}

                {activeTab === 'gas_detector' && (
                  <>
                    <div className="flex justify-between border-b border-slate-100 pb-1.5"><span className="text-slate-500">安装位置：</span><span className="font-medium text-slate-800">{selectedDevice.location || '未设定'}</span></div>
                    <div className="flex justify-between border-b border-slate-100 pb-1.5"><span className="text-slate-500">气体类型：</span><span className="font-medium text-amber-700">{selectedDevice.gasType || '四合一测气'}</span></div>
                    <div className="flex justify-between border-b border-slate-100 pb-1.5"><span className="text-slate-500">告警阀值：</span><span className="font-mono text-slate-800">{selectedDevice.alarmThreshold || '标准防护'}</span></div>
                    <div className="flex justify-between border-b border-slate-100 pb-1.5"><span className="text-slate-500">创建时间：</span><span className="font-mono text-slate-800">{selectedDevice.createdAt}</span></div>
                  </>
                )}

                {activeTab === 'alarm' && (
                  <>
                    <div className="flex justify-between border-b border-slate-100 pb-1.5"><span className="text-slate-500">安装位置：</span><span className="font-medium text-slate-800">{selectedDevice.location || '未设定'}</span></div>
                    <div className="flex justify-between border-b border-slate-100 pb-1.5"><span className="text-slate-500">报警分贝：</span><span className="font-mono text-rose-600 font-bold">{selectedDevice.decibel || '110dB'}</span></div>
                    <div className="flex justify-between border-b border-slate-100 pb-1.5"><span className="text-slate-500">创建时间：</span><span className="font-mono text-slate-800">{selectedDevice.createdAt}</span></div>
                  </>
                )}

                {activeTab === 'camera' && (
                  <>
                    <div className="flex justify-between border-b border-slate-100 pb-1.5"><span className="text-slate-500">模型类别：</span><span className="font-mono text-slate-800">{selectedDevice.modelCategory}</span></div>
                    <div className="flex justify-between border-b border-slate-100 pb-1.5"><span className="text-slate-500">推流状态：</span><span className={`font-bold ${selectedDevice.isStreaming ? 'text-emerald-600' : 'text-slate-400'}`}>{selectedDevice.isStreaming ? '推流中' : '已停止'}</span></div>
                    <div className="flex justify-between border-b border-slate-100 pb-1.5 col-span-2"><span className="text-slate-500">API接口：</span><span className="font-mono text-sky-700">{selectedDevice.apiUrl}</span></div>
                  </>
                )}
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-between items-center">
                <button
                  onClick={() => { setDeleteTargetId(selectedDevice.id); }}
                  className="px-3 py-1.5 text-rose-600 hover:bg-rose-50 rounded border border-rose-200 text-xs font-medium flex items-center gap-1 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>删除设备</span>
                </button>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleOpenEdit(selectedDevice)}
                    className="px-4 py-1.5 bg-blue-50 text-blue-600 border border-blue-200 hover:bg-blue-100 rounded text-xs font-medium cursor-pointer"
                  >
                    编辑参数
                  </button>
                  <button
                    onClick={() => setModalMode(null)}
                    className="px-4 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded text-xs font-medium cursor-pointer shadow-2xs"
                  >
                    关闭窗口
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 7. 摄像头视频流预览 Preview 模态框 */}
      {modalMode === 'preview' && selectedDevice && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-950 rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden border border-slate-800 text-white animate-in fade-in zoom-in-95 duration-150">
            <div className="px-5 py-3.5 bg-slate-900 border-b border-slate-800 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Tv className="w-4.5 h-4.5 text-sky-400 animate-pulse" />
                <span className="font-bold text-sm">{selectedDevice.name} - 实时画质画面</span>
                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-mono border border-emerald-500/30">
                  1080P / 60fps
                </span>
              </div>
              <button 
                onClick={() => setModalMode(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 space-y-3">
              <div className="relative aspect-video bg-black rounded-lg overflow-hidden border border-slate-800 flex items-center justify-center group">
                <div className="absolute inset-0 bg-gradient-to-tr from-slate-900 via-sky-950 to-slate-900 flex flex-col items-center justify-center">
                  <div className="w-full h-full opacity-30 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px]"></div>
                </div>

                <div className="absolute top-1/4 left-1/3 w-36 h-36 border-2 border-emerald-400 rounded bg-emerald-500/10 flex flex-col justify-between p-1">
                  <span className="text-[10px] bg-emerald-600 text-white font-mono px-1 rounded self-start">
                    {selectedDevice.name.includes('香烟') ? '吸烟检测 98%' : selectedDevice.name.includes('安全帽') ? '安全帽佩戴 OK' : '目标AI追踪中'}
                  </span>
                  <span className="text-[9px] text-emerald-300 font-mono self-end">ID: 8092</span>
                </div>

                <div className="absolute top-3 left-3 bg-black/60 px-2.5 py-1 rounded text-[11px] font-mono text-slate-300 flex items-center gap-2 backdrop-blur-xs">
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
                  <span>REC | {new Date().toISOString().replace('T', ' ').substring(0, 19)}</span>
                </div>

                <div className="absolute bottom-3 left-3 bg-black/60 px-2.5 py-1 rounded text-[11px] font-mono text-slate-300 backdrop-blur-xs">
                  {selectedDevice.apiUrl}
                </div>
              </div>

              <div className="flex justify-between items-center text-xs text-slate-400 font-mono pt-1">
                <span>RTSP: {selectedDevice.rtspUrl || 'rtsp://192.168.205.110:554/live/stream'}</span>
                <button
                  onClick={() => setModalMode(null)}
                  className="px-4 py-1.5 bg-sky-600 hover:bg-sky-500 text-white font-sans rounded text-xs transition-colors cursor-pointer"
                >
                  退出预览
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 8. 二次删除确认 模态框 */}
      {deleteTargetId && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-sm overflow-hidden border border-slate-200 p-5 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center text-rose-600 shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">确认删除设备记录？</h4>
                <p className="text-slate-500 text-xs mt-0.5">该操作无法撤销，设备将被移出系统名册。</p>
              </div>
            </div>

            <div className="flex justify-end gap-2.5 pt-2 border-t border-slate-100">
              <button
                onClick={() => setDeleteTargetId(null)}
                className="px-3.5 py-1.5 bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 rounded text-xs font-medium cursor-pointer"
              >
                取消
              </button>
              <button
                onClick={confirmDelete}
                className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded text-xs font-medium cursor-pointer shadow-2xs"
              >
                确认删除
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
