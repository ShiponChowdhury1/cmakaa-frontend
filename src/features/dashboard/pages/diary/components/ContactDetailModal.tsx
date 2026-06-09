import { useState } from 'react';
import { FaEdit, FaCheck } from 'react-icons/fa';
import { MdDelete, MdEmail, MdPhone, MdNotes } from 'react-icons/md';
import type { DiaryContact } from '../../../../../store/features/diaryContacts/diaryContactsApi.types';
import {
  useUpdateDiaryContactMutation,
  useDeleteDiaryContactMutation,
} from '../../../../../store/features/diaryContacts/diaryContactsApi';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import { toast } from 'react-toastify';

interface Props {
  contact: DiaryContact;
  isEditMode?: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function ContactDetailModal({ contact, isEditMode = false, onClose, onSuccess }: Props) {
  const [editMode, setEditMode] = useState(isEditMode);
  const [fullName, setFullName] = useState(contact.fullName);
  const [email, setEmail] = useState(contact.email);
  const [phone, setPhone] = useState(contact.phone);
  const [notes, setNotes] = useState(contact.notes);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const [updateContact, { isLoading: isUpdating }] = useUpdateDiaryContactMutation();
  const [deleteContact, { isLoading: isDeleting }] = useDeleteDiaryContactMutation();

  const handleSave = async () => {
    if (!fullName.trim() || !email.trim() || !phone.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      await updateContact({
        contactId: contact.id,
        data: {
          fullName: fullName.trim(),
          email: email.trim(),
          phone: phone.trim(),
          notes: notes.trim() || undefined,
        },
      }).unwrap();

      toast.success('🎉 Contact updated successfully!');
      setEditMode(false);
      onSuccess?.();
    } catch (error: any) {
      console.error('Failed to update contact:', error);
      toast.error(error?.data?.message || 'Failed to update contact. Please try again.');
    }
  };

  const handleDelete = async () => {
    try {
      await deleteContact(contact.id).unwrap();
      toast.success('🗑️ Contact deleted successfully!');
      onSuccess?.();
      onClose();
    } catch (error: any) {
      console.error('Failed to delete contact:', error);
      toast.error(error?.data?.message || 'Failed to delete contact. Please try again.');
    }
  };

  return (
    <div
      className="fixed inset-0 z-[999] flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(5,10,20,0.45)', backdropFilter: 'blur(3px)' }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-3xl border border-gray-100 p-6 overflow-y-auto"
        style={{ background: '#FFF8F3', maxHeight: '90vh' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-[var(--color-dark)]" style={{ fontFamily: 'var(--font-heading)' }}>
            {editMode ? 'Edit Contact' : 'Contact Details'}
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-600 cursor-pointer bg-transparent border-none transition-colors"
          >
            <span className="text-xl">×</span>
          </button>
        </div>

        {showDeleteConfirm ? (
          /* Delete Confirmation */
          <div className="text-center py-8">
            <div className="w-16 h-16 mx-auto rounded-full bg-red-50 flex items-center justify-center mb-4">
              <MdDelete size={32} color="#DC2626" />
            </div>
            <h3 className="text-lg font-bold text-[var(--color-dark)] mb-2">Delete Contact?</h3>
            <p className="text-sm text-[#64748B] mb-6">
              This action cannot be undone. {contact.fullName} will be permanently removed from your diary.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 py-3 rounded-xl text-sm font-semibold text-[var(--color-dark)] bg-white border border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="flex-1 py-3 rounded-xl text-sm font-semibold text-white bg-red-500 cursor-pointer hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        ) : editMode ? (
          /* Edit Mode */
          <>
            <div className="mb-4">
              <label className="block text-sm font-semibold text-[var(--color-dark)] mb-1.5">Full Name</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Full name"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-sm text-[var(--color-dark)] placeholder:text-[#94A3B8] outline-none focus:border-[#E57432] transition-colors"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-semibold text-[var(--color-dark)] mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@example.com"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-sm text-[var(--color-dark)] placeholder:text-[#94A3B8] outline-none focus:border-[#E57432] transition-colors"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-semibold text-[var(--color-dark)] mb-1.5">Phone</label>
              <PhoneInput
                placeholder="Enter phone number"
                value={phone}
                onChange={(val) => setPhone(val || '')}
                defaultCountry="GB"
                className="custom-phone-input"
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-semibold text-[var(--color-dark)] mb-1.5">Notes</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Notes about this contact (optional)"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-sm text-[var(--color-dark)] placeholder:text-[#94A3B8] outline-none focus:border-[#E57432] transition-colors resize-none"
                rows={3}
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setEditMode(false)}
                className="flex-1 py-3 rounded-xl text-sm font-semibold text-[var(--color-dark)] bg-white border border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={isUpdating}
                className="flex-1 py-3 rounded-xl text-sm font-semibold text-white cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                style={{ background: '#E57432' }}
              >
                <FaCheck size={14} />
                {isUpdating ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </>
        ) : (
          /* View Mode */
          <>
            {/* Avatar */}
            <div className="w-16 h-16 rounded-full bg-[#23334D] text-white flex items-center justify-center font-bold text-xl mx-auto mb-4 shrink-0">
              {contact.fullName.split(' ').map((n) => n[0]).join('').toUpperCase()}
            </div>

            {/* Contact Info */}
            <div className="space-y-4 mb-6">
              <div>
                <h3 className="text-lg font-bold text-[var(--color-dark)] text-center mb-2">{contact.fullName}</h3>
              </div>

              <div className="space-y-3 bg-white rounded-2xl p-4">
                <div className="flex items-center gap-3">
                  <MdEmail size={18} color="#E57432" className="shrink-0" />
                  <div>
                    <p className="text-xs text-[#94A3B8]">Email</p>
                    <p className="text-sm font-semibold text-[var(--color-dark)]">{contact.email}</p>
                  </div>
                </div>

                <div className="border-t border-gray-100" />

                <div className="flex items-center gap-3">
                  <MdPhone size={18} color="#E57432" className="shrink-0" />
                  <div>
                    <p className="text-xs text-[#94A3B8]">Phone</p>
                    <p className="text-sm font-semibold text-[var(--color-dark)]">{contact.phone}</p>
                  </div>
                </div>

                {contact.notes && (
                  <>
                    <div className="border-t border-gray-100" />
                    <div className="flex items-start gap-3">
                      <MdNotes size={18} color="#E57432" className="shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-xs text-[#94A3B8]">Notes</p>
                        <p className="text-sm text-[var(--color-dark)] mt-1">{contact.notes}</p>
                      </div>
                    </div>
                  </>
                )}
              </div>

              <div className="space-y-1 text-xs text-[#94A3B8]">
                <p>Added: {new Date(contact.createdAt).toLocaleDateString('en-GB', { year: 'numeric', month: 'short', day: 'numeric' })}</p>
                <p>Updated: {new Date(contact.updatedAt).toLocaleDateString('en-GB', { year: 'numeric', month: 'short', day: 'numeric' })}</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={() => setEditMode(true)}
                className="flex-1 py-3 rounded-xl text-sm font-semibold text-white cursor-pointer border-none transition-opacity hover:opacity-90 flex items-center justify-center gap-2"
                style={{ background: '#E57432' }}
              >
                <FaEdit size={14} />
                Edit
              </button>
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="flex-1 py-3 rounded-xl text-sm font-semibold text-red-500 bg-red-50 cursor-pointer border border-red-200 hover:bg-red-100 transition-colors flex items-center justify-center gap-2"
              >
                <MdDelete size={14} />
                Delete
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
