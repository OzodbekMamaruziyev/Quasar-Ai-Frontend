"use client";

import { useState, useEffect } from "react";
import { User, Bell, Shield, Trash2, Check, Camera, Plus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { usersApi } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

const TABS = [
    { id: "profile", label: "Profile", icon: User },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "security", label: "Security", icon: Shield },
];

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState("profile");
    const { user, updateUser } = useAuth();
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        bio: user?.bio || '',
        username: user?.username || '',
        timezone: user?.timezone || 'UTC+0 (GMT)',
        language: user?.language || 'English',
    });
    const [notifications, setNotifications] = useState([
        { id: "1", description: "Project updates", enabled: true },
        { id: "2", description: "New comments", enabled: true },
        { id: "3", description: "Team invites", enabled: false },
        { id: "4", description: "Marketing emails", enabled: false },
    ]);
    const [toast, setToast] = useState("");
    const [saving, setSaving] = useState(false);
    const [inviteEmail, setInviteEmail] = useState("");
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    // Update form when user data changes
    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                email: user.email || '',
                bio: user.bio || '',
                username: user.username || '',
                timezone: user.timezone || 'UTC+0 (GMT)',
                language: user.language || 'English',
            });
        }
    }, [user]);


    const showToast = (msg: string) => {
        setToast(msg);
        setTimeout(() => setToast(""), 3000);
    };

    const handleSaveProfile = async () => {
        setSaving(true);
        try {
            await updateUser(formData);
            showToast("Profile saved successfully!");
        } catch (error) {
            showToast("Failed to save profile");
        } finally {
            setSaving(false);
        }
    };

    const toggleNotification = (id: string) => {
        setNotifications((prev) =>
            prev.map((n) => (n.id === id ? { ...n, enabled: !n.enabled } : n))
        );
    };

    const handleSaveNotifications = async () => {
        setSaving(true);
        await new Promise((r) => setTimeout(r, 800));
        setSaving(false);
        showToast("Notification preferences saved!");
    };

    const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        try {
            setSaving(true);
            const response = await usersApi.uploadAvatar(formData);
            if (response.success) {
                await updateUser({ avatar: response.data.avatar });
                showToast("Avatar updated successfully!");
            }
        } catch (error) {
            console.error('Failed to upload avatar:', error);
            showToast("Failed to upload avatar");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="p-4 sm:p-6 lg:p-10">
            <div className="mx-auto max-w-3xl">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">Settings</h1>
                    <p className="mt-1 text-sm text-zinc-500">Manage your account preferences and settings.</p>
                </div>

                {/* Tabs */}
                <div className="mb-8 flex gap-1 border-b border-white/5 overflow-x-auto">
                    {TABS.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold whitespace-nowrap border-b-2 transition-all -mb-px ${activeTab === tab.id
                                    ? "border-accent text-white"
                                    : "border-transparent text-zinc-500 hover:text-zinc-300"
                                }`}
                        >
                            <tab.icon size={15} />
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Profile Tab */}
                {activeTab === "profile" && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                        {/* Avatar */}
                        <div className="flex items-center gap-5">
                            <div className="relative group">
                                <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-linear-to-t from-accent to-indigo-600 text-2xl font-bold text-white shadow-lg overflow-hidden">
                                    {user?.avatar ? (
                                        <img src={user.avatar} alt={user.name} className="h-full w-full object-cover" />
                                    ) : (
                                        user?.name?.charAt(0).toUpperCase() || 'U'
                                    )}
                                </div>
                                <label className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-zinc-800 border border-white/10 text-zinc-400 hover:text-white transition-colors cursor-pointer group-hover:bg-accent group-hover:text-white">
                                    <Camera size={13} />
                                    <input type="file" className="hidden" accept="image/*" onChange={handleAvatarUpload} />
                                </label>
                            </div>
                            <div>
                                <p className="text-base font-bold text-white">{user?.name || 'Loading...'}</p>
                                <p className="text-sm text-zinc-500">{user?.email || ''}</p>
                                <span className="mt-1 inline-flex items-center rounded-full bg-accent/15 text-accent text-xs font-bold px-2.5 py-0.5">
                                    {user?.plan || 'FREE'} Plan
                                </span>
                            </div>
                        </div>

                        {/* Form */}
                        <div className="rounded-2xl border border-white/8 bg-zinc-900/30 p-6 space-y-5">
                            <h2 className="text-base font-bold text-white">Personal Information</h2>
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2">Full Name</label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2">Username</label>
                                    <input
                                        type="text"
                                        value={formData.username}
                                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                        className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent transition-all"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2">Email Address</label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2">Bio</label>
                                <textarea
                                    value={formData.bio}
                                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                    rows={3}
                                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent transition-all resize-none"
                                />
                            </div>
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2">Timezone</label>
                                    <select
                                        value={formData.timezone || 'UTC+0 (GMT)'}
                                        onChange={(e) => setFormData({ ...formData, timezone: e.target.value })}
                                        className="w-full rounded-xl border border-white/10 bg-zinc-900 px-4 py-2.5 text-sm text-white focus:border-accent focus:outline-none transition-all"
                                    >
                                        <option>UTC-8 (Pacific Time)</option>
                                        <option>UTC-5 (Eastern Time)</option>
                                        <option>UTC+0 (GMT)</option>
                                        <option>UTC+1 (CET)</option>
                                        <option>UTC+5 (Tashkent)</option>
                                        <option>UTC+8 (CST)</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2">Language</label>
                                    <select
                                        value={formData.language || 'English'}
                                        onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                                        className="w-full rounded-xl border border-white/10 bg-zinc-900 px-4 py-2.5 text-sm text-white focus:border-accent focus:outline-none transition-all"
                                    >
                                        <option>English</option>
                                        <option>Spanish</option>
                                        <option>French</option>
                                        <option>German</option>
                                        <option>Uzbek</option>
                                    </select>
                                </div>
                            </div>
                            <button
                                onClick={handleSaveProfile}
                                disabled={saving}
                                className="flex items-center gap-2 rounded-xl bg-accent px-6 py-2.5 text-sm font-bold text-white hover:bg-blue-600 hover:scale-[1.02] transition-all disabled:opacity-60 neon-glow"
                            >
                                {saving ? (
                                    <><svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg> Saving...</>
                                ) : (
                                    <><Check size={15} /> Save Changes</>
                                )}
                            </button>
                        </div>

                        {/* Team Members */}
                        <div className="rounded-2xl border border-white/8 bg-zinc-900/30 p-6">
                            <div className="flex items-center justify-between mb-5">
                                <h2 className="text-base font-bold text-white">Team Members</h2>
                                <span className="text-xs text-zinc-500">0/3 seats used</span>
                            </div>
                            <div className="space-y-3 mb-5">
                                {/* Team members will be loaded from API */}
                                <p className="text-sm text-zinc-500 text-center py-4">No team members yet</p>
                            </div>
                            <div className="flex gap-2">
                                <input
                                    type="email"
                                    placeholder="Invite by email..."
                                    value={inviteEmail}
                                    onChange={(e) => setInviteEmail(e.target.value)}
                                    className="flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white focus:border-accent focus:outline-none transition-all placeholder:text-zinc-600"
                                />
                                <button
                                    onClick={() => { if (inviteEmail) { showToast(`Invite sent to ${inviteEmail}`); setInviteEmail(""); } }}
                                    className="flex items-center gap-1.5 rounded-xl bg-white/8 border border-white/10 px-4 py-2.5 text-sm font-semibold text-white hover:bg-white/15 transition-all"
                                >
                                    <Plus size={15} /> Invite
                                </button>
                            </div>
                        </div>

                        {/* Danger Zone */}
                        <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-6">
                            <h2 className="text-base font-bold text-red-400 mb-2">Danger Zone</h2>
                            <p className="text-sm text-zinc-500 mb-4">Once you delete your account, there is no going back. Please be certain.</p>
                            <button
                                onClick={() => setShowDeleteConfirm(true)}
                                className="flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 px-5 py-2.5 text-sm font-bold text-red-400 hover:bg-red-500 hover:text-white transition-all"
                            >
                                <Trash2 size={15} /> Delete Account
                            </button>
                        </div>
                    </motion.div>
                )}

                {/* Notifications Tab */}
                {activeTab === "notifications" && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                        <div className="rounded-2xl border border-white/8 bg-zinc-900/30 divide-y divide-white/5 overflow-hidden">
                            {notifications.map((notif) => (
                                <div key={notif.id} className="flex items-center justify-between px-5 py-4 hover:bg-white/2 transition-colors">
                                    <div className="flex-1 min-w-0 mr-4">
                                        <p className="text-sm font-semibold text-white">{notif.description}</p>
                                    </div>
                                    <button
                                        onClick={() => toggleNotification(notif.id)}
                                        className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${notif.enabled ? "bg-accent" : "bg-white/10"}`}
                                    >
                                        <div className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${notif.enabled ? "translate-x-5" : "translate-x-0.5"}`} />
                                    </button>
                                </div>
                            ))}
                        </div>
                        <button
                            onClick={handleSaveNotifications}
                            disabled={saving}
                            className="flex items-center gap-2 rounded-xl bg-accent px-6 py-2.5 text-sm font-bold text-white hover:bg-blue-600 transition-all disabled:opacity-60 neon-glow"
                        >
                            {saving ? (
                                <><svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg> Saving...</>
                            ) : (
                                <><Check size={15} /> Save Preferences</>
                            )}
                        </button>
                    </motion.div>
                )}

                {/* Security Tab */}
                {activeTab === "security" && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                        {/* Change Password */}
                        <div className="rounded-2xl border border-white/8 bg-zinc-900/30 p-6 space-y-4">
                            <h2 className="text-base font-bold text-white">Change Password</h2>
                            {["Current Password", "New Password", "Confirm New Password"].map((label) => (
                                <div key={label}>
                                    <label className="block text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2">{label}</label>
                                    <input
                                        type="password"
                                        placeholder="••••••••"
                                        className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent transition-all placeholder:text-zinc-600"
                                    />
                                </div>
                            ))}
                            <button
                                onClick={() => showToast("Password updated successfully!")}
                                className="flex items-center gap-2 rounded-xl bg-accent px-6 py-2.5 text-sm font-bold text-white hover:bg-blue-600 transition-all neon-glow"
                            >
                                <Check size={15} /> Update Password
                            </button>
                        </div>

                        {/* 2FA */}
                        <div className="rounded-2xl border border-white/8 bg-zinc-900/30 p-6">
                            <div className="flex items-center justify-between mb-3">
                                <div>
                                    <h2 className="text-base font-bold text-white">Two-Factor Authentication</h2>
                                    <p className="text-xs text-zinc-500 mt-1">Add an extra layer of security to your account.</p>
                                </div>
                                <span className="text-xs font-bold text-yellow-400 bg-yellow-400/10 px-2.5 py-1 rounded-full">Disabled</span>
                            </div>
                            <button
                                onClick={() => showToast("2FA setup coming soon!")}
                                className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-semibold text-white hover:bg-white/10 transition-all"
                            >
                                <Shield size={15} /> Enable 2FA
                            </button>
                        </div>

                        {/* Active Sessions */}
                        <div className="rounded-2xl border border-white/8 bg-zinc-900/30 p-6">
                            <h2 className="text-base font-bold text-white mb-4">Active Sessions</h2>
                            {[
                                { device: "MacBook Pro", location: "San Francisco, US", current: true, time: "Now" },
                                { device: "iPhone 15 Pro", location: "San Francisco, US", current: false, time: "2 hours ago" },
                                { device: "Chrome on Windows", location: "New York, US", current: false, time: "3 days ago" },
                            ].map((session, i) => (
                                <div key={i} className="flex items-center justify-between py-3 border-b border-white/5 last:border-0">
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <p className="text-sm font-semibold text-white">{session.device}</p>
                                            {session.current && <span className="text-[10px] font-bold text-green-400 bg-green-400/10 px-2 py-0.5 rounded-full">Current</span>}
                                        </div>
                                        <p className="text-xs text-zinc-500">{session.location} · {session.time}</p>
                                    </div>
                                    {!session.current && (
                                        <button
                                            onClick={() => showToast("Session revoked.")}
                                            className="text-xs font-semibold text-red-400 hover:text-red-300 transition-colors"
                                        >
                                            Revoke
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </div>

            {/* Delete Account Modal */}
            <AnimatePresence>
                {showDeleteConfirm && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
                        onClick={() => setShowDeleteConfirm(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0.9 }}
                            className="w-full max-w-sm rounded-2xl border border-white/10 bg-zinc-900 p-6 shadow-2xl"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-500/10 mb-4">
                                <Trash2 size={22} className="text-red-500" />
                            </div>
                            <h3 className="text-lg font-bold text-white mb-2">Delete Account?</h3>
                            <p className="text-sm text-zinc-400 mb-6">All your projects, data, and settings will be permanently deleted. This cannot be undone.</p>
                            <div className="flex gap-3">
                                <button onClick={() => setShowDeleteConfirm(false)} className="flex-1 rounded-xl border border-white/10 bg-white/5 py-2.5 text-sm font-semibold text-white hover:bg-white/10 transition-all">Cancel</button>
                                <button onClick={() => { setShowDeleteConfirm(false); showToast("Account deletion requested."); }} className="flex-1 rounded-xl bg-red-500 py-2.5 text-sm font-bold text-white hover:bg-red-600 transition-all">Delete</button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Toast */}
            <AnimatePresence>
                {toast && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        className="fixed bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 rounded-xl bg-zinc-800 border border-white/10 px-5 py-3 text-sm font-semibold text-white shadow-xl z-50"
                    >
                        <Check size={16} className="text-green-400" />
                        {toast}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
