
import React, { useState } from 'react';
import { Testimonial } from '../../types';
import Card from '../common/Card';
import Button from '../common/Button';
import Input from '../common/Input';
import Textarea from '../common/Textarea';
import * as api from '../../src/lib/neonApiService';


interface TestimonialsViewProps {
  testimonials: Testimonial[];
  onDataChange: () => void;
}

const TestimonialForm: React.FC<{ 
    testimonial: Omit<Testimonial, 'id'> & { id?: number }; 
    onSave: (t: Omit<Testimonial, 'id'> & { id?: number }) => void; 
    onCancel: () => void 
}> = ({ testimonial, onSave, onCancel }) => {
    const [formState, setFormState] = useState(testimonial);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormState(prev => ({ ...prev, [name]: value }));
    };

    return (
        <div className="space-y-4 mt-4 p-4 border-t">
            <Input label="Client Name" name="clientName" value={formState.clientName} onChange={handleChange} />
            <Input label="Client Role/Company" name="clientRole" value={formState.clientRole} onChange={handleChange} />
            <Textarea label="Quote" name="quote" value={formState.quote} onChange={handleChange} />
            <Input label="Image URL" name="imageUrl" value={formState.imageUrl} onChange={handleChange} />
            <div className="flex justify-end space-x-2">
                <Button variant="secondary" onClick={onCancel}>Cancel</Button>
                <Button onClick={() => onSave(formState)}>Save Testimonial</Button>
            </div>
        </div>
    );
}

const TestimonialsView: React.FC<TestimonialsViewProps> = ({ testimonials, onDataChange }) => {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  
  const handleSave = async (testimonial: Omit<Testimonial, 'id'> & { id?: number }) => {
    try {
        if (testimonial.id) {
            await api.updateTestimonial(testimonial.id, testimonial);
        } else {
            await api.addTestimonial(testimonial);
        }
        onDataChange();
        setEditingId(null);
        setIsAdding(false);
    } catch (error) {
        console.error("Failed to save testimonial:", error);
        alert("Could not save the testimonial.");
    }
  };

  const handleAddNew = () => {
    setEditingId(null);
    setIsAdding(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this testimonial?')) {
        try {
            await api.deleteTestimonial(id);
            onDataChange();
        } catch(error) {
            console.error("Failed to delete testimonial:", error);
            alert("Could not delete the testimonial.");
        }
    }
  };
  
  return (
    <Card title="Testimonials" actions={!isAdding && <Button onClick={handleAddNew}>+ Add Testimonial</Button>}>
        {isAdding && (
            <TestimonialForm 
                testimonial={{clientName: '', clientRole: '', quote: '', imageUrl: ''}}
                onSave={handleSave}
                onCancel={() => setIsAdding(false)}
            />
        )}
        <div className="space-y-4 mt-4">
            {testimonials.map(testimonial => (
                <div key={testimonial.id} className="p-4 border rounded-lg">
                    {editingId === testimonial.id ? (
                        <TestimonialForm 
                            testimonial={testimonial}
                            onSave={handleSave}
                            onCancel={() => setEditingId(null)}
                        />
                    ) : (
                        <div className="flex items-start justify-between">
                           <div className="flex items-start space-x-4">
                                <img src={testimonial.imageUrl} alt={testimonial.clientName} className="w-16 h-16 rounded-full object-cover"/>
                                <div>
                                    <h4 className="font-semibold">{testimonial.clientName}</h4>
                                    <p className="text-sm text-gray-500">{testimonial.clientRole}</p>
                                    <blockquote className="mt-2 text-sm text-gray-600 italic">"{testimonial.quote}"</blockquote>
                                </div>
                           </div>
                            <div className="space-x-2 flex-shrink-0">
                                <Button variant="secondary" onClick={() => setEditingId(testimonial.id)}>Edit</Button>
                                <Button variant="danger" onClick={() => handleDelete(testimonial.id)}>Delete</Button>
                            </div>
                        </div>
                    )}
                </div>
            ))}
        </div>
    </Card>
  );
};

export default TestimonialsView;
