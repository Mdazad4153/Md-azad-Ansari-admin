
import React, { useState, useEffect } from 'react';
import { AboutData, InfoItem } from '../../types';
import Card from '../common/Card';
import Input from '../common/Input';
import Textarea from '../common/Textarea';
import Button from '../common/Button';
import { updateAboutData } from '../../src/lib/neonApiService';

interface AboutViewProps {
  data: AboutData;
  onSave: () => void;
}

const AboutView: React.FC<AboutViewProps> = ({ data, onSave }) => {
  const [formData, setFormData] = useState<AboutData>(data);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setFormData(data);
  }, [data]);

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleInfoItemChange = (id: string, field: keyof InfoItem, value: string) => {
    const updatedItems = formData.infoItems.map(item =>
      item.id === id ? { ...item, [field]: value } : item
    );
    setFormData({ ...formData, infoItems: updatedItems });
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      await updateAboutData(formData);
      onSave();
      alert('About section saved!');
    } catch (error) {
       console.error("Failed to save about data:", error);
       alert("Error: Could not save about section.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card title="Edit Main Information">
        <div className="space-y-4">
          <Input label="Image URL" id="imageUrl" name="imageUrl" value={formData.imageUrl} onChange={handleTextChange} />
          <Textarea label="Description" id="description" name="description" value={formData.description} onChange={handleTextChange} />
        </div>
      </Card>
      <Card title="Edit Info Items">
        <div className="space-y-4">
          {formData.infoItems.map(item => (
            <div key={item.id} className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-lg">
              <Input 
                label="Label" 
                id={`label-${item.id}`} 
                value={item.label} 
                onChange={(e) => handleInfoItemChange(item.id, 'label', e.target.value)}
              />
              <Input 
                label="Value" 
                id={`value-${item.id}`} 
                value={item.value} 
                onChange={(e) => handleInfoItemChange(item.id, 'value', e.target.value)}
              />
            </div>
          ))}
        </div>
      </Card>
       <div className="flex justify-end mt-6">
        <Button onClick={handleSave} disabled={isLoading}>
          {isLoading ? 'Saving...' : 'Save All Changes'}
        </Button>
      </div>
    </div>
  );
};

export default AboutView;
