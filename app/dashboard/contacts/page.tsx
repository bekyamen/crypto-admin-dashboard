'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, MessageCircle, Edit2, X, Check, AlertCircle } from 'lucide-react';
import { useAdminContactsApi, Contact } from '@/lib/use-admin-contacts-api';
import { useAuth } from '@/lib/auth-context';

const PLATFORM_OPTIONS = [
  { value: 'telegram', label: 'Telegram', icon: Send },
  { value: 'whatsapp', label: 'WhatsApp', icon: MessageCircle },
];

export default function AdminContactsPage() {
  const { token } = useAuth(); // ✅ get token from Auth context
  const { getAllContacts, saveContact, deleteContact, isLoading, error, setError } = useAdminContactsApi(token);

  const [contacts, setContacts] = useState<Contact[]>([]);
  const [successMessage, setSuccessMessage] = useState('');
  const [newPlatform, setNewPlatform] = useState<'telegram' | 'whatsapp' | ''>('');
  const [newValue, setNewValue] = useState('');

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editPlatform, setEditPlatform] = useState<'telegram' | 'whatsapp' | ''>('');
  const [editValue, setEditValue] = useState('');

  // ---------------- Fetch contacts ----------------
  const fetchContacts = async () => {
    if (!token) {
      setError?.('You must be logged in to fetch contacts');
      return;
    }

    const data = await getAllContacts();
    if (data) setContacts(data);
  };

  useEffect(() => {
    fetchContacts();
  }, [token]);

  // ---------------- Add contact ----------------
  const handleAdd = async () => {
    if (!newPlatform || !newValue) return setError?.('Platform and value are required');

    const saved = await saveContact(newPlatform, newValue);
    if (saved) {
      setSuccessMessage('Contact added successfully');
      setNewPlatform('');
      setNewValue('');
      fetchContacts();
      setTimeout(() => setSuccessMessage(''), 3000);
    }
  };

  // ---------------- Edit contact ----------------
  const startEdit = (c: Contact) => {
    setEditingId(c.id);
    setEditPlatform(c.platform);
    setEditValue(c.value);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditPlatform('');
    setEditValue('');
  };

  const saveEdit = async () => {
    if (!editPlatform || !editValue) return setError?.('Platform and value are required');

    const saved = await saveContact(editPlatform, editValue);
    if (saved) {
      setSuccessMessage('Contact updated successfully');
      cancelEdit();
      fetchContacts();
      setTimeout(() => setSuccessMessage(''), 3000);
    }
  };

  // ---------------- Delete contact ----------------
  const handleDelete = async (id: string) => {
    if (!confirm('Delete this contact?')) return;

    const deleted = await deleteContact(id);
    if (deleted) {
      setSuccessMessage('Contact deleted successfully');
      fetchContacts();
      setTimeout(() => setSuccessMessage(''), 3000);
    }
  };

  return (
    <div className="space-y-4 p-6 max-w-2xl">
      <h1 className="text-2xl font-semibold text-slate-100">Admin Contacts</h1>

      {/* Success & Error Messages */}
      {successMessage && (
        <div className="bg-green-900/30 border border-green-500 text-green-200 px-4 py-3 rounded-lg text-sm">
          {successMessage}
        </div>
      )}
      {error && (
        <div className="bg-red-900/30 border border-red-500 text-red-200 px-4 py-3 rounded-lg text-sm flex items-center gap-2">
          <AlertCircle size={16} /> {error}
        </div>
      )}

      {/* Add New Contact */}
      <Card className="bg-slate-800 border-slate-700 p-5">
        <h2 className="text-slate-100 font-semibold mb-3">Add Contact</h2>
        <div className="space-y-3">
          <select
            value={newPlatform}
            onChange={(e) => setNewPlatform(e.target.value as 'telegram' | 'whatsapp')}
            className="w-full bg-slate-700 border border-slate-600 text-slate-100 px-3 py-2 rounded"
          >
            <option value="" disabled>Select platform</option>
            {PLATFORM_OPTIONS.map((p) => (
              <option key={p.value} value={p.value}>{p.label}</option>
            ))}
          </select>

          <Input
            placeholder="@username or phone"
            className="bg-slate-700 border-slate-600 text-slate-100 placeholder:text-slate-400"
            value={newValue}
            onChange={(e) => setNewValue(e.target.value)}
          />

          <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleAdd} disabled={isLoading || !token}>
            Add Contact
          </Button>
        </div>
      </Card>

      {/* Contacts List */}
      <Card className="bg-slate-800 border-slate-700 p-4 space-y-2">
        <h2 className="text-slate-100 font-semibold mb-3">Existing Contacts</h2>

        {contacts.map((c) => {
          const Icon = c.platform === 'telegram' ? Send : MessageCircle;

          return (
            <div key={c.id} className="flex justify-between items-center bg-slate-900 border border-slate-700 p-3 rounded">
              {editingId === c.id ? (
                <div className="flex gap-2 flex-1">
                  <select
                    value={editPlatform}
                    onChange={(e) => setEditPlatform(e.target.value as 'telegram' | 'whatsapp')}
                    className="bg-slate-700 border border-slate-600 text-slate-100 px-2 py-1 rounded"
                  >
                    {PLATFORM_OPTIONS.map((p) => (
                      <option key={p.value} value={p.value}>{p.label}</option>
                    ))}
                  </select>

                  <Input
                    className="bg-slate-700 border-slate-600 text-slate-100"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                  />
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Icon size={16} className={c.platform === 'telegram' ? 'text-blue-400' : 'text-green-400'} />
                  <div>
                    <p className="text-slate-100 font-medium capitalize">{c.platform}</p>
                    <p className="text-slate-400 text-sm">{c.value}</p>
                  </div>
                </div>
              )}

              <div className="flex gap-2 ml-4">
                {editingId === c.id ? (
                  <>
                    <Button size="sm" onClick={saveEdit}><Check size={16} /></Button>
                    <Button size="sm" variant="ghost" onClick={cancelEdit}><X size={16} /></Button>
                  </>
                ) : (
                  <>
                    <Button size="sm" variant="ghost" onClick={() => startEdit(c)}><Edit2 size={16} /></Button>
                    <Button size="sm" variant="destructive" onClick={() => handleDelete(c.id)}>Delete</Button>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </Card>
    </div>
  );
}
