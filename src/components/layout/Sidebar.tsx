import React from 'react';
import { 
  LayoutDashboard, 
  FolderKanban, 
  Users, 
  ShieldAlert, 
  BellRing, 
  ServerCrash,
  Ship
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { ViewType } from '@/src/types';

interface SidebarProps {
  currentView: ViewType;
  onChangeView: (view: ViewType) => void;
  currentUser?: { username: string; role: string; name: string };
  onLogout?: () => void;
}

const navItems: { id: ViewType; label: string; icon: React.ElementType }[] = [
  { id: 'dashboard', label: '驾驶舱', icon: LayoutDashboard },
  { id: 'projects', label: '项目管理', icon: FolderKanban },
  { id: 'models', label: '船模管理', icon: Ship },
  { id: 'personnel', label: '人员定位', icon: Users },
  { id: 'fence', label: '电子围栏', icon: ShieldAlert },
  { id: 'alarms', label: '告警配置', icon: BellRing },
  { id: 'devices', label: '设备管理', icon: ServerCrash },
];

export function Sidebar({ currentView, onChangeView, currentUser, onLogout }: SidebarProps) {
  return (
    <div className="w-44 h-screen bg-white text-slate-600 flex flex-col border-r border-slate-200 z-10 shadow-sm">
      <div className="h-14 flex items-center px-3.5 border-b border-slate-200">
        <div className="h-8 w-8 flex items-center justify-center mr-2 rounded-lg bg-blue-50/80 border border-blue-100 p-1 shrink-0">
          <img 
            src="/assets/extracted_logo.png" 
            alt="Logo" 
            className="w-full h-full object-contain"
          />
        </div>
        <div className="overflow-hidden">
          <h1 className="text-slate-900 font-bold text-sm tracking-tight truncate leading-tight">智慧船厂</h1>
          <div className="text-[9px] text-blue-600 font-medium tracking-wide">DIGITAL SHIPYARD</div>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto py-4">
        <div className="px-4 mb-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">功能模块</div>
        <nav className="space-y-1 px-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onChangeView(item.id)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2 rounded-md transition-all text-sm",
                currentView === item.id 
                  ? "bg-blue-50 text-blue-600 border-r-4 border-blue-600 font-bold" 
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-900 border-r-4 border-transparent font-medium"
              )}
            >
              <item.icon className="w-5 h-5 mr-3 flex-shrink-0" />
              {item.label}
            </button>
          ))}
        </nav>
      </div>

      {/* 侧边栏底部系统状态 */}
      <div className="p-2.5 border-t border-slate-200 bg-slate-50/70">
        <div className="flex items-center justify-between text-[10px] text-slate-400 px-1">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="font-medium text-slate-500">服务正常运行</span>
          </div>
          <span className="font-mono text-slate-400">V2.6 PRO</span>
        </div>
      </div>
    </div>
  );
}
