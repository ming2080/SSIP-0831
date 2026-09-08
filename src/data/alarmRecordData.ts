import { AlarmEventRecord } from '@/src/types/alarmRecord';

export const INITIAL_ALARM_RECORDS: AlarmEventRecord[] = [
  // ====================== 1. 实时告警 (待响应 / 升级中 / 处理中 / 已恢复待复核) ======================
  {
    id: 'ALM-20260906-001',
    policyId: 1,
    policyName: '1号船台密闭舱气体浓度多级告警',
    policyVersion: 'V2',
    policyType: '气体告警',
    projectType: 'shipbuilding',
    projectName: '17.4万方超大型LNG船 (H1821A)',
    deviceName: '防爆型固定式可燃气体探测仪',
    deviceCode: 'GT-G04-A',
    deviceType: '在线物联网传感探头',
    isRealtime: true,
    conditionDesc: '可燃气体超标浓度 > 15 ppm 持续3分钟',
    currentValue: '19.4 ppm (高出阈值 29%)',
    thresholdValue: '15.0 ppm',
    unit: 'ppm',
    areaType: '造船台/船坞 · 密闭液货舱室',
    areaName: '1号造船台 · 1#液货舱底舱隔舱',
    areaConditions: [
      { type: '造船台/船坞', relation: '是', target: '1号造船台' },
      { type: '密闭液货舱室', relation: '是', target: '1#液货舱' }
    ],
    targetPerson: '张伟',
    personId: 'EMP-015',
    personRole: '特种焊接工',
    personDept: '结构建造三队 · 焊接一组',
    personConditions: [
      { scope: '工种类别', relation: '是', target: '焊接工' },
      { scope: '工种类别', relation: '是', target: '装配钳工' }
    ],
    initialLevel: '低',
    currentLevel: '中',
    currentNotifyTarget: '车间安全主任-林峰',
    upgradeStatus: 'upgrading',
    upgradeCountdownSeconds: 168, // 倒计时 02:48
    upgradePlans: [
      {
        level: '低',
        target: '当班区域安全员 (陈建国)',
        countdown: '3分钟',
        status: 'passed',
        triggeredAt: '2026-09-06 20:38:12'
      },
      {
        level: '中',
        target: '车间安全主任 (林峰)',
        countdown: '5分钟',
        status: 'active',
        triggeredAt: '2026-09-06 20:41:12'
      },
      {
        level: '高',
        target: '厂级安全总监与应急指挥中心',
        countdown: '最高级别无需升级',
        status: 'pending'
      }
    ],
    notifyWays: ['声光报警通知', '发送短信通知'],
    soundLightStatus: 'active',
    smsNoticeCount: 2,
    repeatInterval: '重复告警',
    effectivePeriod: '永久',
    triggerTime: '2026-09-06 20:38:12',
    durationStr: '已持续 13分钟',
    processStatus: 'pending',
    handler: '待安全员接单签收',
    handlerPhone: '139-8821-9901',
    workflowLogs: [
      {
        id: 'step-1',
        stepName: '触发多级告警',
        operator: '气体智能传感网-Node-G04',
        role: '在线物联网传感设备',
        department: '安全监测中心',
        time: '2026-09-06 20:38:12',
        action: '监测到1#液货舱可燃气体浓度升至 16.2 ppm (超过阈值 15 ppm)',
        comment: '已触发低级告警，启动现场声光警报器，自动推送短信至当班安全员',
        status: 'completed'
      },
      {
        id: 'step-2',
        stepName: '低级升级倒计时超时',
        operator: '系统智能升级引擎',
        role: '自动服务',
        department: '安全调度中心',
        time: '2026-09-06 20:41:12',
        action: '低级响应倒计时(3分钟)超时未接单，系统自动升级至中级告警',
        comment: '浓度持续爬升至 19.4 ppm，已短信紧急通知车间安全主任-林峰，升级高危倒计时已启动(5分钟)',
        status: 'current'
      },
      {
        id: 'step-3',
        stepName: '现场接单与应急排险',
        operator: '车间安全主任-林峰',
        role: '安全工程师',
        department: '总装建造车间',
        time: '待执行',
        action: '前往现场实施舱室通风强排、疏散作业人员并切断气源',
        status: 'pending'
      },
      {
        id: 'step-4',
        stepName: '复核复测与闭环归档',
        operator: '厂级安全质量监察部',
        role: '审核负责人',
        department: '质安环保部',
        time: '待执行',
        action: '便携式气体检测仪多点复测合格并归档处理报告',
        status: 'pending'
      }
    ]
  },
  {
    id: 'ALM-20260906-002',
    policyId: 4,
    policyName: '船台及船坞深坑防高空坠落红线越界告警',
    policyVersion: 'V2',
    policyType: '超出活动范围',
    projectType: 'shipbuilding',
    projectName: '30万吨VLCC超大型原油船 (H1788B)',
    isRealtime: true,
    conditionDesc: '进入未授权区域 持续大于 5秒',
    currentValue: '擅入2号坞高空临边红线深坑区',
    thresholdValue: '0 秒容限 (绝对禁区)',
    unit: '秒',
    areaType: '造船台/船坞 · 立体深坑禁区',
    areaName: '2号船坞 · 4号坞墩深基坑边缘',
    areaConditions: [
      { type: '造船台/船坞', relation: '是', target: '2号造船坞' },
      { type: '室外露天堆场', relation: '是', target: '深基坑吊装警戒区' }
    ],
    targetPerson: '刘强',
    personId: 'EMP-042',
    personRole: '装配钳工',
    personDept: '船体装配二组',
    personConditions: [
      { scope: '工种类别', relation: '是', target: '装配钳工' },
      { scope: '工种类别', relation: '是', target: '脚手架搭设工' }
    ],
    initialLevel: '高',
    currentLevel: '高',
    currentNotifyTarget: '厂级安全总监与应急指挥中心',
    upgradeStatus: 'suppressed', // 现场已响应，倒计时挂起
    upgradeCountdownSeconds: 0,
    upgradePlans: [
      {
        level: '高',
        target: '应急指挥中心 & 现场巡查员',
        countdown: '最高级别无需升级',
        status: 'active',
        triggeredAt: '2026-09-06 20:25:30'
      }
    ],
    notifyWays: ['声光报警通知', '发送短信通知'],
    soundLightStatus: 'muted', // 已消音
    smsNoticeCount: 4,
    repeatInterval: '不重复',
    effectivePeriod: '永久',
    triggerTime: '2026-09-06 20:25:30',
    durationStr: '已持续 26分钟',
    processStatus: 'processing',
    handler: '安全巡查队长-王德海',
    handlerPhone: '138-7762-1190',
    causeAnalysis: '装配工刘强未佩戴双钩五点式安全带，跨越了2号船坞临边作业警戒围栏捡拾落入工具。',
    correctiveActions: '巡查队长王德海已于 20:28 到达现场，劝阻并引导人员撤出危险深坑区域，现场扣留作业工牌并进行安全规程现场谈话。',
    workflowLogs: [
      {
        id: 'step-1',
        stepName: '触发禁区红线越界',
        operator: 'UWB高精度定位基站-BS-09',
        role: '定位引擎',
        department: '信息自动化部',
        time: '2026-09-06 20:25:30',
        action: '刘强(EMP-042)跨入2号船坞深坑防坠警戒围栏红线，触发高危警报',
        comment: '蜂鸣器及旋转红光警示灯启动，向巡查员APP和安全指挥中心广播推送',
        status: 'completed'
      },
      {
        id: 'step-2',
        stepName: '巡查队长接单并消音',
        operator: '安全巡查队长-王德海',
        role: '应急处置员',
        department: '厂级巡查应急班',
        time: '2026-09-06 20:27:10',
        action: '移动端App一键接单，现场声光报警暂时消音，赶往2号坞墩现场',
        comment: '升级倒计时机制锁定，进入处置阶段',
        status: 'completed'
      },
      {
        id: 'step-3',
        stepName: '现场纠违处置整改',
        operator: '安全巡查队长-王德海',
        role: '应急处置员',
        department: '厂级巡查应急班',
        time: '2026-09-06 20:35:40',
        action: '完成人员撤离，增设物理硬质隔离围栏，上传现场整改照片2张',
        status: 'current'
      },
      {
        id: 'step-4',
        stepName: '班组安全整顿与闭环复核',
        operator: '船体车间主管-周刚',
        role: '车间负责人',
        department: '总装制造部',
        time: '待执行',
        action: '组织船体二组班前安全技术交底复核，闭环归档',
        status: 'pending'
      }
    ]
  },
  {
    id: 'ALM-20260906-003',
    policyId: 5,
    policyName: '30万吨VLCC机舱受限空间滞留管理',
    policyVersion: 'V1',
    policyType: '受限空间滞留',
    projectType: 'shipbuilding',
    projectName: '30万吨VLCC超大型原油船 (H1788B)',
    isRealtime: true,
    conditionDesc: '滞留超时时长 > 180 分钟',
    currentValue: '已滞留 192 分钟 (超限 12分钟)',
    thresholdValue: '180 分钟',
    unit: '分钟',
    areaType: '密闭液货舱室',
    areaName: '机舱管路区 · 尾轴管密闭夹层',
    areaConditions: [
      { type: '密闭液货舱室', relation: '是', target: '机舱管路区' }
    ],
    targetPerson: '李建国',
    personId: 'EMP-088',
    personRole: '管系安装工',
    personDept: '机装车间管系工段',
    personConditions: [
      { scope: '工种类别', relation: '是', target: '全体施工人员' }
    ],
    initialLevel: '低',
    currentLevel: '低',
    currentNotifyTarget: '现场施工班组长-李富贵',
    upgradeStatus: 'normal',
    upgradeCountdownSeconds: 0,
    upgradePlans: [
      {
        level: '低',
        target: '现场施工班组长 (李富贵)',
        countdown: '15分钟',
        status: 'active',
        triggeredAt: '2026-09-06 20:45:00'
      }
    ],
    notifyWays: ['声光报警通知'],
    soundLightStatus: 'normal',
    smsNoticeCount: 1,
    repeatInterval: '不重复',
    effectivePeriod: '永久',
    triggerTime: '2026-09-06 20:45:00',
    durationStr: '已持续 6分钟',
    processStatus: 'recovered', // 人员已通过定位手环离开舱室，指标已恢复，等待安全员复核
    handler: '管系安装班组长-李富贵',
    handlerPhone: '136-1122-3344',
    causeAnalysis: '李建国在尾轴管夹层进行大口径滑油管路法兰校对，因赶工超过了受限空间单次3小时准入时间限制。',
    correctiveActions: '班组长呼叫对讲机后，李建国已于 20:50 打卡出舱休息喝水，生命体征监测手环读数正常。',
    reviewNotes: '人员已出舱，体征正常，准予确认恢复。',
    workflowLogs: [
      {
        id: 'step-1',
        stepName: '触发受限空间超时',
        operator: '定位打卡网关-GW-M03',
        role: '自动监测引擎',
        department: '信息化中心',
        time: '2026-09-06 20:45:00',
        action: '李建国(EMP-088)在尾轴管夹层累计驻留满180分钟，系统生成低级提醒',
        status: 'completed'
      },
      {
        id: 'step-2',
        stepName: '人员出舱指标恢复',
        operator: 'UWB手环感知',
        role: '自动感知',
        department: '信息化中心',
        time: '2026-09-06 20:50:22',
        action: '监测到人员离开机舱密闭夹层，移动至休息通风区，状态转为待复核',
        status: 'completed'
      },
      {
        id: 'step-3',
        stepName: '班组长复核签字',
        operator: '管系安装班组长-李富贵',
        role: '现场监护人',
        department: '机装车间管系工段',
        time: '2026-09-06 20:51:10',
        action: '确认人员身体状态良好，提交复核记录',
        status: 'current'
      }
    ]
  },

  // ====================== 2. 历史告警 (已闭环 / 误报消除 / 归档审计) ======================
  {
    id: 'ALM-20260905-018',
    policyId: 2,
    policyName: '全厂区未佩戴安全帽智能识别策略',
    policyVersion: 'V1',
    policyType: '未佩戴安全帽',
    projectType: 'none',
    projectName: '',
    isRealtime: false,
    conditionDesc: 'AI视觉识别未戴安全帽 持续大于 5秒',
    currentValue: 'AI视觉置信度 96.8% 未佩戴安全帽',
    thresholdValue: '未佩戴 持续5秒',
    unit: '秒',
    areaType: '车间生产线 · 总装车间',
    areaName: '总装车间 · 3号分段组焊工位',
    areaConditions: [
      { type: '车间生产线', relation: '是', target: '总装车间' },
      { type: '造船台/船坞', relation: '是', target: '1号造船台' }
    ],
    targetPerson: '赵大勇',
    personId: 'EMP-102',
    personRole: '装配辅助工',
    personDept: '涂装总装联合作业队',
    personConditions: [
      { scope: '全厂工人', relation: '是', target: '全体施工人员' }
    ],
    initialLevel: '低',
    currentLevel: '中',
    currentNotifyTarget: '当班区域安全员-陈建国',
    upgradeStatus: 'max',
    upgradeCountdownSeconds: 0,
    upgradePlans: [
      {
        level: '低',
        target: '现场施工班组长',
        countdown: '2分钟',
        status: 'passed',
        triggeredAt: '2026-09-05 14:10:00'
      },
      {
        level: '中',
        target: '当班区域安全员',
        countdown: '5分钟',
        status: 'passed',
        triggeredAt: '2026-09-05 14:12:00'
      }
    ],
    notifyWays: ['声光报警通知'],
    soundLightStatus: 'normal',
    smsNoticeCount: 1,
    repeatInterval: '不重复',
    effectivePeriod: '永久',
    triggerTime: '2026-09-05 14:10:00',
    durationStr: '历时 18分钟',
    resolvedTime: '2026-09-05 14:28:15',
    closedTime: '2026-09-05 15:00:00',
    processStatus: 'closed',
    handler: '当班区域安全员-陈建国',
    handlerPhone: '135-2233-4455',
    causeAnalysis: '作业人员在擦汗时顺手摘下安全帽置于配电箱上，离开工位取焊条未及时重新佩戴。',
    correctiveActions: '安全员现场警告并要求立即佩戴安全帽，对其按车间三级违章进行记2分处理，并签署安全警示承诺书。现场已核实整改达标。',
    reviewNotes: '现场整改抓拍图片确认已重新佩戴并系紧下颚带，复核通过，予以归档。',
    attachments: [
      {
        id: 'att-004-1',
        name: '现场违章抓拍及安全帽复戴照片.jpg',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80',
        size: '1.8 MB',
        uploadTime: '14:22:10'
      },
      {
        id: 'att-004-2',
        name: '作业现场安全交底与承诺签署抓拍.jpg',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
        size: '2.5 MB',
        uploadTime: '14:25:35'
      }
    ],
    workflowLogs: [
      {
        id: 'step-1',
        stepName: 'AI视觉告警上报',
        operator: 'AI视觉摄像头-CAM-302',
        role: 'AI边缘识别终端',
        department: '安全数智中心',
        time: '2026-09-05 14:10:00',
        action: '抓拍到赵大勇(EMP-102)未戴安全帽并在走动，置信度96.8%',
        status: 'completed'
      },
      {
        id: 'step-2',
        stepName: '安全员响应接单',
        operator: '当班区域安全员-陈建国',
        role: '现场安全员',
        department: '质量安全监督部',
        time: '2026-09-05 14:12:30',
        action: '手机端确认告警，赶往总装车间3号工位',
        status: 'completed'
      },
      {
        id: 'step-3',
        stepName: '违章纠正与记录',
        operator: '当班区域安全员-陈建国',
        role: '现场安全员',
        department: '质量安全监督部',
        time: '2026-09-05 14:28:15',
        action: '督促戴齐护具，录入违章档案，闭环申请已提交',
        status: 'completed'
      },
      {
        id: 'step-4',
        stepName: '安全主管复核归档',
        operator: '车间安全主任-林峰',
        role: '安全主管',
        department: '制造安全部',
        time: '2026-09-05 15:00:00',
        action: '审核纠偏措施与抓拍回执，批准闭环归档',
        status: 'completed'
      }
    ]
  },
  {
    id: 'ALM-20260904-009',
    policyId: 6,
    policyName: '作业车间生产作业玩手机违章AI视觉识别',
    policyVersion: 'V1',
    policyType: '厂区玩手机',
    projectType: 'none',
    projectName: '',
    isRealtime: false,
    conditionDesc: '玩手机违规行为持续大于 2分钟',
    currentValue: '操作手持测厚仪时被误判为低头玩手机',
    thresholdValue: '2分钟',
    unit: '分钟',
    areaType: '车间生产线 · 涂装车间',
    areaName: '涂装车间 · 预处理板材喷砂工段',
    areaConditions: [
      { type: '车间生产线', relation: '是', target: '总装车间' },
      { type: '车间生产线', relation: '是', target: '涂装车间' }
    ],
    targetPerson: '孙明',
    personId: 'EMP-067',
    personRole: '探伤无损检测员',
    personDept: '品保质检部',
    personConditions: [
      { scope: '全厂工人', relation: '是', target: '全体施工人员' }
    ],
    initialLevel: '低',
    currentLevel: '低',
    currentNotifyTarget: '现场施工班组长',
    upgradeStatus: 'normal',
    upgradeCountdownSeconds: 0,
    upgradePlans: [
      {
        level: '低',
        target: '现场施工班组长',
        countdown: '无升级',
        status: 'passed',
        triggeredAt: '2026-09-04 11:20:00'
      }
    ],
    notifyWays: ['声光报警通知'],
    soundLightStatus: 'normal',
    smsNoticeCount: 0,
    repeatInterval: '不重复',
    effectivePeriod: '永久',
    triggerTime: '2026-09-04 11:20:00',
    durationStr: '历时 6分钟',
    resolvedTime: '2026-09-04 11:26:00',
    closedTime: '2026-09-04 11:30:00',
    processStatus: 'false_alarm',
    handler: '品保班长-黄凯',
    handlerPhone: '137-9988-7766',
    causeAnalysis: '经品保班长现场核验与调取高倍监控，孙明当时正在使用智能型超声波钢板测厚仪(黑色手持终端外壳类似手机)记录喷丸厚度数据，非违规玩手机。',
    correctiveActions: '判定为AI算法在反光背景下的误报。已将该设备外形标注加入AI训练白名单数据集，消除告警。',
    reviewNotes: '已由品保负责人与系统管理员联合确认误报，核销扣分记录。',
    attachments: [
      {
        id: 'att-005-1',
        name: '现场检测仪器操作实况录像.mp4',
        type: 'video',
        url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
        size: '12.4 MB',
        uploadTime: '11:25:12'
      },
      {
        id: 'att-005-2',
        name: '手持测厚仪与手机外观对比佐证图.png',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=800&q=80',
        size: '3.1 MB',
        uploadTime: '11:27:00'
      }
    ],
    workflowLogs: [
      {
        id: 'step-1',
        stepName: 'AI触发低头手持终端告警',
        operator: 'AI视觉分析系统-Box-02',
        role: '算法引擎',
        department: '智能制造中心',
        time: '2026-09-04 11:20:00',
        action: '识别到涂装车间人员低头手持矩形黑屏物体操作超2分钟',
        status: 'completed'
      },
      {
        id: 'step-2',
        stepName: '班长现场核实消除误报',
        operator: '品保班长-黄凯',
        role: '复核人',
        department: '品保质检部',
        time: '2026-09-04 11:26:00',
        action: '现场查验证实为正当探伤作业测厚仪操作，发起误报解除',
        status: 'completed'
      },
      {
        id: 'step-3',
        stepName: '系统复核销警',
        operator: '系统管理员',
        role: '平台管理',
        department: '信息自动化部',
        time: '2026-09-04 11:30:00',
        action: '确认消除误报警报，归档优化算法标签',
        status: 'completed'
      }
    ]
  },
  {
    id: 'ALM-20260903-005',
    policyId: 1,
    policyName: '1号船台密闭舱气体浓度多级告警',
    policyVersion: 'V2',
    policyType: '气体告警',
    projectType: 'shipbuilding',
    projectName: '17.4万方超大型LNG船 (H1821A)',
    deviceName: '多参数复合气体检测变送器',
    deviceCode: 'GT-B02-C',
    deviceType: '工业在线气体分析仪',
    isRealtime: false,
    conditionDesc: '可燃气体超标浓度 > 15 ppm',
    currentValue: '最高达 17.5 ppm',
    thresholdValue: '15.0 ppm',
    unit: 'ppm',
    areaType: '造船台/船坞 · 密闭液货舱室',
    areaName: '1号造船台 · 2#液货舱',
    areaConditions: [
      { type: '造船台/船坞', relation: '是', target: '1号造船台' },
      { type: '密闭液货舱室', relation: '是', target: '1#液货舱' }
    ],
    targetPerson: '马超',
    personId: 'EMP-029',
    personRole: '特种焊接工',
    personDept: '外协结构建造队',
    personConditions: [
      { scope: '工种类别', relation: '是', target: '焊接工' }
    ],
    initialLevel: '低',
    currentLevel: '中',
    currentNotifyTarget: '车间安全主任-林峰',
    upgradeStatus: 'max',
    upgradeCountdownSeconds: 0,
    upgradePlans: [
      {
        level: '低',
        target: '当班区域安全员',
        countdown: '3分钟',
        status: 'passed',
        triggeredAt: '2026-09-03 09:15:00'
      },
      {
        level: '中',
        target: '车间安全主任',
        countdown: '5分钟',
        status: 'passed',
        triggeredAt: '2026-09-03 09:18:00'
      }
    ],
    notifyWays: ['声光报警通知', '发送短信通知'],
    soundLightStatus: 'normal',
    smsNoticeCount: 2,
    repeatInterval: '重复告警',
    effectivePeriod: '永久',
    triggerTime: '2026-09-03 09:15:00',
    durationStr: '历时 35分钟',
    resolvedTime: '2026-09-03 09:50:00',
    closedTime: '2026-09-03 10:15:00',
    processStatus: 'closed',
    handler: '车间安全主任-林峰',
    handlerPhone: '139-8821-9901',
    causeAnalysis: '2#液货舱角隅处二保焊作业时，供气阀接头密封圈老化产生微量氩气/二氧化碳保护气集聚。',
    correctiveActions: '更换防爆型快速气管接头，增加便携式抽风管路，经4点检测合格后恢复受限空间作业许可。',
    reviewNotes: '复测各项气体指标均降至 0 ppm 安全基线，通风良好，闭环归档。',
    workflowLogs: [
      {
        id: 'step-1',
        stepName: '触发气体超标',
        operator: '固定式可燃气体探头',
        role: '监测仪器',
        department: '安全中心',
        time: '2026-09-03 09:15:00',
        action: '浓度超过 15ppm，声光报警启动',
        status: 'completed'
      },
      {
        id: 'step-2',
        stepName: '安全主任接单处置',
        operator: '车间安全主任-林峰',
        role: '安全工程师',
        department: '造船一部',
        time: '2026-09-03 09:20:00',
        action: '到达现场检修气路并更换密封件，开启强排通风',
        status: 'completed'
      },
      {
        id: 'step-3',
        stepName: '复测达标闭环',
        operator: '厂级安全质量监察部',
        role: '复核员',
        department: '质安环保部',
        time: '2026-09-03 10:15:00',
        action: '出具复检合格凭证，流程闭环',
        status: 'completed'
      }
    ]
  }
];
