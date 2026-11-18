import React, { useState } from 'react';
import { useStock } from '../../context/StockContext';
import { X, User, Mail, Briefcase, Camera, Check, ShieldCheck, LogOut } from 'lucide-react';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose }) => {
  const { user, updateUserProfile, logout } = useStock();

  const [name, setName] = useState(user.name);
  const [role, setRole] = useState(user.role);
  const [avatar, setAvatar] = useState(user.avatar);
  const [isSaved, setIsSaved] = useState(false);

  if (!isOpen) return null;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateUserProfile({
      name: name.trim() || user.name,
      role: role.trim() || user.role,
      avatar: avatar.trim() || user.avatar
    });
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      onClose();
    }, 1200);
  };

  const handleAvatarPreset = (presetName: string) => {
    const newAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(presetName)}&background=3b82f6&color=fff&bold=true`;
    setAvatar(newAvatar);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150">
      <div 
        className="w-full max-w-md bg-[#111827] border border-slate-800 rounded-2xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-[#131B2E]">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-brand-blue/10 text-brand-blue">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-wide">
                User Profile Settings
              </h3>
              <p className="text-xs text-slate-400">Personalize your identity and trader credentials</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSave} className="p-6 space-y-5">
          {/* Avatar Preview & Quick Style */}
          <div className="flex items-center gap-4 p-4 rounded-xl bg-[#0B0F19] border border-slate-800/80">
            <div className="relative">
              <img
                src={avatar || user.avatar}
                alt={name}
                className="w-16 h-16 rounded-xl object-cover ring-2 ring-brand-blue/40 shadow-lg"
              />
              <button
                type="button"
                onClick={() => handleAvatarPreset(name || 'Trader')}
                title="Regenerate Avatar Initials"
                className="absolute -bottom-1 -right-1 p-1 bg-brand-blue rounded-lg text-white hover:bg-blue-600 transition-colors"
              >
                <Camera className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-white truncate">{name || 'Your Name'}</p>
              <p className="text-xs text-slate-400 font-mono truncate">{user.email || 'No email attached'}</p>
              <div className="flex items-center gap-1.5 mt-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] text-emerald-400 font-mono font-medium">Verified Profile</span>
              </div>
            </div>
          </div>

          {/* Form Fields */}
          <div className="space-y-4 text-xs">
            {/* Full Name */}
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-300">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Prithviraj"
                  className="w-full bg-[#0B0F19] border border-slate-700/80 rounded-xl pl-9 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-brand-blue"
                />
              </div>
            </div>

            {/* Email Address (read only / verified) */}
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-300">Signed In As (Personal Email)</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  disabled
                  value={user.email || 'guest@stocksense.ai'}
                  className="w-full bg-[#0B0F19]/60 border border-slate-800 rounded-xl pl-9 pr-4 py-2.5 text-xs text-slate-400 font-mono cursor-not-allowed"
                />
              </div>
              <p className="text-[10px] text-slate-500">To switch accounts, click &quot;Sign Out &amp; Switch Account&quot; below.</p>
            </div>

            {/* Role / Title */}
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-300">Trader Role / Academic Title</label>
              <div className="relative">
                <Briefcase className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="e.g. Quantitative Analyst & Portfolio Manager"
                  className="w-full bg-[#0B0F19] border border-slate-700/80 rounded-xl pl-9 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-brand-blue"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex items-center gap-3">
            <button
              type="submit"
              className={`flex-1 py-2.5 px-4 rounded-xl font-bold text-xs transition-all shadow-md flex items-center justify-center gap-1.5 ${
                isSaved
                  ? 'bg-emerald-500 text-white shadow-emerald-500/20'
                  : 'bg-brand-blue hover:bg-blue-600 text-white shadow-brand-blue/20'
              }`}
            >
              {isSaved ? <Check className="w-4 h-4" /> : <ShieldCheck className="w-4 h-4" />}
              <span>{isSaved ? 'Saved to Server!' : 'Save Profile Changes'}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                onClose();
                logout();
              }}
              className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-rose-500/20 text-slate-300 hover:text-rose-400 border border-slate-700 hover:border-rose-500/30 font-semibold text-xs transition-all flex items-center gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log Out</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
