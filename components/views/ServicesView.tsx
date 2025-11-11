
import React, { useState } from 'react';
import { Service } from '../../types';
import Card from '../common/Card';
import Button from '../common/Button';
import Input from '../common/Input';
import Textarea from '../common/Textarea';
import * as api from '../../src/lib/neonApiService';

interface ServicesViewProps {
  services: Service[];
  onDataChange: () => void;
}

const ServiceForm: React.FC<{ 
    service: Omit<Service, 'id'> & { id?: number }; 
    onSave: (service: Omit<Service, 'id'> & { id?: number }) => void; 
    onCancel: () => void 
}> = ({ service, onSave, onCancel }) => {
    const [formState, setFormState] = useState(service);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormState(prev => ({ ...prev, [name]: value }));
    };

    return (
        <div className="space-y-4 mt-4 p-4 border-t">
            <Input label="Title" name="title" value={formState.title} onChange={handleChange} />
            <Textarea label="Description" name="description" value={formState.description} onChange={handleChange} />
            <Input label="Icon Name" name="icon" value={formState.icon} onChange={handleChange} placeholder="e.g., 'web', 'code'" />
            <div className="flex justify-end space-x-2">
                <Button variant="secondary" onClick={onCancel}>Cancel</Button>
                <Button onClick={() => onSave(formState)}>Save Service</Button>
            </div>
        </div>
    );
}

const ServicesView: React.FC<ServicesViewProps> = ({ services, onDataChange }) => {
  const [editingServiceId, setEditingServiceId] = useState<number | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  
  const handleSave = async (service: Omit<Service, 'id'> & { id?: number }) => {
    try {
        if (service.id) {
            await api.updateService(service.id, service);
        } else {
            await api.addService(service);
        }
        onDataChange();
        setEditingServiceId(null);
        setIsAdding(false);
    } catch (error) {
        console.error("Failed to save service:", error);
        alert("Could not save the service.");
    }
  };

  const handleAddNew = () => {
    setEditingServiceId(null);
    setIsAdding(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this service?')) {
        try {
            await api.deleteService(id);
            onDataChange();
        } catch(error) {
             console.error("Failed to delete service:", error);
            alert("Could not delete the service.");
        }
    }
  };
  
  return (
    <Card title="Services" actions={!isAdding && <Button onClick={handleAddNew}>+ Add Service</Button>}>
        {isAdding && (
            <ServiceForm 
                service={{id: undefined, title: '', description: '', icon: ''}}
                onSave={handleSave}
                onCancel={() => setIsAdding(false)}
            />
        )}
        <div className="space-y-4 mt-4">
            {services.map(service => (
                <div key={service.id} className="p-4 border rounded-lg">
                    {editingServiceId === service.id ? (
                        <ServiceForm 
                            service={service}
                            onSave={handleSave}
                            onCancel={() => setEditingServiceId(null)}
                        />
                    ) : (
                        <div className="flex items-center justify-between">
                            <div>
                               <h4 className="font-semibold">{service.title}</h4>
                                <p className="text-sm text-gray-600">{service.description}</p>
                            </div>
                            <div className="space-x-2">
                                <Button variant="secondary" onClick={() => setEditingServiceId(service.id)}>Edit</Button>
                                <Button variant="danger" onClick={() => handleDelete(service.id)}>Delete</Button>
                            </div>
                        </div>
                    )}
                </div>
            ))}
        </div>
    </Card>
  );
};

export default ServicesView;
