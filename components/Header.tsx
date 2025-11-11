
import React from 'react';
import { ViewType } from '../types';

interface HeaderProps {
  view: ViewType;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ view, onLogout }) => {
  const viewTitles: { [key in ViewType]: string } = {
    dashboard: 'Dashboard Overview',
    hero: 'Manage Hero Section',
    about: 'Manage About Section',
    skills: 'Manage Skills',
    projects: 'Manage Projects',
    timeline: 'Manage Timeline',
    socials: 'Manage Social Links',
    services: 'Manage Services',
    testimonials: 'Manage Testimonials',
    contact: 'Contact Form Submissions',
  };

  return (
    <header className="flex items-center justify-between h-16 px-6 bg-white border-b border-gray-200">
      <h2 className="text-lg font-semibold text-gray-800">{viewTitles[view]}</h2>
      <div className="flex items-center space-x-4">
        <button className="relative p-2 text-gray-500 rounded-full hover:bg-gray-100 hover:text-gray-600 focus:outline-none focus:ring">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
        </button>
        <div className="flex items-center">
          <img
            className="h-9 w-9 rounded-full object-cover"
            src="https://picsum.photos/id/237/100/100"
            alt="Your avatar"
          />
          <span className="ml-3 text-sm font-medium hidden sm:block">MD Azad Ansari</span>
        </div>
        <button 
          onClick={onLogout} 
          className="p-2 text-gray-500 rounded-md hover:bg-gray-100 hover:text-gray-600 focus:outline-none focus:ring"
          aria-label="Logout"
        >
           <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
           </svg>
        </button>
      </div>
    </header>
  );
};

export default Header;
