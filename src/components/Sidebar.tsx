"use client";

import React from 'react';
import Link from 'next/link';
import { HiOutlineHome, HiOutlineDocument, HiOutlineCog } from 'react-icons/hi';
import { IoSettingsOutline } from 'react-icons/io5';

interface SidebarProps {
  isOpen: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen }) => {
  return (
    <div 
      className={`
        fixed top-0 left-0 h-full bg-white text-black pt-16
        transition-all duration-300 ease-in-out shadow-lg
        ${isOpen ? 'w-64' : 'w-0'}
        overflow-hidden
      `}
    >
      <div className="space-y-2 p-4">
        <Link 
          href="/dashboard"
          className="flex items-center space-x-3 px-6 py-3 hover:opacity-70 transition-opacity"
        >
          <HiOutlineHome size={22} />
          <span>Dashboard</span>
        </Link>
        
        <Link 
          href="/dashboard/pdfs"
          className="flex items-center space-x-3 px-6 py-3 hover:opacity-70 transition-opacity"
        >
          <HiOutlineDocument size={22} className="text-gray-600" />
          <span className="text-gray-600">Documents</span>
        </Link>

        <Link 
          href="/dashboard/settings"
          className="flex items-center space-x-3 px-6 py-3 hover:opacity-70 transition-opacity mt-auto"
        >
          <IoSettingsOutline size={22} />
          <span>Settings</span>
        </Link>
      </div>
    </div>
  );
};

export default Sidebar; 