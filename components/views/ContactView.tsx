
import React, { useState } from 'react';
import { ContactSubmission } from '../../types';
import Card from '../common/Card';
import Button from '../common/Button';
import { deleteContactSubmission } from '../../src/lib/neonApiService';

interface ContactViewProps {
  submissions: ContactSubmission[];
  onDataChange: () => void;
}

const ContactView: React.FC<ContactViewProps> = ({ submissions, onDataChange }) => {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  
  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this message?')) {
        try {
            await deleteContactSubmission(id);
            setSelectedId(null);
            onDataChange();
        } catch(error) {
            console.error(error);
            alert("Failed to delete message.");
        }
    }
  };

  const selectedSubmission = submissions.find(s => s.id === selectedId);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-1">
        <Card title="Inbox">
            <div className="space-y-2">
                {submissions.length > 0 ? submissions.map(sub => (
                    <button 
                        key={sub.id} 
                        onClick={() => setSelectedId(sub.id)}
                        className={`w-full text-left p-3 rounded-lg transition-colors ${selectedId === sub.id ? 'bg-blue-100' : 'hover:bg-gray-100'}`}
                    >
                        <p className="font-semibold text-gray-800">{sub.name}</p>
                        <p className="text-sm text-gray-600 truncate">{sub.subject}</p>
                        <p className="text-xs text-gray-400 mt-1">{new Date(sub.receivedAt).toLocaleString()}</p>
                    </button>
                )) : (
                    <p className="text-gray-500 text-sm p-3">No messages yet.</p>
                )}
            </div>
        </Card>
      </div>
      <div className="lg:col-span-2">
        <Card title="Message Details">
            {selectedSubmission ? (
                <div className="space-y-4">
                    <div>
                        <p className="text-sm text-gray-500">From</p>
                        <p className="font-semibold">{selectedSubmission.name} &lt;{selectedSubmission.email}&gt;</p>
                    </div>
                     <div>
                        <p className="text-sm text-gray-500">Subject</p>
                        <p className="font-semibold">{selectedSubmission.subject}</p>
                    </div>
                     <div>
                        <p className="text-sm text-gray-500">Received</p>
                        <p>{new Date(selectedSubmission.receivedAt).toLocaleString()}</p>
                    </div>
                    <div className="pt-4 border-t">
                        <p className="text-sm text-gray-500 mb-2">Message</p>
                        <p className="whitespace-pre-wrap bg-gray-50 p-3 rounded-md">{selectedSubmission.message}</p>
                    </div>
                    <div className="flex justify-end pt-4">
                        <Button variant="danger" onClick={() => handleDelete(selectedSubmission.id)}>Delete Message</Button>
                    </div>
                </div>
            ) : (
                <div className="flex items-center justify-center h-64">
                    <p className="text-gray-500">Select a message to view its details.</p>
                </div>
            )}
        </Card>
      </div>
    </div>
  );
};

export default ContactView;
