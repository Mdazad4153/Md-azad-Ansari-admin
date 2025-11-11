
import React, { useState, useEffect } from 'react';
import { HeroData, AboutData, SkillCategory, Project, TimelineEvent, SocialLink, ViewType, Service, Testimonial, ContactSubmission } from './types';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import DashboardView from './components/views/DashboardView';
import HeroView from './components/views/HeroView';
import AboutView from './components/views/AboutView';
import SkillsView from './components/views/SkillsView';
import ProjectsView from './components/views/ProjectsView';
import TimelineView from './components/views/TimelineView';
import SocialsView from './components/views/SocialsView';
import ServicesView from './components/views/ServicesView';
import TestimonialsView from './components/views/TestimonialsView';
import ContactView from './components/views/ContactView';
import LoginView from './components/views/LoginView';
import * as api from './src/lib/neonApiService';

const AUTH_TOKEN_KEY = 'neon-auth-token';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!localStorage.getItem(AUTH_TOKEN_KEY));
  const [activeView, setActiveView] = useState<ViewType>('dashboard');
  const [isLoading, setIsLoading] = useState(true);

  // Data states
  const [heroData, setHeroData] = useState<HeroData | null>(null);
  const [aboutData, setAboutData] = useState<AboutData | null>(null);
  const [skillCategories, setSkillCategories] = useState<SkillCategory[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [timeline, setTimeline] = useState<TimelineEvent[]>([]);
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [contactSubmissions, setContactSubmissions] = useState<ContactSubmission[]>([]);

  // Data fetching functions
  const fetchData = async () => {
    setIsLoading(true);
    try {
      await Promise.all([
        fetchHeroData(),
        fetchAboutData(),
        fetchSkillCategories(),
        fetchProjects(),
        fetchTimeline(),
        fetchSocialLinks(),
        fetchServices(),
        fetchTestimonials(),
        fetchContactSubmissions(),
      ]);
    } catch (error) {
      console.error("Error fetching initial data:", error);
      alert("Could not load all data. Check the console for details.");
    } finally {
      setIsLoading(false);
    }
  };
  
  const fetchHeroData = async () => setHeroData(await api.getHeroData());
  const fetchAboutData = async () => setAboutData(await api.getAboutData());
  const fetchSkillCategories = async () => setSkillCategories(await api.getSkillCategories());
  const fetchProjects = async () => setProjects(await api.getProjects());
  const fetchTimeline = async () => setTimeline(await api.getTimelineEvents());
  const fetchSocialLinks = async () => setSocialLinks(await api.getSocialLinks());
  const fetchServices = async () => setServices(await api.getServices());
  const fetchTestimonials = async () => setTestimonials(await api.getTestimonials());
  const fetchContactSubmissions = async () => setContactSubmissions(await api.getContactSubmissions());

  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
    } else {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  const handleLoginSuccess = (token: string) => {
    localStorage.setItem(AUTH_TOKEN_KEY, token);
    setIsAuthenticated(true);
    setActiveView('dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return <LoginView onLoginSuccess={handleLoginSuccess} />;
  }
  
  const renderView = () => {
    if (isLoading) {
      return <div className="flex justify-center items-center h-full"><p>Loading your data...</p></div>;
    }

    switch (activeView) {
      case 'dashboard':
        return <DashboardView 
                  projectCount={projects.length} 
                  skillCount={skillCategories.reduce((acc, cat) => acc + cat.skills.length, 0)} 
                  timelineCount={timeline.length}
                  serviceCount={services.length}
                  testimonialCount={testimonials.length}
                  contactCount={contactSubmissions.length} 
                />;
      case 'hero':
        return heroData ? <HeroView data={heroData} onSave={fetchHeroData} /> : <p>Loading Hero data...</p>;
      case 'about':
        return aboutData ? <AboutView data={aboutData} onSave={fetchAboutData} /> : <p>Loading About data...</p>;
      case 'skills':
        return <SkillsView categories={skillCategories} onDataChange={fetchSkillCategories} />;
      case 'projects':
        return <ProjectsView projects={projects} onDataChange={fetchProjects} />;
      case 'timeline':
        return <TimelineView events={timeline} onDataChange={fetchTimeline} />;
       case 'socials':
        return <SocialsView links={socialLinks} onDataChange={fetchSocialLinks} />;
      case 'services':
        return <ServicesView services={services} onDataChange={fetchServices} />;
      case 'testimonials':
        return <TestimonialsView testimonials={testimonials} onDataChange={fetchTestimonials} />;
      case 'contact':
        return <ContactView submissions={contactSubmissions} onDataChange={fetchContactSubmissions} />;
      default:
        return <DashboardView projectCount={projects.length} skillCount={0} timelineCount={0} serviceCount={0} testimonialCount={0} contactCount={0} />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar activeView={activeView} setActiveView={setActiveView} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header view={activeView} onLogout={handleLogout} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6 md:p-8">
          {renderView()}
        </main>
      </div>
    </div>
  );
};

export default App;
