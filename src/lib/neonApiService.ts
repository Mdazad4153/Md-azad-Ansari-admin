import { AboutData, ContactSubmission, HeroData, Project, Service, Skill, SkillCategory, SocialLink, Testimonial, TimelineEvent } from '../../types';

// The environment variables are hardcoded because this project doesn't have a build step
// to process a .env file. In a real-world scenario with Vite or Next.js,
// these would be loaded from process.env or import.meta.env.
export const API_ENDPOINT = "https://ep-bold-sea-aegb739d.apirest.c-2.us-east-2.aws.neon.tech/rest/v1";
export const PUBLISHABLE_KEY = "pk_sq2grgrv20rwnjthf1xf01k3oy6ndybvnd8zcd";

if (!API_ENDPOINT || !PUBLISHABLE_KEY) {
  // This check is now somewhat redundant but good for safety.
  throw new Error("Neon API credentials are not set!");
}

// --- UTILITY FUNCTIONS ---

const getHeaders = (preferReturn = 'representation') => {
  return {
    'apikey': PUBLISHABLE_KEY,
    'Content-Type': 'application/json',
    'Prefer': `return=${preferReturn}`,
  };
};

const handleResponse = async (response: Response) => {
    if (!response.ok) {
        let errorMsg = `API request failed with status ${response.status}`;
        try {
            const errorData = await response.json();
            errorMsg = `Error ${errorData.code || response.status}: ${errorData.message || JSON.stringify(errorData)}`;
        } catch (e) {
            errorMsg = `API request failed: ${response.status} ${response.statusText}`;
        }
        throw new Error(errorMsg);
    }
    if (response.status === 204 || response.headers.get('content-length') === '0') {
        return null;
    }
    return response.json();
};

const apiRequest = async (path: string, options: RequestInit) => {
    const response = await fetch(`${API_ENDPOINT}${path}`, options);
    return handleResponse(response);
};

// --- API FUNCTIONS ---

// HERO SECTION (singleton, assumes id=1)
export const getHeroData = async (): Promise<HeroData> => {
    const data = await apiRequest('/hero?limit=1', { headers: getHeaders() });
    return data.length ? data[0] : { greeting: "Hi, I'm", name: "Your Name", title: "Your Title", subtitle: "Your subtitle" };
};

export const updateHeroData = (data: HeroData) => apiRequest('/hero?id=eq.1', {
    method: 'PATCH',
    headers: getHeaders('minimal'),
    body: JSON.stringify(data)
});

// ABOUT SECTION (singleton, assumes id=1)
export const getAboutData = async (): Promise<AboutData> => {
    const data = await apiRequest('/about?limit=1', { headers: getHeaders() });
    const about = data.length ? data[0] : { imageUrl: '', description: '', infoItems: [] };
    return { ...about, imageUrl: about.image_url, infoItems: about.info_items };
};

export const updateAboutData = (data: AboutData) => apiRequest('/about?id=eq.1', {
    method: 'PATCH',
    headers: getHeaders('minimal'),
    body: JSON.stringify({ image_url: data.imageUrl, description: data.description, info_items: data.infoItems })
});

// SKILLS
export const getSkillCategories = (): Promise<SkillCategory[]> => apiRequest('/skill_categories?select=*,skills(*)', { headers: getHeaders() });
export const addSkillCategory = (data: { name: string }) => apiRequest('/skill_categories', { method: 'POST', headers: getHeaders(), body: JSON.stringify(data) });
export const updateSkillCategory = (id: number, data: { name: string }) => apiRequest(`/skill_categories?id=eq.${id}`, { method: 'PATCH', headers: getHeaders('minimal'), body: JSON.stringify(data) });
export const deleteSkillCategory = (id: number) => apiRequest(`/skill_categories?id=eq.${id}`, { method: 'DELETE', headers: getHeaders('minimal') });

export const addSkill = (data: Omit<Skill, 'id'>) => apiRequest('/skills', { method: 'POST', headers: getHeaders(), body: JSON.stringify({ ...data, is_learning: data.isLearning }) });
export const updateSkill = (id: number, data: Partial<Skill>) => apiRequest(`/skills?id=eq.${id}`, { method: 'PATCH', headers: getHeaders('minimal'), body: JSON.stringify({ ...data, is_learning: data.isLearning }) });
export const deleteSkill = (id: number) => apiRequest(`/skills?id=eq.${id}`, { method: 'DELETE', headers: getHeaders('minimal') });

