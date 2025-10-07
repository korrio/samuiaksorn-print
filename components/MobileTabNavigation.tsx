"use client"

import React from 'react';
import { cn } from '@/lib/utils';

export interface TabItem {
  id: string;
  label: string;
  icon: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  component: React.ComponentType<any>;
}

interface MobileTabNavigationProps {
  tabs: TabItem[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  componentProps?: any;
}

export default function MobileTabNavigation({
  tabs,
  activeTab,
  onTabChange,
  componentProps = {}
}: MobileTabNavigationProps) {
  const ActiveComponent = tabs.find(tab => tab.id === activeTab)?.component;

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto">
        {ActiveComponent && <ActiveComponent {...componentProps} />}
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-2 py-2 safe-area-pb">
        <div className="flex justify-around items-center max-w-md mx-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={cn(
                "flex flex-col items-center justify-center py-2 px-3 rounded-lg transition-colors min-w-0 flex-1 max-w-[80px]",
                activeTab === tab.id
                  ? "bg-blue-50 text-blue-600"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              )}
            >
              <div className="text-xl mb-1">{tab.icon}</div>
              <span className={cn(
                "text-xs font-medium truncate w-full text-center",
                activeTab === tab.id ? "text-blue-600" : "text-gray-600"
              )}>
                {tab.label}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}