
export interface HeroData {
  greeting: string;
  name: string;
  title: string;
  subtitle: string;
}

export interface AboutData {
  imageUrl: string;
  description: string;
  infoItems: InfoItem[];
}

export interface InfoItem {
  id: string;
  icon: string;
  label: string;
  value: string;
}

export interface Skill {
  id: number;
  name: string;
  isLearning: boolean;
  category_id: number;
}

export interface SkillCategory {
  id: number;
  name: string;
  skills: Skill[];
}

export interface Project {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  tags: string[];
  demoUrl?: string;
  repoUrl?: string;
  isFeatured: boolean;
}

export interface TimelineEvent {
  id: number;
  year: string;
  title: string;
  description: string;
  icon: string;
}

export interface SocialLink {
  id: number;
  platform: string;
  url: string;
}

export interface Service {
  id: number;
  icon: string; // e.g., 'web-design', 'development'
  title: string;
  description: string;
}

export interface Testimonial {
  id: number;
  clientName: string;
  clientRole: string; // e.g., 'CEO, Tech Corp'
  quote: string;
  imageUrl: string;
}

export interface ContactSubmission {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  receivedAt: string; // ISO date string
}


export type ViewType = 'dashboard' | 'hero' | 'about' | 'skills' | 'projects' | 'timeline' | 'socials' | 'services' | 'testimonials' | 'contact';