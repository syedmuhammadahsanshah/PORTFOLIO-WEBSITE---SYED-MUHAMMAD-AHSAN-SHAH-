import React, { useState } from 'react';
import {
  Users, UserPlus, Key, Lock, Eye, EyeOff, Copy, Check,
  Trash2, Edit3, ShieldAlert, CheckCircle2, ShieldCheck, AlertCircle, RefreshCw
} from 'lucide-react';
import { AdminUser, defaultAdminUsers, PortfolioData } from '../../data/portfolioData';
import { usePortfolio } from '../../context/PortfolioContext';

interface SecurityTabProps {
  draftAdminUsers?: AdminUser[];
  onUsersChange: (users: AdminUser[]) => void;
}

export const SecurityTab: React.FC<SecurityTabProps> = ({
  draftAdminUsers,
  onUsersChange,
}) => {
  const {
    data,
    currentAdminUser,
    addAdminUser,
    updateAdminUserPassword,
    deleteAdminUser,
  } = usePortfolio();

  const activeUsers: AdminUser[] =
    draftAdminUsers && draftAdminUsers.length > 0
      ? draftAdminUsers
      : data.adminUsers && data.adminUsers.length > 0
      ? data.adminUsers
      : defaultAdminUsers;

  // State for Add User Form
  const [showAddForm, setShowAddForm] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newRole, setNewRole] = useState('Administrator');
  const [addError, setAddError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // State for Editing Password
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [editPasswordInput, setEditPasswordInput] = useState('');
  const [editError, setEditError] = useState<string | null>(null);

  // Password visibility map (default to visible as requested!)
  const [hiddenPasswords, setHiddenPasswords] = useState<Record<string, boolean>>({});

  // Copy feedback
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const togglePasswordVisibility = (userId: string) => {
    setHiddenPasswords((prev) => ({
      ...prev,
      [userId]: !prev[userId],
    }));
  };

  const handleCopyPassword = (userId: string, pass: string) => {
    navigator.clipboard.writeText(pass);
    setCopiedId(userId);
    showToast('Password copied to clipboard!');
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Submit Add User
  const handleAddUserSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddError(null);

    const cleanUser = newUsername.trim();
    const cleanPass = newPassword.trim();

    if (!cleanUser) {
      setAddError('Please enter a valid username.');
      return;
    }

    if (cleanPass.length < 8) {
      setAddError('Password must be a minimum of 8 digits or characters.');
      return;
    }

    if (activeUsers.some((u) => u.username.toLowerCase() === cleanUser.toLowerCase())) {
      setAddError(`Username "${cleanUser}" already exists. Please choose a different name.`);
      return;
    }

    setIsSubmitting(true);
    try {
      const newUserObj: AdminUser = {
        id: `user-${Date.now()}`,
        username: cleanUser,
        password: cleanPass,
        role: newRole.trim() || 'Administrator',
        createdAt: new Date().toISOString().split('T')[0],
      };

      const updatedList = [...activeUsers, newUserObj];
      onUsersChange(updatedList);
      await addAdminUser({
        username: cleanUser,
        password: cleanPass,
        role: newRole.trim() || 'Administrator',
      });

      setNewUsername('');
      setNewPassword('');
      setNewRole('Administrator');
      setShowAddForm(false);
      showToast(`✓ User "${cleanUser}" successfully created!`);
    } catch (err) {
      setAddError('Failed to add user. Please check your connection.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Submit Edit Password
  const handleSaveEditedPassword = async (userId: string) => {
    setEditError(null);
    const cleanPass = editPasswordInput.trim();

    if (cleanPass.length < 8) {
      setEditError('New password must be at least 8 digits or characters.');
      return;
    }

    try {
      const updatedList = activeUsers.map((u) =>
        u.id === userId ? { ...u, password: cleanPass } : u
      );
      onUsersChange(updatedList);
      await updateAdminUserPassword(userId, cleanPass);

      setEditingUserId(null);
      setEditPasswordInput('');
      showToast('✓ Password updated successfully!');
    } catch (err) {
      setEditError('Failed to update password.');
    }
  };

  // Delete User
  const handleDeleteUser = async (userId: string, username: string) => {
    if (activeUsers.length <= 1) {
      alert('Cannot delete the only remaining admin account.');
      return;
    }

    if (confirm(`Are you sure you want to remove administrator "${username}"?`)) {
      try {
        const updatedList = activeUsers.filter((u) => u.id !== userId);
        onUsersChange(updatedList);
        await deleteAdminUser(userId);
        showToast(`User "${username}" removed.`);
      } catch (err) {
        showToast('Error removing user.');
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#1E2C48]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="p-1.5 rounded-lg bg-[#3B82F6]/20 border border-[#3B82F6]/40 text-[#3B82F6]">
              <Users className="w-4 h-4" />
            </div>
            <h3 className="font-heading font-bold text-lg text-[#F2F5F9]">
              Portal Security &amp; Admin Users
            </h3>
          </div>
          <p className="text-xs text-[#8B97AC]">
            Manage authorized portal users, view current passwords directly on the panel, and configure credentials.
          </p>
        </div>

        {/* Action Button to Add User */}
        <div className="flex items-center gap-2">
          {!showAddForm && (
            <button
              type="button"
              onClick={() => {
                setShowAddForm(true);
                setAddError(null);
              }}
              className="px-4 py-2 rounded-xl bg-[#2F6FED] hover:bg-[#3B82F6] text-white text-xs font-semibold shadow-md transition-all flex items-center gap-2 active:scale-95 shrink-0"
            >
              <UserPlus className="w-4 h-4" />
              <span>Add User</span>
            </button>
          )}
        </div>
      </div>

      {/* Global Toast Notice */}
      {toastMessage && (
        <div className="px-4 py-2.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-semibold flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ADD USER FORM (Modal / Expandable Card) */}
      {showAddForm && (
        <div className="p-5 rounded-2xl bg-[#121B2E] border-2 border-[#2F6FED]/50 shadow-xl space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <UserPlus className="w-4 h-4 text-[#3B82F6]" />
              <h4 className="text-sm font-bold text-[#F2F5F9]">Add New Administrator</h4>
            </div>
            <button
              type="button"
              onClick={() => {
                setShowAddForm(false);
                setAddError(null);
              }}
              className="text-xs text-[#8B97AC] hover:text-[#F2F5F9]"
            >
              Cancel
            </button>
          </div>

          <form onSubmit={handleAddUserSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Username Input */}
              <div>
                <label className="block text-xs font-semibold text-[#C4CCDA] mb-1.5">
                  Username <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  placeholder="e.g. ahsan.shah"
                  className="w-full px-3.5 py-2 rounded-xl bg-[#0D1424] border border-[#1E2C48] text-xs text-[#F2F5F9] focus:outline-none focus:border-[#3B82F6]"
                  required
                />
              </div>

              {/* Password Input (Min 8 Characters) */}
              <div>
                <label className="block text-xs font-semibold text-[#C4CCDA] mb-1.5">
                  Password (Min 8 Digits/Chars) <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Minimum 8 characters"
                  minLength={8}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#0D1424] border border-[#1E2C48] text-xs text-[#F2F5F9] focus:outline-none focus:border-[#3B82F6] font-mono"
                  required
                />
                <span className="text-[10px] text-[#8B97AC] mt-1 block">
                  Length: {newPassword.length}/8 characters minimum
                </span>
              </div>

              {/* Role Title */}
              <div>
                <label className="block text-xs font-semibold text-[#C4CCDA] mb-1.5">
                  Role / Description
                </label>
                <input
                  type="text"
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                  placeholder="e.g. Co-Administrator"
                  className="w-full px-3.5 py-2 rounded-xl bg-[#0D1424] border border-[#1E2C48] text-xs text-[#F2F5F9] focus:outline-none focus:border-[#3B82F6]"
                />
              </div>
            </div>

            {addError && (
              <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{addError}</span>
              </div>
            )}

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 rounded-xl bg-[#1E2C48]/50 hover:bg-[#1E2C48] text-[#C4CCDA] text-xs font-semibold transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2 rounded-xl bg-[#2F6FED] hover:bg-[#3B82F6] text-white text-xs font-semibold shadow-md transition-all flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Save New User</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* USER LIST WITH VISIBLE PASSWORDS */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs text-[#8B97AC] px-1">
          <span className="font-semibold uppercase tracking-wider text-[11px]">
            Authorized Portal Accounts ({activeUsers.length})
          </span>
          <span className="text-[11px]">
            Passwords are visible for administrative review
          </span>
        </div>

        <div className="grid grid-cols-1 gap-3">
          {activeUsers.map((user) => {
            const isSelf = currentAdminUser?.username?.toLowerCase() === user.username.toLowerCase();
            const isEditing = editingUserId === user.id;
            const isPasswordHidden = !!hiddenPasswords[user.id];

            return (
              <div
                key={user.id}
                className="p-4 sm:p-5 rounded-2xl bg-[#121B2E] border border-[#1E2C48] hover:border-[#3B82F6]/40 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                {/* Left: User Identity */}
                <div className="flex items-start sm:items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-[#0D1424] border border-[#1E2C48] flex items-center justify-center text-[#3B82F6] font-bold text-sm shrink-0">
                    {user.username.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-bold text-[#F2F5F9]">
                        {user.username}
                      </span>
                      {isSelf && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#2F6FED]/20 text-[#3B82F6] border border-[#2F6FED]/30">
                          Current Session
                        </span>
                      )}
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-[#1E2C48] text-[#8B97AC]">
                        {user.role || 'Administrator'}
                      </span>
                    </div>
                    {user.createdAt && (
                      <span className="text-[11px] text-[#8B97AC] block mt-0.5">
                        Created: {user.createdAt}
                      </span>
                    )}
                  </div>
                </div>

                {/* Right: Current Password Display (Visible right on the panel as requested!) */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 shrink-0">
                  {/* Password Display Box */}
                  <div className="flex items-center gap-2 bg-[#0D1424] border border-[#1E2C48] rounded-xl px-3 py-2">
                    <Key className="w-3.5 h-3.5 text-[#D9A94E] shrink-0" />
                    <div className="flex flex-col">
                      <span className="text-[9px] uppercase tracking-wider text-[#8B97AC] font-semibold">
                        Current Password
                      </span>
                      <span className="font-mono text-xs font-semibold text-[#D9A94E] select-all">
                        {isPasswordHidden ? '••••••••' : user.password}
                      </span>
                    </div>

                    {/* Action buttons inside password pill */}
                    <div className="flex items-center gap-1 pl-2 border-l border-[#1E2C48] ml-2">
                      {/* Toggle Masking */}
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility(user.id)}
                        className="p-1 rounded text-[#8B97AC] hover:text-[#F2F5F9] transition-colors"
                        title={isPasswordHidden ? 'Show password' : 'Hide password'}
                      >
                        {isPasswordHidden ? (
                          <Eye className="w-3.5 h-3.5" />
                        ) : (
                          <EyeOff className="w-3.5 h-3.5" />
                        )}
                      </button>

                      {/* Copy Password Button */}
                      <button
                        type="button"
                        onClick={() => handleCopyPassword(user.id, user.password)}
                        className="p-1 rounded text-[#8B97AC] hover:text-[#D9A94E] transition-colors"
                        title="Copy password to clipboard"
                      >
                        {copiedId === user.id ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Actions: Edit Password & Delete User */}
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => {
                        if (isEditing) {
                          setEditingUserId(null);
                          setEditError(null);
                        } else {
                          setEditingUserId(user.id);
                          setEditPasswordInput(user.password);
                          setEditError(null);
                        }
                      }}
                      className="px-3 py-2 rounded-xl bg-[#1E2C48] hover:bg-[#2F6FED]/20 hover:text-[#3B82F6] text-[#C4CCDA] text-xs font-semibold transition-all flex items-center gap-1.5"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>{isEditing ? 'Close' : 'Change Password'}</span>
                    </button>

                    {activeUsers.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleDeleteUser(user.id, user.username)}
                        className="p-2 rounded-xl bg-[#1E2C48]/60 hover:bg-rose-500/20 text-[#8B97AC] hover:text-rose-400 transition-all"
                        title="Delete User"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Inline Edit Password Expansion */}
                {isEditing && (
                  <div className="w-full pt-3 mt-2 border-t border-[#1E2C48] flex flex-col sm:flex-row items-start sm:items-center gap-3">
                    <div className="flex-1 min-w-0 w-full sm:w-auto">
                      <label className="block text-[11px] font-semibold text-[#8B97AC] mb-1">
                        New Password (minimum 8 characters)
                      </label>
                      <input
                        type="text"
                        value={editPasswordInput}
                        onChange={(e) => setEditPasswordInput(e.target.value)}
                        placeholder="Enter new 8+ character password"
                        minLength={8}
                        className="w-full px-3 py-1.5 rounded-lg bg-[#0D1424] border border-[#1E2C48] text-xs font-mono text-[#F2F5F9] focus:outline-none focus:border-[#3B82F6]"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => handleSaveEditedPassword(user.id)}
                      className="px-4 py-2 rounded-xl bg-[#2F6FED] hover:bg-[#3B82F6] text-white text-xs font-semibold transition-all mt-4 sm:mt-5"
                    >
                      Update Password
                    </button>
                    {editError && (
                      <span className="text-xs text-rose-400 mt-2 block sm:inline">
                        {editError}
                      </span>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Security Info Card */}
      <div className="p-4 rounded-xl bg-[#0D1424] border border-[#1E2C48] text-xs text-[#8B97AC] flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-[#D9A94E] shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-semibold text-[#F2F5F9]">Security Requirement Rules</p>
          <p>
            • All administrator passwords must be at least <strong>8 digits or characters</strong>.<br />
            • User accounts and updated passwords are automatically stored and synchronized in <strong>Firebase Firestore</strong> and cached locally for offline protection.<br />
            • To sign in, users must provide their exact username and matching password on the portal login screen.
          </p>
        </div>
      </div>
    </div>
  );
};
