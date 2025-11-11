
import React from 'react';
import Card from '../common/Card';

interface DashboardViewProps {
  projectCount: number;
  skillCount: number;
  timelineCount: number;
  serviceCount: number;
  testimonialCount: number;
  contactCount: number;
}

// Fix: Replaced `JSX.Element` with `React.ReactElement` to resolve namespace issue.
const StatCard: React.FC<{ title: string; value: number | string; icon: React.ReactElement; color: string }> = ({ title, value, icon, color }) => (
  <div className="bg-white p-6 rounded-xl shadow-md flex items-center space-x-4">
    <div className={`p-3 rounded-full ${color}`}>
      {icon}
    </div>
    <div>
      <p className="text-sm font-medium text-gray-500">{title}</p>
      <p className="text-2xl font-bold text-gray-800">{value}</p>
    </div>
  </div>
);

const DashboardView: React.FC<DashboardViewProps> = ({ projectCount, skillCount, timelineCount, serviceCount, testimonialCount, contactCount }) => {
  return (
    <div className="space-y-8">
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <StatCard 
            title="Total Projects" 
            value={projectCount} 
            color="bg-blue-100 text-blue-600"
            icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>} 
          />
          <StatCard 
            title="Total Skills" 
            value={skillCount} 
            color="bg-green-100 text-green-600"
            icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>}
          />
          <StatCard 
            title="Timeline Events" 
            value={timelineCount} 
            color="bg-indigo-100 text-indigo-600"
            icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>}
          />
           <StatCard 
            title="Services Offered" 
            value={serviceCount} 
            color="bg-purple-100 text-purple-600"
            icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>} 
          />
           <StatCard 
            title="Testimonials" 
            value={testimonialCount} 
            color="bg-yellow-100 text-yellow-600"
            icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>}
          />
           <StatCard 
            title="New Messages" 
            value={contactCount} 
            color="bg-pink-100 text-pink-600"
            icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>}
          />
       </div>

      <Card title="Welcome to your Dashboard!">
        <p className="text-gray-600">
          This is your control center for managing your portfolio website. From here, you can update every section of your site, from the hero banner to your latest projects.
          <br /><br />
          Use the sidebar navigation to select a section to edit. Remember to save your changes. All updates are currently mocked and will not persist, but this interface is ready to be connected to your Neon backend.
        </p>
      </Card>
      
      <Card title="Quick Actions">
         <p className="text-gray-600">This section can contain shortcuts to common tasks, like adding a new project or skill. (Functionality to be added).</p>
      </Card>

    </div>
  );
};

export default DashboardView;
