import React from 'react';

export type BerthCategory = 'berth_pier' | 'berth_slipway';

export type SlotShipTypeAllowed = 'large_and_small' | 'small_only';

export interface OccupiedShip {
  id: string;
  name: string;
  shipType: string;
  shipCode: string;
  stage: string;
  startDate: string; // 占用起始日期，格式 YYYY-MM-DD
  endDate: string;   // 占用截止日期，格式 YYYY-MM-DD
  isSmallShip?: boolean;
}

export interface BerthSubSlot {
  slotId: string; // 唯一标识，如 'berth-1-slot-1'
  slotNumber: number; // 顺序号 1, 2, 3
  slotName: string; // 如 '1号位', '2号位', '3号位'
  allowedType: SlotShipTypeAllowed; // 'large_and_small' (可停大船/小船) | 'small_only' (仅限小船)
  allowedTypeLabel: string; // '大船 / 小船' | '仅限小船'
  isOccupied: boolean; // 是否被占用
  occupiedShip?: OccupiedShip; // 占用船舶信息
}

export interface BerthAreaConfig {
  id: string;
  code: number; // 1 ~ 6
  name: string; // 完整名称
  shortName: string; // 简短名称
  category: BerthCategory;
  categoryName: string; // '移动码头' | '平船台'
  maxCapacity: number; // 容量上限
  ruleDescription: string; // 规则文字说明
  restrictionNote?: string; // 特殊限制说明
  isSmallShipOnly?: boolean; // 整个区域是否仅限小船
  // 二级停泊位列表
  slots: BerthSubSlot[];
  // 在 1:1 船厂俯视背景图中的绝对百分比位置 (Top, Left, Width, Height)
  rect: {
    top: number; // %
    left: number; // %
    width: number; // %
    height: number; // %
  };
  // 标签定位偏移
  labelPos: {
    top: number; // %
    left: number; // %
  };
}

// 时间重叠判断函数：判断两段日期区间 [startA, endA] 与 [startB, endB] 是否存在交集重叠
export function isDateRangeOverlap(startA?: string, endA?: string, startB?: string, endB?: string): boolean {
  if (!startA || !endA || !startB || !endB) return true; // 缺失日期时保守视为冲突
  return startA <= endB && endA >= startB;
}