// PROJECTS
export const getProjects = async (): Promise<Project[]> => {
    const data = await apiRequest('/projects?order=id.asc', { headers: getHeaders() });
    return data.map((p: any) => ({
        id: p.id, title: p.title, description: p.description, imageUrl: p.image_url,
        tags: Array.isArray(p.tags) ? p.tags : [], demoUrl: p.demo_url, repoUrl: p.repo_url, isFeatured: p.is_featured,
    }));
};
const projectToApi = (project: Omit<Project, 'id'>) => ({
    title: project.title, description: project.description, image_url: project.imageUrl,
    tags: project.tags, demo_url: project.demoUrl, repo_url: project.repoUrl, is_featured: project.isFeatured,
});
export const addProject = (project: Omit<Project, 'id'>) => apiRequest('/projects', { method: 'POST', headers: getHeaders(), body: JSON.stringify(projectToApi(project)) });
export const updateProject = (id: number, project: Omit<Project, 'id'>) => apiRequest(`/projects?id=eq.${id}`, { method: 'PATCH', headers: getHeaders('minimal'), body: JSON.stringify(projectToApi(project)) });
export const deleteProject = (id: number) => apiRequest(`/projects?id=eq.${id}`, { method: 'DELETE', headers: getHeaders('minimal') });


// TIMELINE
export const getTimelineEvents = (): Promise<TimelineEvent[]> => apiRequest('/timeline_events?order=year.desc', { headers: getHeaders() });
export const addTimelineEvent = (event: Omit<TimelineEvent, 'id'>) => apiRequest('/timeline_events', { method: 'POST', headers: getHeaders(), body: JSON.stringify(event) });
export const updateTimelineEvent = (id: number, event: Omit<TimelineEvent, 'id'>) => apiRequest(`/timeline_events?id=eq.${id}`, { method: 'PATCH', headers: getHeaders('minimal'), body: JSON.stringify(event) });
export const deleteTimelineEvent = (id: number) => apiRequest(`/timeline_events?id=eq.${id}`, { method: 'DELETE', headers: getHeaders('minimal') });

// SOCIAL LINKS
export const getSocialLinks = (): Promise<SocialLink[]> => apiRequest('/social_links?order=id.asc', { headers: getHeaders() });
export const addSocialLink = (link: Omit<SocialLink, 'id'>) => apiRequest('/social_links', { method: 'POST', headers: getHeaders(), body: JSON.stringify(link) });
export const updateSocialLink = (id: number, link: Omit<SocialLink, 'id'>) => apiRequest(`/social_links?id=eq.${id}`, { method: 'PATCH', headers: getHeaders('minimal'), body: JSON.stringify(link) });
export const deleteSocialLink = (id: number) => apiRequest(`/social_links?id=eq.${id}`, { method: 'DELETE', headers: getHeaders('minimal') });

// SERVICES
export const getServices = (): Promise<Service[]> => apiRequest('/services?order=id.asc', { headers: getHeaders() });
export const addService = (service: Omit<Service, 'id'>) => apiRequest('/services', { method: 'POST', headers: getHeaders(), body: JSON.stringify(service) });
export const updateService = (id: number, service: Omit<Service, 'id'>) => apiRequest(`/services?id=eq.${id}`, { method: 'PATCH', headers: getHeaders('minimal'), body: JSON.stringify(service) });
export const deleteService = (id: number) => apiRequest(`/services?id=eq.${id}`, { method: 'DELETE', headers: getHeaders('minimal') });

// TESTIMONIALS
const testimonialFromApi = (t: any) => ({
    id: t.id, clientName: t.client_name, clientRole: t.client_role, quote: t.quote, imageUrl: t.image_url
});
const testimonialToApi = (t: Partial<Omit<Testimonial, 'id'>>) => ({
    client_name: t.clientName, client_role: t.clientRole, quote: t.quote, image_url: t.imageUrl
});
export const getTestimonials = async (): Promise<Testimonial[]> => {
    const data = await apiRequest('/testimonials?order=id.asc', { headers: getHeaders() });
    return data.map(testimonialFromApi);
};
export const addTestimonial = (testimonial: Omit<Testimonial, 'id'>) => apiRequest('/testimonials', { method: 'POST', headers: getHeaders(), body: JSON.stringify(testimonialToApi(testimonial)) });
export const updateTestimonial = (id: number, testimonial: Partial<Omit<Testimonial, 'id'>>) => apiRequest(`/testimonials?id=eq.${id}`, { method: 'PATCH', headers: getHeaders('minimal'), body: JSON.stringify(testimonialToApi(testimonial)) });
export const deleteTestimonial = (id: number) => apiRequest(`/testimonials?id=eq.${id}`, { method: 'DELETE', headers: getHeaders('minimal') });

// CONTACT SUBMISSIONS
const submissionFromApi = (s: any) => ({ ...s, receivedAt: s.received_at });
export const getContactSubmissions = async (): Promise<ContactSubmission[]> => {
    const data = await apiRequest('/contact_submissions?order=received_at.desc', { headers: getHeaders() });
    return data.map(submissionFromApi);
};
export const deleteContactSubmission = (id: number) => apiRequest(`/contact_submissions?id=eq.${id}`, { method: 'DELETE', headers: getHeaders('minimal') });