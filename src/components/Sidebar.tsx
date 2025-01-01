"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { HiOutlineHome, HiOutlineDocument, HiOutlineCog } from 'react-icons/hi';
import { IoSettingsOutline } from 'react-icons/io5';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, setIsOpen }) => {
  const pathname = usePathname();

  const handleLinkClick = () => {
    if (window.innerWidth < 768) {
      setIsOpen(false);
    }
  };

  const isLinkActive = (path: string) => {
    return pathname === path;
  };

  return (
    <div 
      className={`
        fixed top-0 left-0 h-full bg-white dark:bg-gray-900 text-black dark:text-white pt-16
        transition-all duration-300 ease-in-out shadow-lg dark:shadow-gray-900/30
        ${isOpen ? 'w-64' : 'w-0'}
        overflow-hidden z-40
      `}
    >
      <div className="space-y-2 p-4">
        <Link 
          href="/dashboard"
          onClick={handleLinkClick}
          className={`flex items-center space-x-3 px-6 py-3 rounded-lg transition-all
            ${isLinkActive('/dashboard') 
              ? 'bg-gray-100 dark:bg-gray-800 text-black dark:text-white' 
              : 'hover:bg-gray-50 dark:hover:bg-gray-800/50 text-gray-600 dark:text-gray-400'
            }`}
        >
          <HiOutlineHome size={22} />
          <span>Dashboard</span>
        </Link>
        
        <Link 
          href="/dashboard/pdfs"
          onClick={handleLinkClick}
          className={`flex items-center space-x-3 px-6 py-3 rounded-lg transition-all
            ${isLinkActive('/dashboard/pdfs')
              ? 'bg-gray-100 dark:bg-gray-800 text-black dark:text-white'
              : 'hover:bg-gray-50 dark:hover:bg-gray-800/50 text-gray-600 dark:text-gray-400'
            }`}
        >
          <HiOutlineDocument size={22} />
          <span>Documents</span>
        </Link>

        <Link 
          href="/dashboard/settings"
          onClick={handleLinkClick}
          className={`flex items-center space-x-3 px-6 py-3 rounded-lg transition-all
            ${isLinkActive('/dashboard/settings')
              ? 'bg-gray-100 dark:bg-gray-800 text-black dark:text-white'
              : 'hover:bg-gray-50 dark:hover:bg-gray-800/50 text-gray-600 dark:text-gray-400'
            }`}
        >
          <IoSettingsOutline size={22} />
          <span>Settings</span>
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;