
import React, { useState, useEffect } from 'react';
import { HeroData } from '../../types';
import Card from '../common/Card';
import Input from '../common/Input';
import Button from '../common/Button';
import { updateHeroData } from '../../src/lib/neonApiService';


interface HeroViewProps {
  data: HeroData;
  onSave: () => void;
}

const HeroView: React.FC<HeroViewProps> = ({ data, onSave }) => {
  const [formData, setFormData] = useState<HeroData>(data);
  const [isDirty, setIsDirty] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setFormData(data);
    setIsDirty(false);
  }, [data]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setIsDirty(true);
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      await updateHeroData(formData);
      onSave(); // This will re-fetch data in App.tsx
      setIsDirty(false);
      alert('Hero section saved successfully!');
    } catch (error) {
      console.error("Failed to save hero data:", error);
      alert("Error: Could not save hero section.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card title="Edit Hero Section">
      <div className="space-y-4">
        <Input label="Greeting" id="greeting" name="greeting" value={formData.greeting} onChange={handleChange} />
        <Input label="Name" id="name" name="name" value={formData.name} onChange={handleChange} />
        <Input label="Title" id="title" name="title" value={formData.title} onChange={handleChange} />
        <Input label="Subtitle" id="subtitle" name="subtitle" value={formData.subtitle} onChange={handleChange} />
      </div>
      <div className="mt-6 flex justify-end">
        <Button onClick={handleSave} disabled={!isDirty || isLoading}>
          {isLoading ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
    </Card>
  );
};

export default HeroView;
