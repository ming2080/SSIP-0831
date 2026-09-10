/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Layout } from './components/layout/Layout';
import { Login } from './components/views/Login';

export interface UserSession {
  username: string;
  role: string;
  name: string;
}

export default function App() {
  const [currentUser, setCurrentUser] = useState<UserSession | null>(() => {
    try {
      const saved = localStorage.getItem('shipyard_session_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // 全局退出登录事件监听，方便跨组件解耦通信
  useEffect(() => {
    const handleGlobalLogout = () => {
      handleLogout();
    };
    window.addEventListener('app_logout', handleGlobalLogout);
    return () => window.removeEventListener('app_logout', handleGlobalLogout);
  }, []);

  const handleLogin = (userInfo?: UserSession) => {
    const user = userInfo || { 
      username: 'admin', 
      role: '系统管理员', 
      name: '张工 (系统管理员)' 
    };
    setCurrentUser(user);
    try {
      localStorage.setItem('shipyard_session_user', JSON.stringify(user));
    } catch {
      // ignore
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    try {
      localStorage.removeItem('shipyard_session_user');
    } catch {
      // ignore
    }
  };

  // 未登录时展示参考设计图打造的精美登录页
  if (!currentUser) {
    return <Login onLogin={handleLogin} />;
  }

  // 已登录进入主系统
  return (
    <Layout 
      currentUser={currentUser} 
      onLogout={handleLogout} 
    />
  );
}
