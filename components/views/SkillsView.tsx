
import React, { useState } from 'react';
import { Skill, SkillCategory } from '../../types';
import Card from '../common/Card';
import Button from '../common/Button';
import Input from '../common/Input';
import * as api from '../../src/lib/neonApiService';

interface SkillsViewProps {
  categories: SkillCategory[];
  onDataChange: () => void;
}

const SkillsView: React.FC<SkillsViewProps> = ({ categories, onDataChange }) => {
  const [newSkillName, setNewSkillName] = useState<Record<number, string>>({});

  const handleApiCall = async (promise: Promise<any>) => {
    try {
      await promise;
      onDataChange();
    } catch (error) {
      console.error("API call failed:", error);
      alert("An error occurred. Please try again.");
    }
  };

  const addCategory = () => {
    const name = prompt("Enter new category name:");
    if (name) {
      handleApiCall(api.addSkillCategory({ name }));
    }
  };

  const removeCategory = (catId: number) => {
    if (window.confirm('Are you sure you want to delete this entire category and all its skills?')) {
      handleApiCall(api.deleteSkillCategory(catId));
    }
  };

  const handleCategoryNameChange = (catId: number, newName: string) => {
    handleApiCall(api.updateSkillCategory(catId, { name: newName }));
  };
  
  const handleSkillUpdate = (skill: Skill, field: 'name' | 'isLearning', value: string | boolean) => {
     handleApiCall(api.updateSkill(skill.id, { ...skill, [field]: value }));
  };

  const addSkill = (catId: number) => {
    const name = newSkillName[catId] || '';
    if (name.trim()) {
      handleApiCall(api.addSkill({ name, isLearning: false, category_id: catId }));
      setNewSkillName(prev => ({...prev, [catId]: ''}));
    } else {
      alert("Please enter a skill name.");
    }
  };
  
  const removeSkill = (skillId: number) => {
    if (window.confirm('Are you sure you want to delete this skill?')) {
      handleApiCall(api.deleteSkill(skillId));
    }
  };

  const handleNewSkillNameChange = (catId: number, name: string) => {
    setNewSkillName(prev => ({...prev, [catId]: name}));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
         <Button onClick={addCategory}>+ Add Category</Button>
      </div>
      {categories.map(category => (
        <Card 
          key={category.id} 
          title={category.name}
          actions={<Button variant="danger" onClick={() => removeCategory(category.id)}>Delete Category</Button>}
        >
          <div className="space-y-4">
             <Input 
                label="Category Name"
                id={`cat-name-${category.id}`}
                defaultValue={category.name}
                onBlur={(e) => handleCategoryNameChange(category.id, e.target.value)}
            />
            {category.skills.map(skill => (
              <div key={skill.id} className="flex items-center space-x-4 p-2 border-b">
                <div className="flex-1">
                  <Input 
                    label="Skill Name"
                    id={`skill-name-${skill.id}`}
                    defaultValue={skill.name}
                    onBlur={(e) => handleSkillUpdate(skill, 'name', e.target.value)}
                  />
                </div>
                <div className="flex items-center pt-6">
                  <input
                    type="checkbox"
                    id={`learning-${skill.id}`}
                    checked={skill.isLearning}
                    onChange={(e) => handleSkillUpdate(skill, 'isLearning', e.target.checked)}
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor={`learning-${skill.id}`} className="ml-2 block text-sm text-gray-900">
                    Learning
                  </label>
                </div>
                <Button variant="danger" className="self-end" onClick={() => removeSkill(skill.id)}>
                   Remove
                </Button>
              </div>
            ))}
             <div className="pt-4 flex items-end space-x-2">
                <Input
                  label="New Skill Name"
                  id={`new-skill-${category.id}`}
                  value={newSkillName[category.id] || ''}
                  onChange={(e) => handleNewSkillNameChange(category.id, e.target.value)}
                />
                <Button variant="secondary" onClick={() => addSkill(category.id)}>+ Add Skill</Button>
             </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default SkillsView;
