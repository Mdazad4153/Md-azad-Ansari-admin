
import React, { useState } from 'react';
import { TimelineEvent } from '../../types';
import Card from '../common/Card';
import Button from '../common/Button';
import Input from '../common/Input';
import Textarea from '../common/Textarea';
import * as api from '../../src/lib/neonApiService';

interface TimelineViewProps {
  events: TimelineEvent[];
  onDataChange: () => void;
}

const TimelineEventForm: React.FC<{ 
    event: Omit<TimelineEvent, 'id'> & { id?: number }; 
    onSave: (event: Omit<TimelineEvent, 'id'> & { id?: number }) => void; 
    onCancel: () => void 
}> = ({ event, onSave, onCancel }) => {
    const [formState, setFormState] = useState(event);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormState(prev => ({ ...prev, [name]: value }));
    };

    return (
        <div className="space-y-4 mt-4 p-4 border-t">
            <Input label="Year" name="year" value={formState.year} onChange={handleChange} />
            <Input label="Title" name="title" value={formState.title} onChange={handleChange} />
            <Textarea label="Description" name="description" value={formState.description} onChange={handleChange} />
            <div className="flex justify-end space-x-2">
                <Button variant="secondary" onClick={onCancel}>Cancel</Button>
                <Button onClick={() => onSave(formState)}>Save Event</Button>
            </div>
        </div>
    );
}

const TimelineView: React.FC<TimelineViewProps> = ({ events, onDataChange }) => {
  const [editingEventId, setEditingEventId] = useState<number | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  const handleSave = async (event: Omit<TimelineEvent, 'id'> & { id?: number }) => {
    try {
        if (event.id) {
            await api.updateTimelineEvent(event.id, event);
        } else {
            await api.addTimelineEvent(event);
        }
        onDataChange();
        setEditingEventId(null);
        setIsAdding(false);
    } catch (error) {
        console.error("Failed to save timeline event:", error);
        alert("Could not save the event.");
    }
  };
  
  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
        try {
            await api.deleteTimelineEvent(id);
            onDataChange();
        } catch(error) {
            console.error("Failed to delete timeline event:", error);
            alert("Could not delete the event.");
        }
    }
  };

  const handleAddNew = () => {
    setEditingEventId(null);
    setIsAdding(true);
  };

  return (
    <Card title="Timeline Events" actions={!isAdding && <Button onClick={handleAddNew}>+ Add Event</Button>}>
        {isAdding && (
            <TimelineEventForm 
                event={{ year: '', title: '', description: '', icon: 'default'}}
                onSave={handleSave}
                onCancel={() => setIsAdding(false)}
            />
        )}
        <div className="space-y-4 mt-4">
            {events.map(event => (
                <div key={event.id} className="p-4 border rounded-lg">
                    {editingEventId === event.id ? (
                        <TimelineEventForm 
                            event={event}
                            onSave={handleSave}
                            onCancel={() => setEditingEventId(null)}
                        />
                    ) : (
                        <div className="flex items-center justify-between">
                            <div>
                                <h4 className="font-semibold">{event.year} - {event.title}</h4>
                                <p className="text-sm text-gray-600">{event.description}</p>
                            </div>
                            <div className="space-x-2">
                                <Button variant="secondary" onClick={() => setEditingEventId(event.id)}>Edit</Button>
                                <Button variant="danger" onClick={() => handleDelete(event.id)}>Delete</Button>
                            </div>
                        </div>
                    )}
                </div>
            ))}
        </div>
    </Card>
  );
};

export default TimelineView;
