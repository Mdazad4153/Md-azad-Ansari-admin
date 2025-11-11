
import React, { useState } from 'react';
import { SocialLink } from '../../types';
import Card from '../common/Card';
import Button from '../common/Button';
import Input from '../common/Input';
import * as api from '../../src/lib/neonApiService';

interface SocialsViewProps {
  links: SocialLink[];
  onDataChange: () => void;
}

const SocialsView: React.FC<SocialsViewProps> = ({ links, onDataChange }) => {
  const [newLinkForm, setNewLinkForm] = useState({ platform: '', url: '' });

  const handleApiCall = async (promise: Promise<any>) => {
    try {
      await promise;
      onDataChange();
    } catch (error) {
      console.error("API call failed:", error);
      alert("An error occurred. Please try again.");
    }
  };

  const handleChange = (id: number, field: 'platform' | 'url', value: string) => {
    const link = links.find(l => l.id === id);
    if (link) {
      handleApiCall(api.updateSocialLink(id, { ...link, [field]: value }));
    }
  };
  
  const addLink = () => {
    if (newLinkForm.platform && newLinkForm.url) {
      handleApiCall(api.addSocialLink(newLinkForm));
      setNewLinkForm({ platform: '', url: '' });
    } else {
      alert("Please fill in both Platform and URL.");
    }
  };
  
  const removeLink = (id: number) => {
    if (window.confirm("Are you sure you want to remove this link?")) {
      handleApiCall(api.deleteSocialLink(id));
    }
  };
  
  return (
    <Card title="Social Media Links">
      <div className="space-y-4">
        {links.map(link => (
          <div key={link.id} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end p-4 border rounded-lg">
            <div className="md:col-span-1">
              <Input
                label="Platform"
                id={`platform-${link.id}`}
                defaultValue={link.platform}
                onBlur={(e) => handleChange(link.id, 'platform', e.target.value)}
              />
            </div>
            <div className="md:col-span-2">
              <Input
                label="URL"
                id={`url-${link.id}`}
                defaultValue={link.url}
                onBlur={(e) => handleChange(link.id, 'url', e.target.value)}
              />
            </div>
             <div className="md:col-span-3 flex justify-end">
                <Button variant="danger" onClick={() => removeLink(link.id)}>Remove</Button>
            </div>
          </div>
        ))}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end p-4 border-t mt-4">
           <div className="md:col-span-1">
              <Input
                label="New Platform"
                id="new-platform"
                value={newLinkForm.platform}
                onChange={(e) => setNewLinkForm(p => ({ ...p, platform: e.target.value }))}
              />
            </div>
            <div className="md:col-span-2">
              <Input
                label="New URL"
                id="new-url"
                value={newLinkForm.url}
                onChange={(e) => setNewLinkForm(p => ({ ...p, url: e.target.value }))}
              />
            </div>
             <div className="md:col-span-3 flex justify-end">
                <Button variant="secondary" onClick={addLink}>+ Add Link</Button>
            </div>
        </div>
      </div>
    </Card>
  );
};

export default SocialsView;
