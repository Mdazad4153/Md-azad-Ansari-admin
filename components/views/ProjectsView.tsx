
import React, { useState } from 'react';
import { Project } from '../../types';
import Card from '../common/Card';
import Button from '../common/Button';
import Input from '../common/Input';
import Textarea from '../common/Textarea';
import { addProject, updateProject, deleteProject } from '../../src/lib/neonApiService';

interface ProjectsViewProps {
  projects: Project[];
  onDataChange: () => void; // Callback to re-fetch data
}

type ProjectFormData = Omit<Project, 'id'>;

const ProjectForm: React.FC<{ 
    initialData?: Project;
    onSave: (data: ProjectFormData, id?: number) => void; 
    onCancel: () => void 
}> = ({ initialData, onSave, onCancel }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [formState, setFormState] = useState<ProjectFormData>(initialData || {
        title: '',
        description: '',
        imageUrl: '',
        tags: [],
        demoUrl: '',
        repoUrl: '',
        isFeatured: false,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormState(prev => ({ ...prev, [name]: value }));
    };
    
    const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormState(prev => ({...prev, tags: e.target.value.split(',').map(tag => tag.trim())}));
    };

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormState(prev => ({...prev, isFeatured: e.target.checked}));
    };

    const handleSubmit = async () => {
        setIsLoading(true);
        setError(null);
        try {
            await onSave(formState, initialData?.id);
        } catch (err: any) {
            setError(err.message || 'Failed to save project');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-4 mt-4 p-4 border-t">
            {error && <p className="text-sm text-red-500">{error}</p>}
            <Input label="Title" name="title" value={formState.title} onChange={handleChange} required />
            <Textarea label="Description" name="description" value={formState.description} onChange={handleChange} />
            <Input label="Image URL" name="imageUrl" value={formState.imageUrl} onChange={handleChange} />
            <Input label="Tags (comma-separated)" name="tags" value={formState.tags.join(', ')} onChange={handleTagsChange} />
            <Input label="Demo URL" name="demoUrl" value={formState.demoUrl || ''} onChange={handleChange} />
            <Input label="Repo URL" name="repoUrl" value={formState.repoUrl || ''} onChange={handleChange} />
            <div className="flex items-center">
                <input type="checkbox" name="isFeatured" checked={formState.isFeatured} onChange={handleCheckboxChange} className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                <label className="ml-2 block text-sm text-gray-900">Featured Project</label>
            </div>
            <div className="flex justify-end space-x-2">
                <Button variant="secondary" onClick={onCancel} disabled={isLoading}>Cancel</Button>
                <Button onClick={handleSubmit} disabled={isLoading}>
                    {isLoading ? 'Saving...' : 'Save Project'}
                </Button>
            </div>
        </div>
    );
}

const ProjectsView: React.FC<ProjectsViewProps> = ({ projects, onDataChange }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const handleSave = async (data: ProjectFormData, id?: number) => {
    if (id) {
        await updateProject(id, data);
        alert('Project updated successfully!');
        setEditingId(null);
    } else {
        await addProject(data);
        alert('Project added successfully!');
        setIsAdding(false);
    }
    onDataChange();
  };
  
  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
        try {
            await deleteProject(id);
            alert('Project deleted.');
            onDataChange();
        } catch (error) {
            console.error(error);
            alert('Failed to delete project.');
        }
    }
  };

  return (
    <Card title="Projects" actions={!isAdding && <Button onClick={() => setIsAdding(true)}>+ Add Project</Button>}>
        {isAdding && (
            <ProjectForm 
                onSave={handleSave}
                onCancel={() => setIsAdding(false)}
            />
        )}
        <div className="space-y-4 mt-4">
            {projects.length > 0 ? projects.map(project => (
                <div key={project.id} className="p-4 border rounded-lg">
                    {editingId === project.id ? (
                        <ProjectForm
                            initialData={project}
                            onSave={handleSave}
                            onCancel={() => setEditingId(null)}
                        />
                    ) : (
                        <div className="flex items-center justify-between">
                            <div>
                               <h4 className="font-semibold">{project.title} {project.isFeatured && <span className="text-xs bg-yellow-200 text-yellow-800 px-2 py-1 rounded-full ml-2">Featured</span>}</h4>
                                <p className="text-sm text-gray-600">{project.description}</p>
                            </div>
                            <div className="space-x-2">
                                <Button variant="secondary" onClick={() => setEditingId(project.id)}>Edit</Button>
                                <Button variant="danger" onClick={() => handleDelete(project.id)}>Delete</Button>
                            </div>
                        </div>
                    )}
                </div>
            )) : <p className="text-gray-500">No projects found. Add one to get started!</p>}
        </div>
    </Card>
  );
};

export default ProjectsView;
