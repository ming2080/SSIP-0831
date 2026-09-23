import React, { useState, useEffect } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { ViewType } from '@/src/types';
import { Dashboard } from '../views/Dashboard';
import { ProjectManagement } from '../views/ProjectManagement';
import { PersonnelTracking } from '../views/PersonnelTracking';
import { ElectronicFence } from '../views/ElectronicFence';
import { AlarmConfig } from '../views/AlarmConfig';
import { DeviceManagement } from '../views/DeviceManagement';
import { ShipModelManagement } from '../views/ShipModelManagement';
import { PersonnelManagement } from '../views/PersonnelManagement';
import { UserManagement } from '../views/UserManagement';
import { TeamManagement } from '../views/TeamManagement';
import { TagManagement } from '../views/TagManagement';
import { OvertimeManagement } from '../views/OvertimeManagement';

interface LayoutProps {
  currentUser?: { username: string; role: string; name: string };
  onLogout?: () => void;
}

export function Layout({ currentUser, onLogout }: LayoutProps = {}) {
  const [currentView, setCurrentView] = useState<ViewType>('dashboard');
  const [personnelNavState, setPersonnelNavState] = useState<{ personId?: string; autoPlay?: boolean } | null>(null);
  const [selectedEmpForUserCreation, setSelectedEmpForUserCreation] = useState<string | undefined>(undefined);
  const [targetDeptIdForPersonnel, setTargetDeptIdForPersonnel] = useState<string | undefined>(undefined);

  useEffect(() => {
    const handleCustomNavigate = (e: any) => {
      if (e.detail?.view) {
        handleNavigate(e.detail.view, { 
          personId: e.detail.personId, 
          autoPlay: e.detail.autoPlay 
        });
      }
    };
    window.addEventListener('navigate_view', handleCustomNavigate);
    return () => window.removeEventListener('navigate_view', handleCustomNavigate);
  }, []);

  const handleNavigate = (view: ViewType, extra?: { personId?: string; autoPlay?: boolean }) => {
    if (view === 'personnel' && extra) {
      setPersonnelNavState(extra);
    }
    setCurrentView(view);
  };

  const renderView = () => {
    switch (currentView) {
      case 'dashboard': return <Dashboard onExit={() => setCurrentView('projects')} onNavigate={handleNavigate} />;
      case 'projects': return <ProjectManagement />;
      case 'models': return <ShipModelManagement />;
      case 'personnel': return (
        <PersonnelTracking 
          initialPersonId={personnelNavState?.personId} 
          initialAutoPlay={personnelNavState?.autoPlay} 
        />
      );
      case 'personnel_mgmt': return (
        <PersonnelManagement 
          targetDeptId={targetDeptIdForPersonnel}
          onOpenUserManagement={(empId) => {
            setSelectedEmpForUserCreation(empId);
            setCurrentView('user_mgmt');
          }}
          onNavigateToTeams={() => setCurrentView('team_mgmt')}
        />
      );
      case 'overtime': return <OvertimeManagement onChangeView={(view) => setCurrentView(view)} />;
      case 'team_mgmt': return (
        <TeamManagement 
          onNavigateToPersonnel={(deptId) => {
            setTargetDeptIdForPersonnel(deptId);
            setCurrentView('personnel_mgmt');
          }}
        />
      );
      case 'tags': return (
        <TagManagement 
          onNavigateToPersonnel={() => setCurrentView('personnel_mgmt')}
        />
      );
      case 'user_mgmt': return (
        <UserManagement 
          onNavigateToPersonnel={() => setCurrentView('personnel_mgmt')}
          targetEmpId={selectedEmpForUserCreation}
        />
      );
      case 'fence': return <ElectronicFence />;
      case 'alarms': return <AlarmConfig />;
      case 'devices': return <DeviceManagement />;
      default: return <Dashboard />;
    }
  };

  const getViewTitle = () => {
    switch (currentView) {
      case 'dashboard': return '驾驶舱';
      case 'projects': return '项目管理';
      case 'models': return '航模管理';
      case 'personnel': return '人员定位';
      case 'personnel_mgmt': return '人员管理';
      case 'overtime': return '加班管理';
      case 'tags': return '定位标签管理';
      case 'team_mgmt': return '组织管理';
      case 'user_mgmt': return '用户管理';
      case 'fence': return '电子围栏';
      case 'alarms': return '告警配置';
      case 'devices': return '设备管理';
      default: return '智慧船厂';
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 text-slate-800 overflow-hidden font-sans">
      <Sidebar 
        currentView={currentView} 
        onChangeView={setCurrentView} 
        currentUser={currentUser}
        onLogout={onLogout}
      />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {currentView !== 'dashboard' && (
          <Header 
            title={getViewTitle()} 
            currentUser={currentUser}
            onLogout={onLogout}
          />
        )}
        <main className="flex-1 overflow-auto p-3">
          {renderView()}
        </main>
        <footer className="h-8 bg-white border-t border-slate-200 px-6 flex items-center justify-between text-[10px] text-slate-500 uppercase tracking-widest shrink-0 shadow-sm">
          <div>数据同步状态: 同步正常 (延时 24ms)</div>
          <div>© 2026 SHIPYARD CO., LTD. ALL RIGHTS RESERVED.</div>
        </footer>
      </div>
    </div>
  );
}