// 6 个可停泊区域的配置定义（严格按照用户规则与数据标准）
export const BERTH_AREAS: BerthAreaConfig[] = [
  {
    id: 'berth-1',
    code: 1,
    name: '1号平船台',
    shortName: '1号平船台',
    category: 'berth_slipway',
    categoryName: '平船台',
    maxCapacity: 2,
    ruleDescription: '可停泊 2 艘大船（亦可停泊小船）',
    restrictionNote: '1号平船台支持2万吨级船体总装与分段合拢',
    isSmallShipOnly: false,
    rect: {
      top: 85.8,
      left: 44.0,
      width: 44.5,
      height: 4.2
    },
    labelPos: {
      top: 87.8,
      left: 77.0
    },
    slots: [
      {
        slotId: 'berth-1-slot-1',
        slotNumber: 1,
        slotName: '1号位',
        allowedType: 'large_and_small',
        allowedTypeLabel: '大船 / 小船',
        isOccupied: true,
        occupiedShip: {
          id: 'PRJ-2026-LNG01',
          name: '17.4万m³ 大型LNG船 1号舰',
          shipType: '大型LNG船',
          shipCode: 'HULL-LNG-174',
          stage: '合拢焊接',
          startDate: '2026-03-01',
          endDate: '2026-10-31'
        }
      },
      {
        slotId: 'berth-1-slot-2',
        slotNumber: 2,
        slotName: '2号位',
        allowedType: 'large_and_small',
        allowedTypeLabel: '大船 / 小船',
        isOccupied: false
      }
    ]
  },
  {
    id: 'berth-2',
    code: 2,
    name: '2号码头',
    shortName: '2号码头',
    category: 'berth_pier',
    categoryName: '移动码头',
    maxCapacity: 3,
    ruleDescription: '可停泊 3 艘大船（亦可停泊小船）',
    restrictionNote: '重型系泊码头，配置双侧重型缆桩与高压岸电',
    isSmallShipOnly: false,
    rect: {
      top: 0.8,
      left: 63.5,
      width: 18.2,
      height: 21.8
    },
    labelPos: {
      top: 11.2,
      left: 74.5
    },
    slots: [
      {
        slotId: 'berth-2-slot-1',
        slotNumber: 1,
        slotName: '1号位',
        allowedType: 'large_and_small',
        allowedTypeLabel: '大船 / 小船',
        isOccupied: true,
        occupiedShip: {
          id: 'PRJ-2026-PSV01',
          name: '75M 动力定位平台供应船',
          shipType: '海洋工程PSV',
          shipCode: 'HULL-PSV-075',
          stage: '交船交付',
          startDate: '2026-07-01',
          endDate: '2026-12-31',
          isSmallShip: true
        }
      },
      {
        slotId: 'berth-2-slot-2',
        slotNumber: 2,
        slotName: '2号位',
        allowedType: 'large_and_small',
        allowedTypeLabel: '大船 / 小船',
        isOccupied: true,
        occupiedShip: {
          id: 'PRJ-2026-CTN03',
          name: '15000TEU 集装箱船',
          shipType: '大型集装箱船',
          shipCode: 'HULL-CTN-150',
          stage: '系泊调试',
          startDate: '2026-05-15',
          endDate: '2027-02-28'
        }
      },
      {
        slotId: 'berth-2-slot-3',
        slotNumber: 3,
        slotName: '3号位',
        allowedType: 'large_and_small',
        allowedTypeLabel: '大船 / 小船',
        isOccupied: false
      }
    ]
  },
  {
    id: 'berth-3',
    code: 3,
    name: '3号码头',
    shortName: '3号码头',
    category: 'berth_pier',
    categoryName: '移动码头',
    maxCapacity: 2,
    ruleDescription: '可停泊 2 艘大船（亦可停泊小船）',
    restrictionNote: '水下舾装与管系试压核心深水泊位',
    isSmallShipOnly: false,
    rect: {
      top: 42.8,
      left: 78.0,
      width: 15.0,
      height: 18.8
    },
    labelPos: {
      top: 52.0,
      left: 84.0
    },
    slots: [
      {
        slotId: 'berth-3-slot-1',
        slotNumber: 1,
        slotName: '1号位',
        allowedType: 'large_and_small',
        allowedTypeLabel: '大船 / 小船',
        isOccupied: true,
        occupiedShip: {
          id: 'PRJ-2026-TANK02',
          name: '30万吨 VLCC 超大型原油船',
          shipType: '超大型原油船',
          shipCode: 'HULL-VLCC-300',
          stage: '水下舾装',
          startDate: '2026-08-01',
          endDate: '2027-03-15'
        }
      },
      {
        slotId: 'berth-3-slot-2',
        slotNumber: 2,
        slotName: '2号位',
        allowedType: 'large_and_small',
        allowedTypeLabel: '大船 / 小船',
        isOccupied: false
      }
    ]
  },
  {
    id: 'berth-4',
    code: 4,
    name: '4号码头',
    shortName: '4号码头',
    category: 'berth_pier',
    categoryName: '移动码头',
    maxCapacity: 2,
    ruleDescription: '可停泊 2 艘大船（亦可停泊小船）',
    restrictionNote: '自适应潮位系泊码头',
    isSmallShipOnly: false,
    rect: {
      top: 67.5,
      left: 89.8,
      width: 9.5,
      height: 17.2
    },
    labelPos: {
      top: 79.5,
      left: 95.0
    },
    slots: [
      {
        slotId: 'berth-4-slot-1',
        slotNumber: 1,
        slotName: '1号位',
        allowedType: 'large_and_small',
        allowedTypeLabel: '大船 / 小船',
        isOccupied: true,
        occupiedShip: {
          id: 'PRJ-2026-CHEM01',
          name: '18500 DWT 绿色油化船',
          shipType: '特种化学品船',
          shipCode: 'HULL-CHEM-185',
          stage: '管系试压',
          startDate: '2026-04-01',
          endDate: '2026-11-30'
        }
      },
      {
        slotId: 'berth-4-slot-2',
        slotNumber: 2,
        slotName: '2号位',
        allowedType: 'large_and_small',
        allowedTypeLabel: '大船 / 小船',
        isOccupied: false
      }
    ]
  },
  {
    id: 'berth-5',
    code: 5,
    name: '5号码头',
    shortName: '5号码头',
    category: 'berth_pier',
    categoryName: '移动码头',
    maxCapacity: 1,
    ruleDescription: '可停泊 1 艘小船（仅限小船）',
    restrictionNote: '专用小型泊位：仅限停泊1艘小型船只（如拖轮、工作艇等），大船不可停入',
    isSmallShipOnly: true,
    rect: {
      top: 34.5,
      left: 76.5,
      width: 7.2,
      height: 7.2
    },
    labelPos: {
      top: 38.0,
      left: 80.0
    },
    slots: [
      {
        slotId: 'berth-5-slot-1',
        slotNumber: 1,
        slotName: '1号位',
        allowedType: 'small_only',
        allowedTypeLabel: '仅限小船',
        isOccupied: false
      }
    ]
  },
  {
    id: 'berth-6',
    code: 6,
    name: '6号平船台',
    shortName: '6号平船台',
    category: 'berth_slipway',
    categoryName: '平船台',
    maxCapacity: 3,
    ruleDescription: '最多停泊 2 艘大船 + 1 艘小船（共 3 个位置）',
    restrictionNote: '大型平船台作业区：1号位与2号位可停大/小船，3号位仅限小船',
    isSmallShipOnly: false,
    rect: {
      top: 31.0,
      left: 41.0,
      width: 22.2,
      height: 19.8
    },
    labelPos: {
      top: 42.5,
      left: 49.0
    },
    slots: [
      {
        slotId: 'berth-6-slot-1',
        slotNumber: 1,
        slotName: '1号位',
        allowedType: 'large_and_small',
        allowedTypeLabel: '大船 / 小船',
        isOccupied: true,
        occupiedShip: {
          id: 'PRJ-2026-BULK04',
          name: '82,000 DWT 散货船',
          shipType: '大型散货船',
          shipCode: 'HULL-BULK-082',
          stage: '船台搭载',
          startDate: '2026-06-15',
          endDate: '2027-01-20'
        }
      },
      {
        slotId: 'berth-6-slot-2',
        slotNumber: 2,
        slotName: '2号位',
        allowedType: 'large_and_small',
        allowedTypeLabel: '大船 / 小船',
        isOccupied: false
      },
      {
        slotId: 'berth-6-slot-3',
        slotNumber: 3,
        slotName: '3号位',
        allowedType: 'small_only',
        allowedTypeLabel: '仅限小船',
        isOccupied: false
      }
    ]
  }
];

// 判断船型是否属于小型船只（例如拖轮、工作艇、AHTS、PSV等）
export function checkIsSmallShip(shipNameOrType?: string): boolean {
  if (!shipNameOrType) return false;
  const lower = shipNameOrType.toLowerCase();
  return (
    lower.includes('拖轮') ||
    lower.includes('tug') ||
    lower.includes('工作船') ||
    lower.includes('工作艇') ||
    lower.includes('海工辅助') ||
    lower.includes('支持船') ||
    lower.includes('ahts') ||
    lower.includes('psv') ||
    lower.includes('小船') ||
    lower.includes('小型')
  );
}
