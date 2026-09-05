import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  X, Lock, Key, User, BarChart2, Briefcase, FileText, Award,
  CheckCircle, Plus, Trash2, Save, RotateCcw, Download, Upload,
  Layers, LogOut, Check, AlertCircle, Eye, EyeOff, ShieldCheck,
  Edit2, Globe, Cloud, RefreshCw, ChevronUp, ChevronDown,
  Building2, Tag, BookOpen, Quote, Shield, Zap, Sparkles,
  Camera, Image as ImageIcon, UploadCloud, Link as LinkIcon, CheckCircle2,
  Calendar, Copy, Clock, ArrowRight, Share2, ListFilter, Palette, UserPlus, Users, Inbox
} from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';
import { getLinkedInDateInfo, getTotalCareerExperience, formatExperienceText } from '../utils/dateUtils';
import { FormattedText } from './FormattedText';
import { ThemeManagerTab } from './admin/ThemeManagerTab';
import { SecurityTab } from './admin/SecurityTab';
import { InquiriesTab } from './admin/InquiriesTab';
import { AnalyticsTab } from './admin/AnalyticsTab';
import {
  SocialIcon,
  getPlatformName,
  getPlatformHelpText,
  getSocialHref,
  normalizePlatform,
  SUPPORTED_PLATFORMS,
} from './SocialIcon';
import {
  PortfolioData,
  CaseStudy,
  StatItem,
  SkillItem,
  TimelineItemData,
  ExpertiseItem,
  TestimonialItem,
  CertificationItem,
  SocialLinkItem,
  defaultContactModules,
  PortfolioThemeData,
  AdminUser,
  portfolioData as initialDefaultPortfolioData
} from '../data/portfolioData';

type TabType =
  | 'analytics'
  | 'inquiries'
  | 'profile'
  | 'themes'
  | 'social'
  | 'contactModules'
  | 'experienceDates'
  | 'stats'
  | 'expertise'
  | 'caseStudies'
  | 'skills'
  | 'timeline'
  | 'testimonials'
  | 'certifications'
  | 'industries'
  | 'security'
  | 'backup';

export const AdminPortalModal: React.FC = () => {
  const {
    data,
    inquiries,
    syncStatus,
    isSyncing,
    isAdminAuthenticated,
    isAdminModalOpen,
    closeAdminModal,
    authenticateAdmin,
    logoutAdmin,
    updateAdminPin,
    updateSocialLinks,
    savePortfolioData,
  } = usePortfolio();

  // Local draft state that holds uncommitted edits
  const [draftData, setDraftData] = useState<PortfolioData>(data);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('profile');
  const [saveSuccessNotice, setSaveSuccessNotice] = useState<string | null>(null);

  // Backup JSON state
  const [jsonImportText, setJsonImportText] = useState('');
  const [importStatus, setImportStatus] = useState<string | null>(null);

  // Picture Upload State
  const [customPhotoUrl, setCustomPhotoUrl] = useState('');
  const [isProcessingPhoto, setIsProcessingPhoto] = useState(false);
  const [photoUploadError, setPhotoUploadError] = useState<string | null>(null);
  const [isDraggingPhoto, setIsDraggingPhoto] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Template copy feedback
  const [copiedTag, setCopiedTag] = useState<string | null>(null);
  const copyTemplateTag = (tag: string) => {
    navigator.clipboard.writeText(tag);
    setCopiedTag(tag);
    setTimeout(() => setCopiedTag(null), 2500);
  };

  // Contact Module Dropdown State
  const [newModuleInput, setNewModuleInput] = useState('');

  // Sync draft state only when modal transitions from closed to open
  const prevModalOpenRef = useRef(false);
  useEffect(() => {
    if (isAdminModalOpen && !prevModalOpenRef.current) {
      setDraftData(data);
      setSaveSuccessNotice(null);
      setCustomPhotoUrl(data.consultant.avatarUrl || '');
      setPhotoUploadError(null);
    }
    prevModalOpenRef.current = isAdminModalOpen;
  }, [isAdminModalOpen, data]);

  // Check if draft has unsaved differences from live saved data
  const isDirty = useMemo(() => {
    return JSON.stringify(draftData) !== JSON.stringify(data);
  }, [draftData, data]);

  if (!isAdminModalOpen) return null;

  const triggerNotice = (message: string) => {
    setSaveSuccessNotice(message);
    setTimeout(() => setSaveSuccessNotice(null), 4000);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    const cleanUser = usernameInput.trim();
    const cleanPass = passwordInput.trim();

    if (!cleanUser) {
      setLoginError('Please enter your administrator username.');
      return;
    }

    if (cleanPass.length < 8) {
      setLoginError('Password must be a minimum of 8 digits or characters.');
      return;
    }

    if (authenticateAdmin(cleanUser, cleanPass)) {
      setUsernameInput('');
      setPasswordInput('');
      setLoginError('');
    } else {
      setLoginError('Invalid username or password. Please verify your credentials.');
    }
  };

  // Explicit Save Changes Handler
  const handleSaveChanges = async () => {
    setIsSaving(true);
    const success = await savePortfolioData(draftData);
    setIsSaving(false);
    if (success) {
      triggerNotice('✓ All changes saved and published live to website!');
    } else {
      triggerNotice('⚠️ Could not connect to remote cloud database, saved locally.');
    }
  };

  // Discard Changes Handler
  const handleDiscardChanges = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setDraftData(data);
    triggerNotice('Unsaved edits discarded. Reverted to live version.');
  };

  // Safe Close Handler
  const handleSafeClose = () => {
    closeAdminModal();
  };

  // Export JSON
  const handleDownloadJSON = () => {
    const jsonStr = JSON.stringify(draftData, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Syed_M_Ahsan_Shah_Portfolio_Data_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    triggerNotice('JSON backup downloaded');
  };

  // Import JSON into draft
  const handleImportSubmit = () => {
    try {
      const parsed = JSON.parse(jsonImportText);
      if (parsed.consultant && parsed.statistics && parsed.expertise) {
        setDraftData({
          ...initialDefaultPortfolioData,
          ...parsed,
          socialLinks: parsed.socialLinks || initialDefaultPortfolioData.socialLinks || [],
          contactModules: parsed.contactModules || initialDefaultPortfolioData.contactModules || defaultContactModules,
        });
        setImportStatus('JSON loaded into draft! Click "Save Changes" to publish live to website.');
        triggerNotice('JSON loaded into draft. Click Save Changes to publish.');
        setJsonImportText('');
      } else {
        setImportStatus('Invalid JSON schema. Missing required sections.');
      }
    } catch (e) {
      setImportStatus('Failed to parse JSON. Please check syntax.');
    }
  };

  // Local Draft Helpers
  const updateDraftConsultant = (patch: Partial<PortfolioData['consultant']>) => {
    setDraftData((prev) => {
      const updatedConsultant = {
        ...prev.consultant,
        ...patch,
      };

      // If careerStartDate was updated, automatically re-compute experience and sync stat metric #1
      let updatedStats = prev.statistics;
      if (patch.careerStartDate !== undefined) {
        const exp = getTotalCareerExperience(patch.careerStartDate, prev.timeline);
        updatedConsultant.yearsOfExperience = exp.yearsPlusText;
        updatedStats = prev.statistics.map((stat, idx) => {
          if (idx === 0 && (/experience/i.test(stat.label) || /years/i.test(stat.label))) {
            return { ...stat, value: exp.yearsPlus };
          }
          return stat;
        });
      }

      return {
        ...prev,
        consultant: updatedConsultant,
        statistics: updatedStats,
      };
    });
  };

  const handleCareerStartDateChange = (newStart: string) => {
    setDraftData((prev) => {
      const exp = getTotalCareerExperience(newStart, prev.timeline);
      const updatedStats = prev.statistics.map((stat, idx) => {
        if (idx === 0 && (/experience/i.test(stat.label) || /years/i.test(stat.label))) {
          return { ...stat, value: exp.yearsPlus };
        }
        return stat;
      });
      return {
        ...prev,
        consultant: {
          ...prev.consultant,
          careerStartDate: newStart,
          yearsOfExperience: exp.yearsPlusText,
        },
        statistics: updatedStats,
      };
    });
  };

  // Social Links Handlers
  const persistSocialLinksList = async (updatedList: SocialLinkItem[], noticeMsg?: string) => {
    setDraftData((prev) => ({
      ...prev,
      socialLinks: updatedList,
    }));
    try {
      await updateSocialLinks(updatedList);
      if (noticeMsg) {
        triggerNotice(noticeMsg);
      }
    } catch (err) {
      console.error('Failed to update social links:', err);
    }
  };

  const updateDraftSocialLinks = (updated: SocialLinkItem[]) => {
    persistSocialLinksList(updated);
  };

  const updateSingleSocialLink = (id: string, patch: Partial<SocialLinkItem>) => {
    setDraftData((prev) => {
      const currentList = prev.socialLinks !== undefined ? prev.socialLinks : (initialDefaultPortfolioData.socialLinks || []);
      const updated = currentList.map((item) => {
        if (item.id === id) {
          const newItem = { ...item, ...patch };
          if (patch.icon && (!patch.name || patch.name === getPlatformName(item.icon))) {
            newItem.name = getPlatformName(patch.icon);
          }
          return newItem;
        }
        return item;
      });
      return {
        ...prev,
        socialLinks: updated,
      };
    });
  };

  const handleToggleSocialLinkVisibility = (id: string) => {
    const currentList = draftData.socialLinks !== undefined ? draftData.socialLinks : (initialDefaultPortfolioData.socialLinks || []);
    const updated = currentList.map((item) => {
      if (item.id === id) {
        return { ...item, hidden: !item.hidden };
      }
      return item;
    });
    persistSocialLinksList(updated, '✓ Channel visibility updated & saved permanently!');
  };

  const handleAddSocialLink = (presetIcon?: string, presetUrl?: string) => {
    const iconName = presetIcon || 'linkedin';
    const foundPlatform = SUPPORTED_PLATFORMS.find((p) => p.id === normalizePlatform(iconName));
    let defaultUrl = presetUrl || (foundPlatform ? foundPlatform.defaultUrl : '');
    if (!defaultUrl) {
      if (iconName === 'email') defaultUrl = draftData.consultant.email || 'smahsan52@hotmail.com';
      else if (iconName === 'phone' || iconName === 'whatsapp') defaultUrl = draftData.consultant.phone || '+92 300 2711390';
    }

    const newLink: SocialLinkItem = {
      id: `social-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      name: getPlatformName(iconName),
      icon: iconName,
      url: defaultUrl,
      hidden: false,
    };

    const currentList = draftData.socialLinks !== undefined ? draftData.socialLinks : (initialDefaultPortfolioData.socialLinks || []);
    const updated = [...currentList, newLink];
    persistSocialLinksList(updated, `✓ Added ${getPlatformName(iconName)} & saved permanently!`);
  };

  const handleAddAllMissingSocialLinks = () => {
    const currentList = draftData.socialLinks !== undefined ? draftData.socialLinks : (initialDefaultPortfolioData.socialLinks || []);
    const existingIcons = new Set(currentList.map((l) => normalizePlatform(l.icon)));
    const toAdd: SocialLinkItem[] = [];

    for (const p of SUPPORTED_PLATFORMS) {
      if (!existingIcons.has(p.id)) {
        let url = p.defaultUrl;
        if (p.id === 'email' && draftData.consultant.email) url = draftData.consultant.email;
        if ((p.id === 'phone' || p.id === 'whatsapp') && draftData.consultant.phone) url = draftData.consultant.phone;
        toAdd.push({
          id: `social-${Date.now()}-${Math.random().toString(36).substr(2, 4)}-${p.id}`,
          name: p.name,
          icon: p.id,
          url,
          hidden: false,
        });
      }
    }

    if (toAdd.length === 0) {
      triggerNotice('All platforms are already added to your profile!');
      return;
    }

    const updated = [...currentList, ...toAdd];
    persistSocialLinksList(updated, `✓ Added ${toAdd.length} platforms & saved permanently!`);
  };

  const handleResetDefaultSocialLinks = () => {
    const defaults = initialDefaultPortfolioData.socialLinks || [];
    persistSocialLinksList(defaults, '✓ Reset to core recommended channels (LinkedIn, WhatsApp, Email, Phone) & saved permanently!');
  };

  const handleDeleteSocialLink = (id: string) => {
    const currentList = draftData.socialLinks !== undefined ? draftData.socialLinks : (initialDefaultPortfolioData.socialLinks || []);
    const updated = currentList.filter((item) => item.id !== id);
    persistSocialLinksList(updated, '✓ Social link removed & saved permanently!');
  };

  const handleMoveSocialLink = (index: number, direction: 'up' | 'down') => {
    const list = [...(draftData.socialLinks !== undefined ? draftData.socialLinks : (initialDefaultPortfolioData.socialLinks || []))];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= list.length) return;
    const temp = list[index];
    list[index] = list[targetIndex];
    list[targetIndex] = temp;
    persistSocialLinksList(list, '✓ Channels reordered & saved permanently!');
  };

  const handleSelectPlatformChange = (id: string, selectedVal: string) => {
    if (selectedVal === 'custom') return;
    const meta = SUPPORTED_PLATFORMS.find((p) => p.id === selectedVal);
    const currentList = draftData.socialLinks !== undefined ? draftData.socialLinks : (initialDefaultPortfolioData.socialLinks || []);
    const updated = currentList.map((item) => {
      if (item.id === id) {
        let newUrl = item.url;
        if (!newUrl || newUrl.trim() === '' || (newUrl.startsWith('https://') && newUrl.length < 15)) {
          if (selectedVal === 'email') newUrl = draftData.consultant.email || 'smahsan52@hotmail.com';
          else if (selectedVal === 'phone' || selectedVal === 'whatsapp') newUrl = draftData.consultant.phone || '+92 300 2711390';
          else newUrl = meta?.defaultUrl || '';
        }
        return {
          ...item,
          icon: selectedVal,
          name: meta?.name || getPlatformName(selectedVal),
          url: newUrl,
        };
      }
      return item;
    });
    persistSocialLinksList(updated, `✓ Platform changed to ${meta?.name || getPlatformName(selectedVal)} & saved permanently!`);
  };

  const handleAutoSaveSocial = () => {
    const list = draftData.socialLinks !== undefined ? draftData.socialLinks : (initialDefaultPortfolioData.socialLinks || []);
    persistSocialLinksList(list, '✓ Social icon saved permanently.');
  };

  // Contact Module Dropdown Handlers
  const handleAddContactModule = (textToAdd?: string) => {
    const raw = textToAdd !== undefined ? textToAdd : newModuleInput;
    const trimmed = raw.trim();
    if (!trimmed) {
      triggerNotice('Please enter an option name before adding.');
      return;
    }

    const currentList = draftData.contactModules || initialDefaultPortfolioData.contactModules || defaultContactModules;
    if (currentList.some((item) => item.toLowerCase() === trimmed.toLowerCase())) {
      triggerNotice(`"${trimmed}" is already present in the dropdown list.`);
      return;
    }

    const updated = [...currentList, trimmed];
    setDraftData((prev) => ({
      ...prev,
      contactModules: updated,
    }));

    if (textToAdd === undefined) {
      setNewModuleInput('');
    }
    triggerNotice(`Added "${trimmed}" to dropdown options.`);
  };

  const handleUpdateContactModule = (index: number, value: string) => {
    setDraftData((prev) => {
      const currentList = [...(prev.contactModules || initialDefaultPortfolioData.contactModules || defaultContactModules)];
      if (index >= 0 && index < currentList.length) {
        currentList[index] = value;
      }
      return {
        ...prev,
        contactModules: currentList,
      };
    });
  };

  const handleDeleteContactModule = (index: number) => {
    const currentList = [...(draftData.contactModules || initialDefaultPortfolioData.contactModules || defaultContactModules)];
    if (currentList.length <= 1) {
      triggerNotice('Dropdown must contain at least one option.');
      return;
    }
    const removedItem = currentList[index];
    currentList.splice(index, 1);
    setDraftData((prev) => ({
      ...prev,
      contactModules: currentList,
    }));
    triggerNotice(`Removed "${removedItem}" from dropdown.`);
  };

  const handleMoveContactModule = (index: number, direction: 'up' | 'down') => {
    setDraftData((prev) => {
      const currentList = [...(prev.contactModules || initialDefaultPortfolioData.contactModules || defaultContactModules)];
      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= currentList.length) return prev;
      const temp = currentList[index];
      currentList[index] = currentList[targetIndex];
      currentList[targetIndex] = temp;
      return {
        ...prev,
        contactModules: currentList,
      };
    });
  };

  const handleResetDefaultContactModules = () => {
    setDraftData((prev) => ({
      ...prev,
      contactModules: [...defaultContactModules],
    }));
    triggerNotice('Restored standard SAP module options.');
  };

  const handleAutoSaveContactModules = () => {
    savePortfolioData(draftData);
    triggerNotice('✓ Contact dropdown options saved automatically.');
  };

  // Photo Upload & Processing Handlers
  const processImageFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setPhotoUploadError('Please select a valid image file (PNG, JPG, JPEG, WebP).');
      return;
    }

    setPhotoUploadError(null);
    setIsProcessingPhoto(true);

    const reader = new FileReader();
    reader.onerror = () => {
      setIsProcessingPhoto(false);
      setPhotoUploadError('Error reading file. Please try another image.');
    };

    reader.onload = (e) => {
      const img = new Image();
      img.onerror = () => {
        setIsProcessingPhoto(false);
        setPhotoUploadError('Unable to load image. The format might be corrupted.');
      };

      img.onload = () => {
        try {
          // Resize with canvas to max 800x800 for optimal quality and small payload size
          const maxDim = 800;
          let width = img.width;
          let height = img.height;

          if (width > maxDim || height > maxDim) {
            if (width > height) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            } else {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            const optimizedDataUrl = canvas.toDataURL('image/jpeg', 0.88);
            updateDraftConsultant({ avatarUrl: optimizedDataUrl });
            setCustomPhotoUrl('');
            triggerNotice('✓ Picture uploaded successfully! Click "Save Changes" to publish live.');
          } else {
            updateDraftConsultant({ avatarUrl: e.target?.result as string });
            triggerNotice('✓ Picture uploaded! Click "Save Changes" to publish live.');
          }
        } catch (err) {
          console.warn('Canvas optimization fallback:', err);
          updateDraftConsultant({ avatarUrl: e.target?.result as string });
          triggerNotice('✓ Picture uploaded! Click "Save Changes" to publish live.');
        } finally {
          setIsProcessingPhoto(false);
        }
      };

      img.src = e.target?.result as string;
    };

    reader.readAsDataURL(file);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      processImageFile(files[0]);
    }
  };

  const handleDropPhoto = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDraggingPhoto(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processImageFile(e.dataTransfer.files[0]);
    }
  };

  const handleApplyCustomPhotoUrl = (url: string) => {
    if (!url.trim()) return;
    updateDraftConsultant({ avatarUrl: url.trim() });
    setCustomPhotoUrl(url.trim());
    triggerNotice('✓ Picture URL applied! Click "Save Changes" to publish live.');
  };

  const handleRemovePhoto = () => {
    updateDraftConsultant({ avatarUrl: '' });
    setCustomPhotoUrl('');
    triggerNotice('Picture removed. Monogram initials will be displayed.');
  };

  const updateDraftStatistics = (stats: StatItem[]) => {
    setDraftData((prev) => ({
      ...prev,
      statistics: stats,
    }));
  };

  const updateDraftExpertise = (expertise: ExpertiseItem[]) => {
    setDraftData((prev) => ({
      ...prev,
      expertise,
    }));
  };

  const updateDraftCaseStudies = (caseStudies: CaseStudy[]) => {
    setDraftData((prev) => ({
      ...prev,
      caseStudies,
    }));
  };

  const updateDraftSkills = (skills: SkillItem[]) => {
    setDraftData((prev) => ({
      ...prev,
      skills,
    }));
  };

  const updateDraftTimeline = (timeline: TimelineItemData[]) => {
    setDraftData((prev) => {
      // Respect consultant.careerStartDate if set, otherwise resolve from earliest timeline date
      const effectiveStart = prev.consultant.careerStartDate || undefined;
      const exp = getTotalCareerExperience(effectiveStart, timeline);
      const earliestDate = `${exp.startYear}-${String(exp.startMonth).padStart(2, '0')}`;

      // Update statistics experience metric value
      const updatedStats = prev.statistics.map((stat, idx) => {
        if (idx === 0 && (/experience/i.test(stat.label) || /years/i.test(stat.label))) {
          return { ...stat, value: exp.yearsPlus };
        }
        return stat;
      });

      return {
        ...prev,
        timeline,
        consultant: {
          ...prev.consultant,
          careerStartDate: prev.consultant.careerStartDate || earliestDate,
          yearsOfExperience: exp.yearsPlusText,
        },
        statistics: updatedStats,
      };
    });
  };

  const updateDraftTestimonials = (testimonials: TestimonialItem[]) => {
    setDraftData((prev) => ({
      ...prev,
      testimonials,
    }));
  };

  const updateDraftCertifications = (certifications: CertificationItem[]) => {
    setDraftData((prev) => ({
      ...prev,
      certifications,
    }));
  };

  const updateDraftIndustries = (industries: string[]) => {
    setDraftData((prev) => ({
      ...prev,
      industriesMarquee: industries,
    }));
  };

  return (
    <div
      id="admin-portal-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md animate-fadeIn"
      onClick={handleSafeClose}
    >
      <div
        id="admin-portal-modal-content"
        className="relative w-full max-w-6xl bg-[#0D1424] border border-[#1E2C48] rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[94vh] text-[#F2F5F9]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-4 border-b border-[#1E2C48] bg-[#0A0E1A]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#121B2E] border border-[#3B82F6]/40 flex items-center justify-center text-[#D9A94E]">
              <Lock className="w-4 h-4 text-[#D9A94E]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-heading font-bold text-base sm:text-lg text-[#F2F5F9]">
                  Consultant Management Portal
                </h2>
                {isAdminAuthenticated && (
                  isDirty ? (
                    <span className="text-[11px] font-mono font-semibold px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30 flex items-center gap-1.5 animate-pulse">
                      <span className="w-2 h-2 rounded-full bg-amber-400" />
                      <span>Unsaved Changes</span>
                    </span>
                  ) : (
                    <span className="text-[11px] font-mono font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-400" />
                      <span>Saved & Synced</span>
                    </span>
                  )
                )}
              </div>
              <p className="text-[11px] text-[#8B97AC]">
                Edits take effect only after clicking <strong className="text-[#F2F5F9]">Save Changes</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Header Action Buttons when Authenticated */}
            {isAdminAuthenticated && (
              <>
                {/* Discard button */}
                {isDirty && (
                  <button
                    type="button"
                    id="admin-discard-btn-header"
                    onClick={handleDiscardChanges}
                    className="px-3 py-1.5 rounded-xl bg-[#121B2E] hover:bg-rose-500/20 text-[#8B97AC] hover:text-rose-300 border border-[#1E2C48] hover:border-rose-500/50 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                    title="Discard Unsaved Changes"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Discard</span>
                  </button>
                )}

                {/* Primary Save Button in Header */}
                <button
                  id="admin-save-btn-header"
                  onClick={handleSaveChanges}
                  disabled={isSaving || !isDirty}
                  className={`px-4 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-md ${
                    isDirty
                      ? 'bg-[#2F6FED] hover:bg-[#3B82F6] text-white ring-2 ring-[#3B82F6]/50 shadow-[#2F6FED]/30 scale-100'
                      : 'bg-[#121B2E] text-[#8B97AC] border border-[#1E2C48] opacity-60 cursor-not-allowed'
                  }`}
                  title={isDirty ? 'Click to save all changes live' : 'No unsaved changes'}
                >
                  {isSaving ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-3.5 h-3.5" />
                      <span>Save Changes</span>
                      {isDirty && <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />}
                    </>
                  )}
                </button>

                <div className="h-5 w-px bg-[#1E2C48] mx-1" />

                <button
                  onClick={logoutAdmin}
                  className="p-2 rounded-xl bg-[#121B2E] hover:bg-rose-500/20 text-[#8B97AC] hover:text-rose-400 border border-[#1E2C48] text-xs font-semibold flex items-center gap-1.5 transition-colors"
                  title="Log Out"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden md:inline">Log Out</span>
                </button>
              </>
            )}

            <button
              onClick={handleSafeClose}
              className="p-2 rounded-xl bg-[#121B2E] hover:bg-[#1E2C48] text-[#8B97AC] hover:text-[#F2F5F9] border border-[#1E2C48] transition-colors"
              aria-label="Close Admin Modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Global Save Notice / Sync Banner */}
        {saveSuccessNotice ? (
          <div className="bg-emerald-500/15 border-b border-emerald-500/30 px-6 py-2.5 flex items-center justify-between text-xs font-semibold text-emerald-400 animate-fadeIn">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 shrink-0" />
              <span>{saveSuccessNotice}</span>
            </div>
            <button onClick={() => setSaveSuccessNotice(null)} className="text-emerald-400/70 hover:text-emerald-300">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : isSyncing ? (
          <div className="bg-[#3B82F6]/15 border-b border-[#3B82F6]/30 px-6 py-2 flex items-center gap-2 text-xs font-semibold text-[#3B82F6] animate-fadeIn">
            <RefreshCw className="w-3.5 h-3.5 animate-spin shrink-0" />
            <span>Publishing changes live to database...</span>
          </div>
        ) : null}

        {/* Not Authenticated: Username & Password Screen */}
        {!isAdminAuthenticated ? (
          <div className="p-8 sm:p-12 flex flex-col items-center justify-center text-center max-w-md mx-auto my-auto w-full">
            <div className="w-16 h-16 rounded-2xl bg-[#121B2E] border-2 border-[#3B82F6]/50 flex items-center justify-center text-[#3B82F6] mb-5 shadow-lg shadow-[#2F6FED]/10">
              <Key className="w-8 h-8 text-[#D9A94E]" />
            </div>

            <h3 className="font-heading font-bold text-xl text-[#F2F5F9] mb-1.5">
              Admin Portal Authentication
            </h3>
            <p className="text-xs text-[#8B97AC] mb-6 leading-relaxed">
              Enter your consultant administrator username and password (minimum 8 characters) to access the control dashboard.
            </p>

            <form onSubmit={handleLogin} className="w-full space-y-4 text-left">
              {/* Username Input Field */}
              <div>
                <label className="block text-[11px] font-semibold text-[#C4CCDA] uppercase tracking-wider mb-1.5">
                  Admin Username
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#8B97AC]">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    placeholder="Enter admin username (e.g. admin)"
                    value={usernameInput}
                    onChange={(e) => setUsernameInput(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#121B2E] border border-[#1E2C48] focus:border-[#3B82F6] text-sm text-[#F2F5F9] placeholder-[#8B97AC] focus:outline-none transition-colors"
                    autoFocus
                    required
                  />
                </div>
              </div>

              {/* Password Input Field (Min 8 characters) */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-[11px] font-semibold text-[#C4CCDA] uppercase tracking-wider">
                    Password
                  </label>
                  <span className="text-[10px] text-[#8B97AC]">
                    Minimum 8 characters
                  </span>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#8B97AC]">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter password (min 8 digits/chars)"
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    minLength={8}
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-[#121B2E] border border-[#1E2C48] focus:border-[#3B82F6] text-sm text-[#F2F5F9] font-mono placeholder-[#8B97AC] focus:outline-none transition-colors"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8B97AC] hover:text-[#F2F5F9] p-1"
                    title={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {loginError && (
                <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-400 text-xs flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{loginError}</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-[#2F6FED] hover:bg-[#3B82F6] text-white text-xs font-semibold tracking-wide transition-all shadow-lg shadow-[#2F6FED]/25 active:scale-95 cursor-pointer mt-1"
              >
                Sign In to Admin Panel
              </button>
            </form>

            <div className="mt-7 pt-4 border-t border-[#1E2C48] text-[11px] text-[#8B97AC] flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#D9A94E]" />
              <span>Multi-User Authentication · Firebase Firestore Synced</span>
            </div>
          </div>
        ) : (
          /* Authenticated Dashboard Tabs & Editor Views */
          <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
            
            {/* Sidebar Navigation */}
            <div className="w-full md:w-60 bg-[#0A0E1A] border-r border-[#1E2C48] p-3 flex md:flex-col gap-1 overflow-x-auto md:overflow-y-auto shrink-0">
              {[
                {
                  id: 'analytics',
                  label: 'Traffic & Views',
                  icon: Eye,
                },
                {
                  id: 'inquiries',
                  label: 'Client Inquiries',
                  icon: Inbox,
                  badge: inquiries.filter((i) => i.status === 'new').length,
                },
                { id: 'profile', label: 'Consultant Profile & Bio', icon: User },
                { id: 'themes', label: 'Color Themes', icon: Palette },
                { id: 'social', label: 'Social Media & Connect', icon: Share2 },
                { id: 'contactModules', label: 'Contact Dropdown (PP/QM)', icon: ListFilter },
                { id: 'experienceDates', label: 'Experience Dates', icon: Calendar },
                { id: 'stats', label: 'Key Statistics', icon: BarChart2 },
                { id: 'expertise', label: 'Core Disciplines / SAP', icon: Zap },
                { id: 'caseStudies', label: 'Case Studies & Projects', icon: Briefcase },
                { id: 'skills', label: 'Skills Matrix', icon: Award },
                { id: 'timeline', label: 'Career Timeline', icon: FileText },
                { id: 'testimonials', label: 'Client Feedback', icon: Quote },
                { id: 'certifications', label: 'Certifications', icon: Shield },
                { id: 'industries', label: 'Industries Ticker', icon: Building2 },
                { id: 'security', label: 'Security & Users', icon: Key },
                { id: 'backup', label: 'Backup & JSON', icon: Download },
              ].map((tab) => {
                const Icon = tab.icon;
                const isSelected = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as TabType)}
                    className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-medium transition-all whitespace-nowrap text-left ${
                      isSelected
                        ? 'bg-[#121B2E] text-[#F2F5F9] font-semibold border border-[#3B82F6]/50 shadow-sm'
                        : 'text-[#8B97AC] hover:bg-[#121B2E]/50 hover:text-[#F2F5F9]'
                    }`}
                  >
                    <Icon className={`w-4 h-4 shrink-0 ${isSelected ? 'text-[#3B82F6]' : 'text-[#8B97AC]'}`} />
                    <span className="flex-1">{tab.label}</span>
                    {Boolean(tab.badge && tab.badge > 0) && (
                      <span className="px-1.5 py-0.5 rounded-full bg-amber-500 text-black font-bold text-[10px] ml-auto">
                        {tab.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col overflow-hidden bg-[#0D1424]">
              
              {/* Scrollable Form Body */}
              <div className="flex-1 p-6 sm:p-8 overflow-y-auto space-y-8">

                {/* TAB: ANALYTICS & TRAFFIC */}
                {activeTab === 'analytics' && (
                  <AnalyticsTab />
                )}

                {/* TAB 0: CLIENT INQUIRIES */}
                {activeTab === 'inquiries' && (
                  <InquiriesTab />
                )}
                
                {/* TAB 1: PROFILE & BIO */}
                {activeTab === 'profile' && (
                  <div className="space-y-8">
                    <div className="flex items-center justify-between pb-4 border-b border-[#1E2C48]">
                      <div>
                        <h3 className="font-heading font-bold text-lg text-[#F2F5F9]">
                          Consultant Profile, Identity & Bio
                        </h3>
                        <p className="text-xs text-[#8B97AC]">
                          Upload a portrait photo, update headline titles, brand text, contact channels, and biography.
                        </p>
                      </div>
                    </div>

                    {/* SECTION: Profile Picture / Portrait Photo Upload */}
                    <div className="p-5 sm:p-6 rounded-2xl bg-[#121B2E] border border-[#1E2C48] space-y-5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <div className="p-2 rounded-xl bg-[#2F6FED]/20 text-[#3B82F6] border border-[#2F6FED]/30">
                            <Camera className="w-4 h-4" />
                          </div>
                          <div>
                            <h4 className="text-xs font-mono font-bold text-[#D9A94E] uppercase tracking-wider">
                              Consultant Portrait & Hero Picture
                            </h4>
                            <p className="text-[11px] text-[#8B97AC]">
                              Upload your photo to display on the hero section portrait card. Saved when you click "Save Changes".
                            </p>
                          </div>
                        </div>

                        {draftData.consultant.avatarUrl ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/30 text-[11px] font-semibold text-emerald-400">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Custom Photo Active</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#1E2C48] text-[11px] font-medium text-[#8B97AC]">
                            <span>Monogram Active</span>
                          </span>
                        )}
                      </div>

                      {photoUploadError && (
                        <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 flex items-center gap-2 text-xs text-rose-300">
                          <AlertCircle className="w-4 h-4 shrink-0" />
                          <span>{photoUploadError}</span>
                        </div>
                      )}

                      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                        {/* Live Avatar Preview */}
                        <div className="md:col-span-4 flex flex-col items-center justify-center p-4 rounded-xl bg-[#0D1424] border border-[#1E2C48]">
                          <div className="relative mb-3">
                            <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-[#1E2C48] via-[#121B2E] to-[#0A0E1A] border-2 border-[#2F6FED]/40 p-1 flex items-center justify-center relative shadow-lg">
                              <div className="w-full h-full rounded-xl bg-[#0A0E1A] flex flex-col items-center justify-center relative overflow-hidden">
                                {draftData.consultant.avatarUrl ? (
                                  <img
                                    src={draftData.consultant.avatarUrl}
                                    alt="Consultant Preview"
                                    className="w-full h-full object-cover rounded-xl"
                                  />
                                ) : (
                                  <>
                                    <div className="absolute w-20 h-20 border border-[#2F6FED]/20 rounded-full" />
                                    <span className="font-heading font-extrabold text-2xl tracking-wider text-[#F2F5F9]">
                                      {draftData.consultant.brandInitials || 'SS'}
                                    </span>
                                    <span className="text-[9px] uppercase font-mono tracking-widest text-[#D9A94E] mt-0.5">
                                      SAP Lead
                                    </span>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="text-center">
                            <div className="text-xs font-bold text-[#F2F5F9]">
                              {draftData.consultant.name || 'Syed M. Ahsan Shah'}
                            </div>
                            <div className="text-[10px] text-[#8B97AC] font-mono mt-0.5">
                              Hero Portrait Preview
                            </div>
                          </div>
                        </div>

                        {/* Upload Controls & URL Input */}
                        <div className="md:col-span-8 space-y-4">
                          {/* Drag & Drop / File Selector Zone */}
                          <div
                            onDragOver={(e) => {
                              e.preventDefault();
                              setIsDraggingPhoto(true);
                            }}
                            onDragLeave={() => setIsDraggingPhoto(false)}
                            onDrop={handleDropPhoto}
                            onClick={() => fileInputRef.current?.click()}
                            className={`border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-all ${
                              isDraggingPhoto
                                ? 'border-[#3B82F6] bg-[#3B82F6]/10 shadow-lg'
                                : 'border-[#1E2C48] hover:border-[#3B82F6]/60 bg-[#0D1424]/60 hover:bg-[#0D1424]'
                            }`}
                          >
                            <input
                              type="file"
                              ref={fileInputRef}
                              onChange={handleFileInputChange}
                              accept="image/png, image/jpeg, image/jpg, image/webp, image/gif"
                              className="hidden"
                            />
                            
                            <div className="flex flex-col items-center justify-center gap-2">
                              <div className="w-10 h-10 rounded-full bg-[#121B2E] border border-[#1E2C48] flex items-center justify-center text-[#3B82F6]">
                                {isProcessingPhoto ? (
                                  <RefreshCw className="w-5 h-5 animate-spin text-[#D9A94E]" />
                                ) : (
                                  <UploadCloud className="w-5 h-5" />
                                )}
                              </div>

                              <div>
                                <div className="text-xs font-bold text-[#F2F5F9]">
                                  {isProcessingPhoto ? 'Processing and optimizing image...' : 'Click to browse or drag & drop photo here'}
                                </div>
                                <div className="text-[11px] text-[#8B97AC] mt-0.5">
                                  PNG, JPG, WebP supported • Automatically optimized for cloud storage
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Direct Image URL Input */}
                          <div className="space-y-1.5">
                            <label className="block text-[11px] font-semibold text-[#8B97AC]">
                              Or enter direct Image URL (e.g. LinkedIn, CDN, or Cloudinary URL)
                            </label>
                            <div className="flex items-center gap-2">
                              <div className="relative flex-1">
                                <LinkIcon className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#8B97AC]" />
                                <input
                                  type="url"
                                  placeholder="https://example.com/profile-photo.jpg"
                                  value={customPhotoUrl}
                                  onChange={(e) => setCustomPhotoUrl(e.target.value)}
                                  className="w-full pl-8 pr-3 py-2 rounded-xl bg-[#0D1424] border border-[#1E2C48] text-xs text-[#F2F5F9] focus:outline-none focus:border-[#3B82F6]"
                                />
                              </div>
                              <button
                                type="button"
                                onClick={() => handleApplyCustomPhotoUrl(customPhotoUrl)}
                                disabled={!customPhotoUrl.trim()}
                                className="px-3.5 py-2 rounded-xl bg-[#121B2E] hover:bg-[#1E2C48] text-xs font-semibold text-[#3B82F6] border border-[#1E2C48] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                              >
                                Apply URL
                              </button>
                            </div>
                          </div>

                          {/* Action Buttons & Presets */}
                          <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[#1E2C48]/60">
                            <div className="flex items-center gap-2">
                              {draftData.consultant.avatarUrl && (
                                <button
                                  type="button"
                                  onClick={handleRemovePhoto}
                                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-semibold transition-colors"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                  <span>Remove Photo (Use Monogram)</span>
                                </button>
                              )}
                            </div>

                            <div className="text-[11px] text-[#8B97AC] font-mono">
                              💡 Remember to click <span className="text-[#3B82F6] font-semibold">Save Changes</span> when done.
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Core Identity Details */}
                    <div className="space-y-4">
                      <h4 className="text-xs font-mono font-bold text-[#D9A94E] uppercase tracking-wider">
                        Identity & Header Information
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-[#C4CCDA] mb-1.5">
                            Full Name (Used globally across site)
                          </label>
                          <input
                            type="text"
                            value={draftData.consultant.name}
                            onChange={(e) => updateDraftConsultant({ name: e.target.value })}
                            className="w-full px-3.5 py-2.5 rounded-xl bg-[#121B2E] border border-[#1E2C48] text-xs text-[#F2F5F9] focus:outline-none focus:border-[#3B82F6]"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-[#C4CCDA] mb-1.5">Brand Logo Text</label>
                          <input
                            type="text"
                            value={draftData.consultant.brandText || draftData.consultant.name}
                            onChange={(e) => updateDraftConsultant({ brandText: e.target.value })}
                            className="w-full px-3.5 py-2.5 rounded-xl bg-[#121B2E] border border-[#1E2C48] text-xs text-[#F2F5F9] focus:outline-none focus:border-[#3B82F6]"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-[#C4CCDA] mb-1.5">Brand Initials Monogram</label>
                          <input
                            type="text"
                            value={draftData.consultant.brandInitials}
                            onChange={(e) => updateDraftConsultant({ brandInitials: e.target.value })}
                            className="w-full px-3.5 py-2.5 rounded-xl bg-[#121B2E] border border-[#1E2C48] text-xs text-[#F2F5F9] focus:outline-none focus:border-[#3B82F6]"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-[#C4CCDA] mb-1.5">Eyebrow Badge</label>
                          <input
                            type="text"
                            value={draftData.consultant.eyebrow}
                            onChange={(e) => updateDraftConsultant({ eyebrow: e.target.value })}
                            className="w-full px-3.5 py-2.5 rounded-xl bg-[#121B2E] border border-[#1E2C48] text-xs text-[#F2F5F9] focus:outline-none focus:border-[#3B82F6]"
                          />
                        </div>

                        <div className="sm:col-span-2">
                          <label className="block text-xs font-semibold text-[#C4CCDA] mb-1.5">Professional Title</label>
                          <input
                            type="text"
                            value={draftData.consultant.title}
                            onChange={(e) => updateDraftConsultant({ title: e.target.value })}
                            className="w-full px-3.5 py-2.5 rounded-xl bg-[#121B2E] border border-[#1E2C48] text-xs text-[#F2F5F9] focus:outline-none focus:border-[#3B82F6]"
                          />
                        </div>

                        <div className="sm:col-span-2">
                          <div className="flex items-center justify-between mb-1.5">
                            <label className="block text-xs font-semibold text-[#C4CCDA]">Tagline</label>
                            <button
                              type="button"
                              onClick={() => setActiveTab('experienceDates')}
                              className="text-[11px] text-[#3B82F6] hover:underline flex items-center gap-1 font-medium"
                            >
                              <Calendar className="w-3 h-3" />
                              <span>Adjust date in Experience Dates tab</span>
                            </button>
                          </div>
                          <textarea
                            rows={3}
                            value={draftData.consultant.tagline || ''}
                            onChange={(e) => updateDraftConsultant({ tagline: e.target.value })}
                            placeholder="Turning complex manufacturing operations into <strong>streamlined, SAP-driven processes</strong> — across {{TOTAL_YEARS_PLUS}} years..."
                            className="w-full px-3.5 py-2.5 rounded-xl bg-[#121B2E] border border-[#1E2C48] text-xs text-[#F2F5F9] focus:outline-none focus:border-[#3B82F6] font-mono leading-relaxed"
                          />
                          <p className="mt-1.5 text-[11px] text-[#8B97AC] leading-relaxed">
                            Plain text, or wrap a phrase in <code className="text-[#D9A94E]">&lt;strong&gt;...&lt;/strong&gt;</code> to bold it. Contains <code className="text-[#3B82F6] font-mono font-semibold">{`{{TOTAL_YEARS_PLUS}}`}</code> — leave it in place to keep the year count automatic (adjust the date in the <button type="button" onClick={() => setActiveTab('experienceDates')} className="text-[#3B82F6] underline hover:text-[#60A5FA]">Experience Dates</button> tab).
                          </p>
                          <div className="mt-2 p-3 rounded-xl bg-[#0D1424] border border-[#1E2C48]">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-[10px] font-mono text-[#8B97AC] uppercase tracking-wider font-semibold">
                                Live Rendered Tagline Preview
                              </span>
                              <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">
                                Dynamic
                              </span>
                            </div>
                            <div className="text-xs text-[#C4CCDA] leading-relaxed">
                              <FormattedText
                                text={draftData.consultant.tagline || ''}
                                careerStartDate={draftData.consultant.careerStartDate}
                                timeline={draftData.timeline}
                              />
                            </div>
                          </div>
                        </div>

                        <div className="sm:col-span-2">
                          <label className="block text-xs font-semibold text-[#C4CCDA] mb-1.5">Hero Summary Text</label>
                          <textarea
                            rows={3}
                            value={draftData.consultant.heroSummary}
                            onChange={(e) => updateDraftConsultant({ heroSummary: e.target.value })}
                            className="w-full px-3.5 py-2.5 rounded-xl bg-[#121B2E] border border-[#1E2C48] text-xs text-[#F2F5F9] focus:outline-none focus:border-[#3B82F6]"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-[#C4CCDA] mb-1.5">Email Address</label>
                          <input
                            type="email"
                            value={draftData.consultant.email}
                            onChange={(e) => updateDraftConsultant({ email: e.target.value })}
                            className="w-full px-3.5 py-2.5 rounded-xl bg-[#121B2E] border border-[#1E2C48] text-xs text-[#F2F5F9] focus:outline-none focus:border-[#3B82F6]"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-[#C4CCDA] mb-1.5">Phone Number / WhatsApp</label>
                          <input
                            type="text"
                            value={draftData.consultant.phone}
                            onChange={(e) => updateDraftConsultant({ phone: e.target.value })}
                            className="w-full px-3.5 py-2.5 rounded-xl bg-[#121B2E] border border-[#1E2C48] text-xs text-[#F2F5F9] focus:outline-none focus:border-[#3B82F6]"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-[#C4CCDA] mb-1.5">LinkedIn Profile URL</label>
                          <input
                            type="text"
                            value={draftData.consultant.linkedin}
                            onChange={(e) => updateDraftConsultant({ linkedin: e.target.value })}
                            className="w-full px-3.5 py-2.5 rounded-xl bg-[#121B2E] border border-[#1E2C48] text-xs text-[#F2F5F9] focus:outline-none focus:border-[#3B82F6]"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-[#C4CCDA] mb-1.5">
                            Geographic Coverage — Regions
                          </label>
                          <input
                            type="text"
                            value={draftData.consultant.geographicRegions ?? draftData.consultant.location ?? 'Pakistan · Saudi Arabia · UAE'}
                            onChange={(e) => updateDraftConsultant({ 
                              geographicRegions: e.target.value,
                              location: e.target.value 
                            })}
                            placeholder="e.g. Pakistan · Saudi Arabia · UAE"
                            className="w-full px-3.5 py-2.5 rounded-xl bg-[#121B2E] border border-[#1E2C48] text-xs text-[#F2F5F9] focus:outline-none focus:border-[#3B82F6]"
                          />
                          <span className="text-[10px] text-[#8B97AC] mt-1 block">Primary country/region names (rendered in bold on contact card).</span>
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-[#C4CCDA] mb-1.5">
                            Geographic Coverage — Support Scope
                          </label>
                          <input
                            type="text"
                            value={draftData.consultant.geographicSupport ?? 'Remote & On-Site Support across All Regions'}
                            onChange={(e) => updateDraftConsultant({ geographicSupport: e.target.value })}
                            placeholder="e.g. Remote & On-Site Support across All Regions"
                            className="w-full px-3.5 py-2.5 rounded-xl bg-[#121B2E] border border-[#1E2C48] text-xs text-[#F2F5F9] focus:outline-none focus:border-[#3B82F6]"
                          />
                          <span className="text-[10px] text-[#8B97AC] mt-1 block">Engagement mode / subtitle text (rendered beneath regions).</span>
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-[#C4CCDA] mb-1.5">Availability Status Badge</label>
                          <input
                            type="text"
                            value={draftData.consultant.status}
                            onChange={(e) => updateDraftConsultant({ status: e.target.value })}
                            className="w-full px-3.5 py-2.5 rounded-xl bg-[#121B2E] border border-[#1E2C48] text-xs text-[#F2F5F9] focus:outline-none focus:border-[#3B82F6]"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-[#C4CCDA] mb-1.5">Availability Text</label>
                          <input
                            type="text"
                            value={draftData.consultant.availability}
                            onChange={(e) => updateDraftConsultant({ availability: e.target.value })}
                            className="w-full px-3.5 py-2.5 rounded-xl bg-[#121B2E] border border-[#1E2C48] text-xs text-[#F2F5F9] focus:outline-none focus:border-[#3B82F6]"
                          />
                        </div>

                        <div className="sm:col-span-2">
                          <label className="block text-xs font-semibold text-[#C4CCDA] mb-1.5">Guiding Philosophy / Pull Quote</label>
                          <input
                            type="text"
                            value={draftData.consultant.pullQuote}
                            onChange={(e) => updateDraftConsultant({ pullQuote: e.target.value })}
                            className="w-full px-3.5 py-2.5 rounded-xl bg-[#121B2E] border border-[#1E2C48] text-xs text-[#F2F5F9] focus:outline-none focus:border-[#3B82F6]"
                          />
                        </div>

                        {/* LinkedIn Style Auto-Calculated Career Duration Engine Card */}
                        {(() => {
                          const careerExp = getTotalCareerExperience(draftData.consultant.careerStartDate, draftData.timeline);
                          return (
                            <div className="sm:col-span-2 p-5 rounded-2xl bg-[#0D1424] border border-[#3B82F6]/30 shadow-lg space-y-4">
                              <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[#1E2C48]">
                                <div className="flex items-center gap-2">
                                  <div className="p-1.5 rounded-lg bg-[#2F6FED]/20 border border-[#3B82F6]/40 text-[#3B82F6]">
                                    <Sparkles className="w-4 h-4" />
                                  </div>
                                  <div>
                                    <h4 className="text-xs font-bold text-[#F2F5F9] uppercase font-mono tracking-wider">
                                      LinkedIn-Style Dynamic Experience Engine
                                    </h4>
                                    <p className="text-[11px] text-[#8B97AC]">
                                      Auto-calculates total career duration from start date to present day in real-time.
                                    </p>
                                  </div>
                                </div>

                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-[#10B981]/15 border border-[#10B981]/40 text-[#10B981] text-xs font-mono font-bold">
                                  <span className="w-2 h-2 rounded-full bg-[#10B981] animate-ping" />
                                  <span>Live: {careerExp.linkedInDuration}</span>
                                </div>
                              </div>

                              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                                <div>
                                  <label className="block text-[11px] font-semibold text-[#8B97AC] mb-1">
                                    Career Start Date (Month / Year)
                                  </label>
                                  <div className="flex items-center gap-2">
                                    <input
                                      type="month"
                                      value={draftData.consultant.careerStartDate || '2013-01'}
                                      onChange={(e) => handleCareerStartDateChange(e.target.value)}
                                      className="w-full px-3 py-2 rounded-xl bg-[#121B2E] border border-[#1E2C48] font-mono text-xs text-[#D9A94E] font-bold focus:outline-none focus:border-[#3B82F6]"
                                    />
                                  </div>
                                </div>

                                <div>
                                  <label className="block text-[11px] font-semibold text-[#8B97AC] mb-1">
                                    Auto-Calculated Stat Value
                                  </label>
                                  <div className="px-3 py-2 rounded-xl bg-[#121B2E] border border-[#3B82F6]/40 font-mono text-xs text-[#3B82F6] font-bold flex items-center justify-between">
                                    <span>{careerExp.yearsPlus}</span>
                                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#3B82F6]/20 text-[#93C5FD]">Automatic</span>
                                  </div>
                                </div>

                                <div>
                                  <label className="block text-[11px] font-semibold text-[#8B97AC] mb-1">
                                    Spelled Duration
                                  </label>
                                  <div className="px-3 py-2 rounded-xl bg-[#121B2E] border border-[#1E2C48] text-xs text-[#C4CCDA] truncate font-medium">
                                    {careerExp.fullDurationSpelled}
                                  </div>
                                </div>
                              </div>

                              <p className="text-[11px] text-[#8B97AC] leading-relaxed italic">
                                Note: All portfolio text references (Hero summary, About narrative, Metric 01, and Certification notes) automatically adapt to this auto-calculated duration without requiring manual edits.
                              </p>
                            </div>
                          );
                        })()}
                      </div>
                    </div>

                    {/* Biography Paragraphs Management */}
                    <div className="space-y-4 pt-4 border-t border-[#1E2C48]">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-xs font-mono font-bold text-[#D9A94E] uppercase tracking-wider">
                            About Page Narrative Paragraphs ({draftData.consultant.aboutProfile?.length || 0})
                          </h4>
                          <p className="text-xs text-[#8B97AC]">
                            Add, edit, or reorder paragraphs in the About section.
                          </p>
                        </div>

                        <button
                          onClick={() => {
                            const current = draftData.consultant.aboutProfile || [];
                            updateDraftConsultant({
                              aboutProfile: [...current, 'New narrative paragraph describing experience and capabilities.'],
                            });
                          }}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#2F6FED] hover:bg-[#3B82F6] text-white text-xs font-semibold shadow-sm transition-colors"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add Paragraph</span>
                        </button>
                      </div>

                      <div className="space-y-3">
                        {(draftData.consultant.aboutProfile || []).map((paragraph, pIdx) => (
                          <div key={pIdx} className="p-4 rounded-2xl bg-[#121B2E] border border-[#1E2C48] space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-mono font-bold text-[#3B82F6]">
                                Paragraph #{pIdx + 1}
                              </span>
                              <button
                                onClick={() => {
                                  const current = draftData.consultant.aboutProfile || [];
                                  updateDraftConsultant({
                                    aboutProfile: current.filter((_, i) => i !== pIdx),
                                  });
                                }}
                                className="p-1.5 rounded-lg bg-[#0D1424] hover:bg-rose-500/20 text-[#8B97AC] hover:text-rose-400 border border-[#1E2C48]"
                                title="Delete Paragraph"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                            <textarea
                              rows={3}
                              value={paragraph}
                              onChange={(e) => {
                                const current = [...(draftData.consultant.aboutProfile || [])];
                                current[pIdx] = e.target.value;
                                updateDraftConsultant({ aboutProfile: current });
                              }}
                              className="w-full px-3 py-2 rounded-xl bg-[#0D1424] border border-[#1E2C48] text-xs text-[#F2F5F9] focus:outline-none focus:border-[#3B82F6] leading-relaxed"
                            />

                            {/* Live Dynamic Resolution Preview & Quick Insert */}
                            <div className="space-y-2 pt-1">
                              <div className="flex flex-wrap items-center justify-between gap-2">
                                <div className="flex flex-wrap items-center gap-1.5">
                                  <span className="text-[10px] text-[#8B97AC] font-mono">Dynamic Tags:</span>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const current = [...(draftData.consultant.aboutProfile || [])];
                                      // If already has static duration or tag, replace or append
                                      current[pIdx] = current[pIdx].replace(/\b\d+\s*years?(?:[,\s]+and\s*|[,\s]+)\d+\s*months?\b/gi, '{{TOTAL_DURATION_SPELLED}}');
                                      if (!current[pIdx].includes('{{TOTAL_DURATION_SPELLED}}')) {
                                        current[pIdx] = current[pIdx] + ' {{TOTAL_DURATION_SPELLED}}';
                                      }
                                      updateDraftConsultant({ aboutProfile: current });
                                    }}
                                    className="px-2 py-0.5 rounded-md bg-[#0D1424] hover:bg-[#2F6FED]/20 text-[#3B82F6] text-[10px] font-mono border border-[#3B82F6]/30 transition-colors"
                                    title="Auto-resolves to e.g. 15 years and 6 months"
                                  >
                                    +&#123;&#123;TOTAL_DURATION_SPELLED&#125;&#125;
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const current = [...(draftData.consultant.aboutProfile || [])];
                                      current[pIdx] = current[pIdx].replace(/\b\d+\+?\s*years?\b/gi, '{{TOTAL_YEARS_PLUS}} years');
                                      if (!current[pIdx].includes('{{TOTAL_YEARS_PLUS}}')) {
                                        current[pIdx] = current[pIdx] + ' {{TOTAL_YEARS_PLUS}}';
                                      }
                                      updateDraftConsultant({ aboutProfile: current });
                                    }}
                                    className="px-2 py-0.5 rounded-md bg-[#0D1424] hover:bg-[#2F6FED]/20 text-[#3B82F6] text-[10px] font-mono border border-[#3B82F6]/30 transition-colors"
                                    title="Auto-resolves to e.g. 15+ years"
                                  >
                                    +&#123;&#123;TOTAL_YEARS_PLUS&#125;&#125;
                                  </button>
                                </div>
                              </div>

                              <div className="p-2.5 rounded-xl bg-[#0D1424] border border-[#1E2C48] text-[11px] text-[#8B97AC] leading-relaxed">
                                <span className="text-[10px] font-mono font-bold text-[#3B82F6] uppercase tracking-wider block mb-1">
                                  Live Dynamic Preview:
                                </span>
                                <FormattedText
                                  text={paragraph}
                                  careerStartDate={draftData.consultant.careerStartDate}
                                  timeline={draftData.timeline}
                                  boldClassName="font-semibold text-[#F2F5F9]"
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB: COLOR THEMES */}
                {activeTab === 'themes' && (
                  <ThemeManagerTab
                    draftTheme={draftData.theme}
                    onThemeChange={(newTheme) => {
                      setDraftData((prev) => ({
                        ...prev,
                        theme: newTheme,
                      }));
                    }}
                  />
                )}

                {/* TAB: SOCIAL MEDIA & CONNECT ICONS */}
                {activeTab === 'social' && (
                  <div className="space-y-8">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#1E2C48]">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <div className="p-1.5 rounded-lg bg-[#3B82F6]/20 border border-[#3B82F6]/40 text-[#3B82F6]">
                            <Share2 className="w-4 h-4" />
                          </div>
                          <h3 className="font-heading font-bold text-lg text-[#F2F5F9]">
                            Social Media &amp; Communication Channels
                          </h3>
                        </div>
                        <p className="text-xs text-[#8B97AC] leading-relaxed max-w-2xl">
                          Manage all your social and communication platforms: Facebook, Instagram, Microsoft Teams, Google Meet, Zoom, TikTok, YouTube, WhatsApp, LinkedIn, and more. Displays seamlessly in the footer and Contact section.
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => handleAddAllMissingSocialLinks()}
                          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#121B2E] hover:bg-[#18243C] border border-[#3B82F6]/40 text-[#3B82F6] hover:text-[#60A5FA] text-xs font-semibold shadow-sm transition-colors cursor-pointer"
                          title="Add all missing platforms at once"
                        >
                          <Sparkles className="w-3.5 h-3.5 text-[#3B82F6]" />
                          <span>Add All Channels</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleAddSocialLink()}
                          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#2F6FED] hover:bg-[#3B82F6] text-white text-xs font-semibold shadow-md transition-colors cursor-pointer"
                        >
                          <Plus className="w-4 h-4" />
                          <span>Add Icon / Link</span>
                        </button>
                      </div>
                    </div>

                    {/* Quick Preset Badges */}
                    <div className="p-5 rounded-2xl bg-[#121B2E] border border-[#1E2C48] space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-mono text-[#8B97AC] uppercase tracking-wider font-semibold">
                          Quick Add Any Platform:
                        </span>
                        <button
                          type="button"
                          onClick={handleResetDefaultSocialLinks}
                          className="text-[11px] text-[#8B97AC] hover:text-[#D9A94E] flex items-center gap-1 transition-colors"
                        >
                          <RotateCcw className="w-3 h-3" />
                          <span>Reset to Recommended Suite</span>
                        </button>
                      </div>

                      {/* Categorized quick add buttons */}
                      <div className="space-y-3">
                        <div>
                          <span className="text-[10px] font-mono text-[#3B82F6] uppercase font-bold tracking-wider block mb-1.5">
                            Video Conferencing &amp; Meetings:
                          </span>
                          <div className="flex flex-wrap items-center gap-2">
                            {[
                              { icon: 'teams', label: 'Microsoft Teams', url: 'https://teams.microsoft.com' },
                              { icon: 'meet', label: 'Google Meet', url: 'https://meet.google.com' },
                              { icon: 'zoom', label: 'Zoom', url: 'https://zoom.us' },
                              { icon: 'calendly', label: 'Calendly', url: 'https://calendly.com' },
                              { icon: 'skype', label: 'Skype', url: 'skype:live:consultant?chat' },
                            ].map((preset) => (
                              <button
                                key={preset.icon}
                                type="button"
                                onClick={() => handleAddSocialLink(preset.icon, preset.url)}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0D1424] hover:bg-[#18243C] border border-[#1E2C48] hover:border-[#3B82F6]/50 text-xs font-medium text-[#C4CCDA] hover:text-[#F2F5F9] transition-all cursor-pointer shadow-sm"
                              >
                                <SocialIcon icon={preset.icon} className="w-3.5 h-3.5 text-[#3B82F6]" />
                                <span>+ {preset.label}</span>
                              </button>
                            ))}
                          </div>
                        </div>

                        <div>
                          <span className="text-[10px] font-mono text-[#D9A94E] uppercase font-bold tracking-wider block mb-1.5">
                            Social Media &amp; Content:
                          </span>
                          <div className="flex flex-wrap items-center gap-2">
                            {[
                              { icon: 'facebook', label: 'Facebook', url: 'https://facebook.com' },
                              { icon: 'instagram', label: 'Instagram', url: 'https://instagram.com' },
                              { icon: 'tiktok', label: 'TikTok', url: 'https://tiktok.com' },
                              { icon: 'youtube', label: 'YouTube', url: 'https://youtube.com' },
                              { icon: 'twitter', label: 'Twitter / X', url: 'https://x.com' },
                              { icon: 'threads', label: 'Threads', url: 'https://threads.net' },
                            ].map((preset) => (
                              <button
                                key={preset.icon}
                                type="button"
                                onClick={() => handleAddSocialLink(preset.icon, preset.url)}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0D1424] hover:bg-[#18243C] border border-[#1E2C48] hover:border-[#D9A94E]/50 text-xs font-medium text-[#C4CCDA] hover:text-[#F2F5F9] transition-all cursor-pointer shadow-sm"
                              >
                                <SocialIcon icon={preset.icon} className="w-3.5 h-3.5 text-[#D9A94E]" />
                                <span>+ {preset.label}</span>
                              </button>
                            ))}
                          </div>
                        </div>

                        <div>
                          <span className="text-[10px] font-mono text-emerald-400 uppercase font-bold tracking-wider block mb-1.5">
                            Direct Contact &amp; Messaging:
                          </span>
                          <div className="flex flex-wrap items-center gap-2">
                            {[
                              { icon: 'linkedin', label: 'LinkedIn', url: 'https://linkedin.com/in/smahsan52' },
                              { icon: 'whatsapp', label: 'WhatsApp', url: draftData.consultant.phone || '+92 300 2711390' },
                              { icon: 'email', label: 'Email', url: draftData.consultant.email || 'smahsan52@hotmail.com' },
                              { icon: 'phone', label: 'Phone', url: draftData.consultant.phone || '+92 300 2711390' },
                              { icon: 'telegram', label: 'Telegram', url: 'https://t.me' },
                              { icon: 'slack', label: 'Slack', url: 'https://slack.com' },
                              { icon: 'github', label: 'GitHub', url: 'https://github.com' },
                              { icon: 'website', label: 'Website', url: 'https://' },
                            ].map((preset) => (
                              <button
                                key={preset.icon}
                                type="button"
                                onClick={() => handleAddSocialLink(preset.icon, preset.url)}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0D1424] hover:bg-[#18243C] border border-[#1E2C48] hover:border-emerald-500/50 text-xs font-medium text-[#C4CCDA] hover:text-[#F2F5F9] transition-all cursor-pointer shadow-sm"
                              >
                                <SocialIcon icon={preset.icon} className="w-3.5 h-3.5 text-emerald-400" />
                                <span>+ {preset.label}</span>
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Live Footer & Contact Icon Preview Strip */}
                    <div className="p-5 rounded-2xl bg-[#0D1424] border border-[#3B82F6]/30 shadow-lg space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="text-xs font-mono font-bold text-[#D9A94E] uppercase tracking-wider flex items-center gap-2">
                          <Sparkles className="w-4 h-4 text-[#3B82F6]" />
                          <span>Direct Contact Icons Bar Preview (Visible on Public Website)</span>
                        </div>
                        <span className="text-[10px] text-[#8B97AC] font-mono">
                          {((draftData.socialLinks !== undefined ? draftData.socialLinks : (initialDefaultPortfolioData.socialLinks || [])).filter((l) => !l.hidden)).length} visible on site
                        </span>
                      </div>

                      <div className="p-4 rounded-xl bg-[#121B2E] border border-[#1E2C48] flex flex-wrap items-center gap-3">
                        {((draftData.socialLinks !== undefined ? draftData.socialLinks : (initialDefaultPortfolioData.socialLinks || [])).filter((l) => !l.hidden)).length === 0 ? (
                          <div className="text-xs text-[#8B97AC] italic py-1">
                            No social or communication icons are currently set to visible. None will appear in the footer or Contact section.
                          </div>
                        ) : (
                          (draftData.socialLinks !== undefined ? draftData.socialLinks : (initialDefaultPortfolioData.socialLinks || []))
                            .filter((item) => !item.hidden)
                            .map((item) => (
                              <div
                                key={item.id}
                                className="w-11 h-11 rounded-xl bg-[#0D1424] border border-[#1E2C48] text-[#C4CCDA] flex items-center justify-center shadow-sm"
                                title={`${getPlatformName(item.icon)}: ${item.url}`}
                              >
                                <SocialIcon icon={item.icon} className="w-4 h-4" />
                              </div>
                            ))
                        )}
                      </div>
                    </div>

                    {/* Dynamic Social Link Cards List */}
                    <div className="space-y-4">
                      {(() => {
                        const currentSocialList = draftData.socialLinks !== undefined
                          ? draftData.socialLinks
                          : (initialDefaultPortfolioData.socialLinks || []);

                        if (currentSocialList.length === 0) {
                          return (
                            <div className="p-8 rounded-2xl bg-[#121B2E] border border-dashed border-[#1E2C48] text-center space-y-3">
                              <Share2 className="w-8 h-8 text-[#8B97AC] mx-auto opacity-50" />
                              <p className="text-sm font-semibold text-[#F2F5F9]">No social icons configured</p>
                              <p className="text-xs text-[#8B97AC] max-w-sm mx-auto">
                                You have removed all social channels. No social icons will be shown on your public portfolio. Click &quot;Add Icon / Link&quot; above to add specific channels anytime.
                              </p>
                            </div>
                          );
                        }

                        return currentSocialList.map((item, idx, arr) => (
                          <div
                            key={item.id}
                            className={`p-5 rounded-2xl bg-[#121B2E] border space-y-3 relative group transition-all ${
                              item.hidden
                                ? 'border-amber-500/30 bg-[#101726]/60 opacity-80'
                                : 'border-[#1E2C48] hover:border-[#3B82F6]/40'
                            }`}
                          >
                            {/* Card Header Row */}
                            <div className="flex items-center justify-between pb-3 border-b border-[#1E2C48]">
                              <div className="flex items-center gap-3">
                                <div className={`w-9 h-9 rounded-xl bg-[#0D1424] border border-[#1E2C48] flex items-center justify-center shadow-sm ${item.hidden ? 'text-[#8B97AC]' : 'text-[#D9A94E]'}`}>
                                  <SocialIcon icon={item.icon} className="w-4 h-4" />
                                </div>
                                <div>
                                  <div className="flex items-center gap-2">
                                    <span className="font-heading font-bold text-sm text-[#F2F5F9]">
                                      {idx + 1}. {getPlatformName(item.icon) || item.name || 'Platform'}
                                    </span>
                                    {item.hidden ? (
                                      <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                                        <EyeOff className="w-3 h-3" />
                                        <span>Hidden</span>
                                      </span>
                                    ) : (
                                      <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                                        <Eye className="w-3 h-3" />
                                        <span>Visible</span>
                                      </span>
                                    )}
                                  </div>
                                  <span className="text-[10px] font-mono text-[#8B97AC]">
                                    Key: {normalizePlatform(item.icon)}
                                  </span>
                                </div>
                              </div>

                              <div className="flex items-center gap-1.5">
                                {/* Visibility Toggle: Show / Hide */}
                                <button
                                  type="button"
                                  onClick={() => handleToggleSocialLinkVisibility(item.id)}
                                  className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                                    item.hidden
                                      ? 'bg-amber-500/15 text-amber-300 hover:bg-amber-500/25 border border-amber-500/30'
                                      : 'bg-[#0D1424] text-[#8B97AC] hover:text-[#F2F5F9] hover:bg-[#18243C] border border-[#1E2C48]'
                                  }`}
                                  title={item.hidden ? 'Click to show this icon on public portfolio' : 'Click to hide this icon from public portfolio'}
                                >
                                  {item.hidden ? (
                                    <>
                                      <Eye className="w-3.5 h-3.5 text-amber-300" />
                                      <span>Show</span>
                                    </>
                                  ) : (
                                    <>
                                      <EyeOff className="w-3.5 h-3.5" />
                                      <span>Hide</span>
                                    </>
                                  )}
                                </button>

                                {/* Move Up */}
                                <button
                                  type="button"
                                  onClick={() => handleMoveSocialLink(idx, 'up')}
                                  disabled={idx === 0}
                                  className="p-1.5 rounded-lg text-[#8B97AC] hover:text-[#F2F5F9] hover:bg-[#0D1424] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                                  title="Move up"
                                >
                                  <ChevronUp className="w-4 h-4" />
                                </button>
                                {/* Move Down */}
                                <button
                                  type="button"
                                  onClick={() => handleMoveSocialLink(idx, 'down')}
                                  disabled={idx === arr.length - 1}
                                  className="p-1.5 rounded-lg text-[#8B97AC] hover:text-[#F2F5F9] hover:bg-[#0D1424] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                                  title="Move down"
                                >
                                  <ChevronDown className="w-4 h-4" />
                                </button>
                                {/* Delete */}
                                <button
                                  type="button"
                                  onClick={() => handleDeleteSocialLink(item.id)}
                                  className="p-1.5 rounded-lg text-[#8B97AC] hover:text-rose-400 hover:bg-rose-500/10 transition-colors ml-1 cursor-pointer"
                                  title="Permanently remove this icon"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>

                          {/* Two Fields: Platform Selector / Name & Link or Address */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-xs font-semibold text-[#8B97AC] uppercase font-mono tracking-wider mb-1.5">
                                Select Platform
                              </label>
                              <select
                                value={SUPPORTED_PLATFORMS.some((p) => p.id === normalizePlatform(item.icon)) ? normalizePlatform(item.icon) : 'custom'}
                                onChange={(e) => handleSelectPlatformChange(item.id, e.target.value)}
                                className="w-full px-3.5 py-2.5 rounded-xl bg-[#0D1424] border border-[#1E2C48] text-xs text-[#F2F5F9] focus:outline-none focus:border-[#3B82F6] transition-colors cursor-pointer"
                              >
                                <optgroup label="Video & Meetings" className="bg-[#0D1424] text-[#3B82F6] font-bold">
                                  <option value="teams" className="text-[#F2F5F9] font-normal">Microsoft Teams</option>
                                  <option value="meet" className="text-[#F2F5F9] font-normal">Google Meet</option>
                                  <option value="zoom" className="text-[#F2F5F9] font-normal">Zoom</option>
                                  <option value="calendly" className="text-[#F2F5F9] font-normal">Calendly / Booking</option>
                                  <option value="skype" className="text-[#F2F5F9] font-normal">Skype</option>
                                </optgroup>
                                <optgroup label="Social Media & Content" className="bg-[#0D1424] text-[#D9A94E] font-bold">
                                  <option value="facebook" className="text-[#F2F5F9] font-normal">Facebook</option>
                                  <option value="instagram" className="text-[#F2F5F9] font-normal">Instagram</option>
                                  <option value="tiktok" className="text-[#F2F5F9] font-normal">TikTok</option>
                                  <option value="youtube" className="text-[#F2F5F9] font-normal">YouTube</option>
                                  <option value="twitter" className="text-[#F2F5F9] font-normal">Twitter / X</option>
                                  <option value="threads" className="text-[#F2F5F9] font-normal">Threads</option>
                                  <option value="twitch" className="text-[#F2F5F9] font-normal">Twitch</option>
                                  <option value="reddit" className="text-[#F2F5F9] font-normal">Reddit</option>
                                </optgroup>
                                <optgroup label="Direct Messaging & Calling" className="bg-[#0D1424] text-emerald-400 font-bold">
                                  <option value="whatsapp" className="text-[#F2F5F9] font-normal">WhatsApp</option>
                                  <option value="email" className="text-[#F2F5F9] font-normal">Email</option>
                                  <option value="phone" className="text-[#F2F5F9] font-normal">Phone</option>
                                  <option value="telegram" className="text-[#F2F5F9] font-normal">Telegram</option>
                                  <option value="wechat" className="text-[#F2F5F9] font-normal">WeChat</option>
                                  <option value="discord" className="text-[#F2F5F9] font-normal">Discord</option>
                                </optgroup>
                                <optgroup label="Professional & Portfolio" className="bg-[#0D1424] text-[#A78BFA] font-bold">
                                  <option value="linkedin" className="text-[#F2F5F9] font-normal">LinkedIn</option>
                                  <option value="github" className="text-[#F2F5F9] font-normal">GitHub</option>
                                  <option value="slack" className="text-[#F2F5F9] font-normal">Slack</option>
                                  <option value="medium" className="text-[#F2F5F9] font-normal">Medium / Blog</option>
                                  <option value="website" className="text-[#F2F5F9] font-normal">Website / Portfolio</option>
                                </optgroup>
                                <option value="custom" className="text-[#8B97AC]">Custom Icon Key...</option>
                              </select>
                            </div>

                            <div>
                              <label className="block text-xs font-semibold text-[#8B97AC] uppercase font-mono tracking-wider mb-1.5">
                                Link, Meeting URL, or Address
                              </label>
                              <input
                                type="text"
                                value={item.url}
                                onChange={(e) => updateSingleSocialLink(item.id, { url: e.target.value })}
                                onBlur={handleAutoSaveSocial}
                                placeholder={
                                  SUPPORTED_PLATFORMS.find((p) => p.id === normalizePlatform(item.icon))?.placeholder ||
                                  'e.g. https://... or email or phone'
                                }
                                className="w-full px-3.5 py-2.5 rounded-xl bg-[#0D1424] border border-[#1E2C48] text-xs text-[#F2F5F9] focus:outline-none focus:border-[#3B82F6] transition-colors"
                              />
                            </div>
                          </div>

                          {/* Dynamic Platform Help Text */}
                          <div className="flex items-center justify-between gap-2 pt-0.5">
                            <p className="text-[11px] text-[#8B97AC] leading-relaxed">
                              {getPlatformHelpText(item.icon)}
                            </p>
                            <span className="text-[10px] font-mono text-[#3B82F6]/70 shrink-0">
                              Target: {getSocialHref(item.icon, item.url).substring(0, 32)}...
                            </span>
                          </div>
                        </div>
                      ));
                    })()}
                  </div>

                    {/* Add Icon Button */}
                    <button
                      type="button"
                      onClick={() => handleAddSocialLink()}
                      className="w-full py-4 rounded-2xl border-2 border-dashed border-[#1E2C48] hover:border-[#3B82F6]/60 text-xs font-semibold text-[#8B97AC] hover:text-[#F2F5F9] hover:bg-[#121B2E]/60 flex items-center justify-center gap-2 transition-all cursor-pointer"
                    >
                      <Plus className="w-4 h-4 text-[#3B82F6]" />
                      <span>Add Another Social Icon / Link</span>
                    </button>
                  </div>
                )}

                {/* TAB: CONTACT FORM MODULES DROPDOWN */}
                {activeTab === 'contactModules' && (
                  <div className="space-y-8">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#1E2C48]">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <div className="p-1.5 rounded-lg bg-[#3B82F6]/20 border border-[#3B82F6]/40 text-[#3B82F6]">
                            <ListFilter className="w-4 h-4" />
                          </div>
                          <h3 className="font-heading font-bold text-lg text-[#F2F5F9]">
                            Contact Form Modules (&quot;Module(s) Needed&quot; Dropdown)
                          </h3>
                        </div>
                        <p className="text-xs text-[#8B97AC] leading-relaxed max-w-2xl">
                          Manage the selectable options in the contact form dropdown menu. Add new modules or specialties, edit names, reorder, or remove options. Updates appear live on your website immediately.
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={handleResetDefaultContactModules}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#121B2E] hover:bg-[#1E2C48] border border-[#1E2C48] text-[#8B97AC] hover:text-[#F2F5F9] text-xs font-semibold transition-colors self-start shrink-0 cursor-pointer"
                        title="Reset to default SAP modules"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Restore Standard Options</span>
                      </button>
                    </div>

                    {/* Add New Option Field */}
                    <div className="p-5 rounded-2xl bg-[#121B2E] border border-[#1E2C48] space-y-4">
                      <div className="text-xs font-mono font-bold text-[#F2F5F9] uppercase tracking-wider flex items-center gap-2">
                        <Plus className="w-4 h-4 text-[#3B82F6]" />
                        <span>Add New Dropdown Option</span>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-2.5">
                        <input
                          type="text"
                          value={newModuleInput}
                          onChange={(e) => setNewModuleInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleAddContactModule();
                            }
                          }}
                          placeholder="e.g. MM (Materials Management) or S/4HANA Implementation"
                          className="flex-1 px-3.5 py-2.5 rounded-xl bg-[#0D1424] border border-[#1E2C48] text-xs text-[#F2F5F9] placeholder-[#8B97AC] focus:outline-none focus:border-[#3B82F6] transition-colors"
                        />
                        <button
                          type="button"
                          onClick={() => handleAddContactModule()}
                          className="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#2F6FED] hover:bg-[#3B82F6] text-white text-xs font-semibold shadow-md transition-colors cursor-pointer shrink-0"
                        >
                          <Plus className="w-4 h-4" />
                          <span>Add Option</span>
                        </button>
                      </div>

                      {/* Quick Presets */}
                      <div className="pt-2 border-t border-[#1E2C48]/60 space-y-2">
                        <span className="text-[10px] font-mono uppercase text-[#8B97AC] tracking-wider font-semibold">
                          Quick Add Enterprise Suggestions:
                        </span>
                        <div className="flex flex-wrap gap-2">
                          {[
                            'MM (Materials Management)',
                            'SD (Sales & Distribution)',
                            'S/4HANA Cloud Migration',
                            'Plant Maintenance & Reliability Audit',
                            'Industry 4.0 / Shop Floor IoT',
                            'Executive Advisory & Cutover Leadership',
                          ].map((suggestion) => (
                            <button
                              key={suggestion}
                              type="button"
                              onClick={() => handleAddContactModule(suggestion)}
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#0D1424] hover:bg-[#1E2C48] border border-[#1E2C48] hover:border-[#3B82F6]/40 text-[11px] text-[#8B97AC] hover:text-[#F2F5F9] transition-all cursor-pointer"
                            >
                              <Plus className="w-3 h-3 text-[#D9A94E]" />
                              <span>{suggestion}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Live Preview of the Dropdown */}
                    <div className="p-5 rounded-2xl bg-[#0D1424] border border-[#3B82F6]/30 shadow-lg space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="text-xs font-mono font-bold text-[#D9A94E] uppercase tracking-wider flex items-center gap-2">
                          <Sparkles className="w-4 h-4 text-[#3B82F6]" />
                          <span>Interactive Live Form Dropdown Preview</span>
                        </div>
                        <span className="text-[10px] text-[#8B97AC] font-mono">
                          {(draftData.contactModules || initialDefaultPortfolioData.contactModules || defaultContactModules).length} options available
                        </span>
                      </div>

                      <div className="p-4 rounded-xl bg-[#121B2E] border border-[#1E2C48] max-w-lg space-y-2">
                        <label className="block text-xs font-medium text-[#C4CCDA]">
                          Module(s) Needed <span className="text-[#D9A94E]">*</span>
                        </label>
                        <select
                          id="admin-preview-contact-module"
                          defaultValue={(draftData.contactModules || defaultContactModules)[0] || ''}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-[#0D1424] border border-[#1E2C48] text-xs text-[#F2F5F9] focus:outline-none focus:border-[#3B82F6] transition-colors"
                        >
                          {(draftData.contactModules || initialDefaultPortfolioData.contactModules || defaultContactModules).map((mod) => (
                            <option key={mod} value={mod} className="bg-[#0D1424] text-[#F2F5F9]">
                              {mod}
                            </option>
                          ))}
                        </select>
                        <p className="text-[10px] text-[#8B97AC]">
                          This is how the dropdown currently appears to clients on the Contact page.
                        </p>
                      </div>
                    </div>

                    {/* Manage Dropdown Items List */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between px-1">
                        <span className="text-xs font-mono text-[#8B97AC] uppercase tracking-wider font-semibold">
                          Active Dropdown Options (Edit directly or use arrows to reorder)
                        </span>
                      </div>

                      {(draftData.contactModules || initialDefaultPortfolioData.contactModules || defaultContactModules).map((moduleName, idx, arr) => (
                        <div
                          key={`module-${idx}`}
                          className="p-3.5 rounded-xl bg-[#121B2E] border border-[#1E2C48] flex items-center gap-3 transition-all hover:border-[#3B82F6]/40"
                        >
                          {/* Number Badge */}
                          <div className="w-7 h-7 rounded-lg bg-[#0D1424] border border-[#1E2C48] flex items-center justify-center text-xs font-mono font-bold text-[#D9A94E] shrink-0">
                            {idx + 1}
                          </div>

                          {/* Editable Text Input */}
                          <div className="flex-1">
                            <input
                              type="text"
                              value={moduleName}
                              onChange={(e) => handleUpdateContactModule(idx, e.target.value)}
                              onBlur={handleAutoSaveContactModules}
                              className="w-full px-3 py-2 rounded-lg bg-[#0D1424] border border-[#1E2C48] text-xs text-[#F2F5F9] focus:outline-none focus:border-[#3B82F6] transition-colors font-medium"
                            />
                          </div>

                          {/* Reorder and Delete Actions */}
                          <div className="flex items-center gap-1 shrink-0">
                            <button
                              type="button"
                              onClick={() => handleMoveContactModule(idx, 'up')}
                              disabled={idx === 0}
                              className="p-1.5 rounded-lg text-[#8B97AC] hover:text-[#F2F5F9] hover:bg-[#0D1424] disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
                              title="Move option up"
                            >
                              <ChevronUp className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleMoveContactModule(idx, 'down')}
                              disabled={idx === arr.length - 1}
                              className="p-1.5 rounded-lg text-[#8B97AC] hover:text-[#F2F5F9] hover:bg-[#0D1424] disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
                              title="Move option down"
                            >
                              <ChevronDown className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteContactModule(idx)}
                              disabled={arr.length <= 1}
                              className="p-1.5 rounded-lg text-[#8B97AC] hover:text-rose-400 hover:bg-rose-500/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors ml-1 cursor-pointer"
                              title={arr.length <= 1 ? 'Cannot delete the only option' : 'Remove option'}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* TAB: EXPERIENCE DATES & AUTOMATIC DURATION ENGINE */}
                {activeTab === 'experienceDates' && (
                  <div className="space-y-8">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#1E2C48]">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <div className="p-1.5 rounded-lg bg-[#3B82F6]/20 border border-[#3B82F6]/40 text-[#3B82F6]">
                            <Calendar className="w-4 h-4" />
                          </div>
                          <h3 className="font-heading font-bold text-lg text-[#F2F5F9]">
                            Experience Dates & Dynamic Duration Engine
                          </h3>
                        </div>
                        <p className="text-xs text-[#8B97AC]">
                          Set your career baseline kickoff date and role dates. The system automatically computes and syncs the exact experience duration (e.g., “12+ years”) across your Tagline, Hero Summary, About Section, and Key Statistics.
                        </p>
                      </div>

                      {(() => {
                        const careerExp = getTotalCareerExperience(draftData.consultant.careerStartDate, draftData.timeline);
                        return (
                          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-semibold shrink-0">
                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                            <span>Live: {careerExp.linkedInDuration}</span>
                          </div>
                        );
                      })()}
                    </div>

                    {/* Section 1: Career Start Date Baseline Controller */}
                    {(() => {
                      const careerExp = getTotalCareerExperience(draftData.consultant.careerStartDate, draftData.timeline);
                      return (
                        <div className="p-6 rounded-2xl bg-[#121B2E] border border-[#1E2C48] space-y-6">
                          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-4 border-b border-[#1E2C48]">
                            <div>
                              <h4 className="text-sm font-bold text-[#F2F5F9] flex items-center gap-2">
                                <Sparkles className="w-4 h-4 text-[#D9A94E]" />
                                <span>Master Career Kickoff Date</span>
                              </h4>
                              <p className="text-xs text-[#8B97AC] mt-0.5">
                                This date serves as the chronological baseline for calculating your overall career tenure.
                              </p>
                            </div>

                            {/* Sync from earliest role button */}
                            <button
                              type="button"
                              onClick={() => {
                                const exp = getTotalCareerExperience(undefined, draftData.timeline);
                                const earliest = `${exp.startYear}-${String(exp.startMonth).padStart(2, '0')}`;
                                handleCareerStartDateChange(earliest);
                                triggerNotice(`Synced career start date to earliest role: ${exp.startDateFormatted}`);
                              }}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#0D1424] hover:bg-[#1E2C48] border border-[#1E2C48] text-xs font-medium text-[#C4CCDA] hover:text-[#F2F5F9] transition-all"
                            >
                              <RotateCcw className="w-3.5 h-3.5 text-[#3B82F6]" />
                              <span>Reset to Earliest Timeline Role</span>
                            </button>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                            {/* Date Input */}
                            <div className="md:col-span-5 space-y-2">
                              <label className="block text-xs font-semibold text-[#C4CCDA]">
                                Career Start Date (Year & Month)
                              </label>
                              <div className="relative">
                                <input
                                  type="month"
                                  value={draftData.consultant.careerStartDate || '2013-01'}
                                  onChange={(e) => handleCareerStartDateChange(e.target.value)}
                                  className="w-full px-4 py-3 rounded-xl bg-[#0D1424] border border-[#3B82F6]/50 font-mono text-sm text-[#D9A94E] font-bold focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/30"
                                />
                              </div>
                              <p className="text-[11px] text-[#8B97AC] leading-relaxed">
                                Current baseline: <span className="text-[#F2F5F9] font-mono font-medium">{careerExp.startDateFormatted}</span> ({careerExp.startYear}). Adjusting this updates all template placeholders and statistics instantly.
                              </p>
                            </div>

                            {/* Live Calculation Output Strip */}
                            <div className="md:col-span-7 p-4 rounded-xl bg-[#0D1424] border border-[#1E2C48] space-y-3">
                              <div className="text-[11px] font-mono text-[#8B97AC] uppercase tracking-wider font-semibold">
                                Live Calculated Duration Output
                              </div>
                              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                <div className="p-3 rounded-xl bg-[#121B2E] border border-[#1E2C48]">
                                  <div className="text-[10px] text-[#8B97AC] mb-1">Headline Stat</div>
                                  <div className="text-base font-bold font-mono text-[#3B82F6]">
                                    {careerExp.yearsPlus}
                                  </div>
                                </div>
                                <div className="p-3 rounded-xl bg-[#121B2E] border border-[#1E2C48]">
                                  <div className="text-[10px] text-[#8B97AC] mb-1">LinkedIn Format</div>
                                  <div className="text-xs font-semibold font-mono text-[#D9A94E]">
                                    {careerExp.linkedInDuration}
                                  </div>
                                </div>
                                <div className="p-3 rounded-xl bg-[#121B2E] border border-[#1E2C48] col-span-2 sm:col-span-1">
                                  <div className="text-[10px] text-[#8B97AC] mb-1">Total Months</div>
                                  <div className="text-xs font-semibold font-mono text-[#10B981]">
                                    {careerExp.totalMonths} mos
                                  </div>
                                </div>
                              </div>
                              <div className="text-xs text-[#8B97AC] pt-1">
                                Spelled out: <span className="text-[#F2F5F9] font-medium">{careerExp.fullDurationSpelled}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })()}

                    {/* Section 2: Copyable Template Placeholders */}
                    {(() => {
                      const careerExp = getTotalCareerExperience(draftData.consultant.careerStartDate, draftData.timeline);
                      const placeholders = [
                        {
                          tag: '{{TOTAL_YEARS_PLUS}}',
                          example: careerExp.yearsPlus,
                          label: 'Years Plus Symbol',
                          desc: 'Used in Tagline, hero title, badges (e.g. 12+)',
                        },
                        {
                          tag: '{{TOTAL_YEARS}}',
                          example: String(careerExp.years),
                          label: 'Number of Years',
                          desc: 'Pure number without plus (e.g. 12)',
                        },
                        {
                          tag: '{{TOTAL_DURATION}}',
                          example: careerExp.linkedInDuration,
                          label: 'LinkedIn Short Duration',
                          desc: 'Years and months (e.g. 12 yrs 8 mos)',
                        },
                        {
                          tag: '{{TOTAL_DURATION_SPELLED}}',
                          example: careerExp.fullDurationSpelled,
                          label: 'Spelled Duration',
                          desc: 'e.g. 12 years and 8 months',
                        },
                        {
                          tag: '{{CAREER_START_DATE}}',
                          example: careerExp.startDateFormatted,
                          label: 'Kickoff Month & Year',
                          desc: 'Formatted start date (e.g. Jan 2013)',
                        },
                      ];

                      return (
                        <div className="p-6 rounded-2xl bg-[#121B2E] border border-[#1E2C48] space-y-4">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <div>
                              <h4 className="text-sm font-bold text-[#F2F5F9] flex items-center gap-2">
                                <Tag className="w-4 h-4 text-[#3B82F6]" />
                                <span>Template Placeholders (Click to Copy)</span>
                              </h4>
                              <p className="text-xs text-[#8B97AC] mt-0.5">
                                Insert these tags anywhere in your Tagline, Hero Summary, Bio, or Pull Quote to keep duration numbers dynamic and self-updating.
                              </p>
                            </div>

                            {copiedTag && (
                              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-medium animate-fadeIn">
                                <Check className="w-3.5 h-3.5" />
                                <span>Copied {copiedTag}!</span>
                              </span>
                            )}
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                            {placeholders.map((item) => (
                              <div
                                key={item.tag}
                                onClick={() => copyTemplateTag(item.tag)}
                                className="group p-3.5 rounded-xl bg-[#0D1424] border border-[#1E2C48] hover:border-[#3B82F6]/50 cursor-pointer transition-all flex flex-col justify-between space-y-2"
                              >
                                <div className="flex items-center justify-between">
                                  <span className="text-[11px] font-semibold text-[#C4CCDA]">
                                    {item.label}
                                  </span>
                                  <button
                                    type="button"
                                    className="p-1 rounded bg-[#121B2E] text-[#8B97AC] group-hover:text-[#3B82F6] transition-colors"
                                    title="Copy tag"
                                  >
                                    <Copy className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                                <code className="block font-mono text-xs text-[#3B82F6] font-bold bg-[#121B2E] px-2.5 py-1 rounded-lg border border-[#1E2C48]">
                                  {item.tag}
                                </code>
                                <div className="text-[11px] text-[#8B97AC] flex items-center justify-between">
                                  <span>Resolves to:</span>
                                  <span className="font-mono text-[#D9A94E] font-bold">{item.example}</span>
                                </div>
                              </div>
                            ))}
                          </div>

                          {/* Tagline Quick-Jump Helper Banner */}
                          <div className="mt-3 p-4 rounded-xl bg-[#0D1424] border border-[#3B82F6]/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div className="text-xs text-[#8B97AC] space-y-1">
                              <span className="text-[#F2F5F9] font-semibold block">
                                Recommended Usage in Tagline:
                              </span>
                              <span className="text-[11px] text-[#8B97AC] font-mono block">
                                Turning complex manufacturing operations into &lt;strong&gt;streamlined, SAP-driven processes&lt;/strong&gt; — across &#123;&#123;TOTAL_YEARS_PLUS&#125;&#125; years...
                              </span>
                            </div>
                            <button
                              type="button"
                              onClick={() => setActiveTab('profile')}
                              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#2F6FED]/20 hover:bg-[#2F6FED]/30 border border-[#3B82F6]/40 text-[#3B82F6] hover:text-[#60A5FA] text-xs font-semibold shrink-0 transition-all"
                            >
                              <span>Edit Tagline in Profile</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      );
                    })()}

                    {/* Section 3: Timeline Milestones Quick-Date Controller */}
                    <div className="p-6 rounded-2xl bg-[#121B2E] border border-[#1E2C48] space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#1E2C48]">
                        <div>
                          <h4 className="text-sm font-bold text-[#F2F5F9] flex items-center gap-2">
                            <Briefcase className="w-4 h-4 text-[#3B82F6]" />
                            <span>Timeline Roles & Milestone Dates ({draftData.timeline.length})</span>
                          </h4>
                          <p className="text-xs text-[#8B97AC] mt-0.5">
                            Each role's dates compute its individual duration and can also be set as your overall career baseline.
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() => setActiveTab('timeline')}
                          className="text-xs text-[#3B82F6] hover:underline flex items-center gap-1"
                        >
                          <span>Manage Full Timeline Details</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>

                      <div className="space-y-3">
                        {draftData.timeline.map((item, idx) => {
                          const dateInfo = getLinkedInDateInfo(item.startDate || item.year, item.endDate, item.isCurrent);
                          const isCareerBaseline = draftData.consultant.careerStartDate === (item.startDate || item.year);

                          return (
                            <div
                              key={item.id || idx}
                              className={`p-4 rounded-xl border transition-all space-y-3 ${
                                isCareerBaseline
                                  ? 'bg-[#0D1424] border-[#3B82F6]/50 shadow-md'
                                  : 'bg-[#0D1424] border-[#1E2C48]'
                              }`}
                            >
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                <div className="flex items-center gap-2">
                                  <span className="w-6 h-6 rounded-lg bg-[#121B2E] border border-[#1E2C48] text-xs font-mono font-bold text-[#3B82F6] flex items-center justify-center">
                                    {idx + 1}
                                  </span>
                                  <div>
                                    <div className="text-xs font-bold text-[#F2F5F9]">{item.company}</div>
                                    <div className="text-[11px] text-[#8B97AC]">{item.role}</div>
                                  </div>
                                </div>

                                <div className="flex items-center gap-2">
                                  {isCareerBaseline ? (
                                    <span className="px-2.5 py-1 rounded-md bg-[#D9A94E]/15 border border-[#D9A94E]/30 text-[10px] font-mono font-semibold text-[#D9A94E] flex items-center gap-1">
                                      <Check className="w-3 h-3" />
                                      <span>Career Baseline Start</span>
                                    </span>
                                  ) : (
                                    <button
                                      type="button"
                                      onClick={() => {
                                        if (item.startDate) {
                                          handleCareerStartDateChange(item.startDate);
                                          triggerNotice(`Career baseline set to ${item.company} (${item.startDate})`);
                                        }
                                      }}
                                      className="px-2.5 py-1 rounded-md bg-[#121B2E] hover:bg-[#1E2C48] border border-[#1E2C48] text-[10px] font-semibold text-[#8B97AC] hover:text-[#F2F5F9] transition-all"
                                    >
                                      Use as Career Start Date
                                    </button>
                                  )}

                                  <div className="px-2.5 py-1 rounded-md bg-[#121B2E] border border-[#1E2C48] text-[10px] font-mono font-semibold text-[#3B82F6]">
                                    {dateInfo.durationText || dateInfo.dateRangeText}
                                  </div>
                                </div>
                              </div>

                              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1 text-xs">
                                <div>
                                  <label className="block text-[10px] font-semibold text-[#8B97AC] mb-1">
                                    Role Start Date
                                  </label>
                                  <input
                                    type="month"
                                    value={item.startDate || ''}
                                    onChange={(e) => {
                                      const updated = [...draftData.timeline];
                                      updated[idx] = { ...updated[idx], startDate: e.target.value };
                                      updateDraftTimeline(updated);
                                    }}
                                    className="w-full px-2.5 py-1.5 rounded-lg bg-[#121B2E] border border-[#1E2C48] font-mono text-xs text-[#F2F5F9] focus:outline-none focus:border-[#3B82F6]"
                                  />
                                </div>

                                <div>
                                  <label className="block text-[10px] font-semibold text-[#8B97AC] mb-1">
                                    Role End Date
                                  </label>
                                  <input
                                    type="month"
                                    value={item.isCurrent ? '' : (item.endDate || '')}
                                    disabled={item.isCurrent}
                                    onChange={(e) => {
                                      const updated = [...draftData.timeline];
                                      updated[idx] = { ...updated[idx], endDate: e.target.value };
                                      updateDraftTimeline(updated);
                                    }}
                                    placeholder={item.isCurrent ? 'Present' : 'Select Month'}
                                    className={`w-full px-2.5 py-1.5 rounded-lg border font-mono text-xs focus:outline-none focus:border-[#3B82F6] ${
                                      item.isCurrent
                                        ? 'bg-[#121B2E]/50 border-dashed border-[#1E2C48] text-[#8B97AC]'
                                        : 'bg-[#121B2E] border-[#1E2C48] text-[#F2F5F9]'
                                    }`}
                                  />
                                </div>

                                <div className="flex items-end pb-1">
                                  <label className="inline-flex items-center gap-2 cursor-pointer text-xs text-[#C4CCDA]">
                                    <input
                                      type="checkbox"
                                      checked={!!item.isCurrent}
                                      onChange={(e) => {
                                        const updated = [...draftData.timeline];
                                        updated[idx] = {
                                          ...updated[idx],
                                          isCurrent: e.target.checked,
                                          endDate: e.target.checked ? 'Present' : updated[idx].endDate,
                                        };
                                        updateDraftTimeline(updated);
                                      }}
                                      className="rounded bg-[#121B2E] border-[#1E2C48] text-[#3B82F6] focus:ring-0"
                                    />
                                    <span>Currently working here</span>
                                  </label>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 2: KEY STATISTICS */}
                {activeTab === 'stats' && (
                  <div className="space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#1E2C48]">
                      <div>
                        <h3 className="font-heading font-bold text-lg text-[#F2F5F9]">
                          Key Metrics & Statistics Strip ({draftData.statistics.length})
                        </h3>
                        <p className="text-xs text-[#8B97AC]">
                          Add, remove, or modify the prominent metrics displayed across the portfolio.
                        </p>
                      </div>

                      <button
                        onClick={() => {
                          const newStat: StatItem = {
                            value: '100%',
                            label: 'Client Satisfaction',
                            sublabel: 'Verified engagement track record'
                          };
                          updateDraftStatistics([...draftData.statistics, newStat]);
                        }}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#2F6FED] hover:bg-[#3B82F6] text-white text-xs font-semibold shadow-md transition-colors self-start"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Add Metric</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {draftData.statistics.map((stat, idx) => {
                        const isExp = /experience/i.test(stat.label) || (idx === 0 && /years/i.test(stat.label));
                        const currentExp = getTotalCareerExperience(draftData.consultant.careerStartDate, draftData.timeline);

                        return (
                          <div
                            key={idx}
                            className={`p-4 rounded-2xl border space-y-3 relative group ${
                              isExp
                                ? 'bg-[#0D1424] border-[#3B82F6]/50 shadow-md shadow-[#3B82F6]/5'
                                : 'bg-[#121B2E] border-[#1E2C48]'
                            }`}
                          >
                            <div className="flex items-center justify-between text-xs font-mono pb-2 border-b border-[#1E2C48]">
                              <div className="flex items-center gap-2">
                                <span className="text-[#D9A94E] font-bold">Metric #{idx + 1}</span>
                                {isExp && (
                                  <span className="px-2 py-0.5 rounded-full bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/30 text-[10px] font-bold flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-ping" />
                                    Auto-Calculated ({currentExp.linkedInDuration})
                                  </span>
                                )}
                              </div>
                              <button
                                onClick={() => {
                                  const newStats = draftData.statistics.filter((_, i) => i !== idx);
                                  updateDraftStatistics(newStats);
                                }}
                                className="p-1.5 rounded-lg bg-[#0D1424] hover:bg-rose-500/20 text-[#8B97AC] hover:text-rose-400 border border-[#1E2C48]"
                                title="Remove Metric"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>

                            {isExp && (
                              <div className="p-2.5 rounded-xl bg-[#121B2E] border border-[#1E2C48] space-y-2 text-xs">
                                <div className="flex items-center justify-between">
                                  <label className="text-[11px] font-semibold text-[#8B97AC]">
                                    Calculate from Start Date:
                                  </label>
                                  <span className="font-mono text-[#3B82F6] font-bold">
                                    {currentExp.yearsPlus} ({currentExp.fullDurationSpelled})
                                  </span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <input
                                    type="month"
                                    value={draftData.consultant.careerStartDate || '2013-01'}
                                    onChange={(e) => {
                                      const newStart = e.target.value;
                                      const calcExp = getTotalCareerExperience(newStart, draftData.timeline);
                                      const newStats = [...draftData.statistics];
                                      newStats[idx] = { ...newStats[idx], value: calcExp.yearsPlus };
                                      updateDraftConsultant({
                                        careerStartDate: newStart,
                                        yearsOfExperience: calcExp.yearsPlusText,
                                      });
                                      updateDraftStatistics(newStats);
                                    }}
                                    className="w-full px-2.5 py-1.5 rounded-lg bg-[#0D1424] border border-[#1E2C48] font-mono text-xs text-[#D9A94E] font-bold focus:outline-none focus:border-[#3B82F6]"
                                  />
                                </div>
                              </div>
                            )}

                            <div>
                              <div className="flex items-center justify-between mb-1">
                                <label className="block text-[11px] font-semibold text-[#8B97AC]">
                                  Display Value (e.g. {isExp ? currentExp.yearsPlus : '12+, 3+, 500+, 15–20%'})
                                </label>
                                {isExp && (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const newStats = [...draftData.statistics];
                                      newStats[idx] = { ...newStats[idx], value: currentExp.yearsPlus };
                                      updateDraftStatistics(newStats);
                                    }}
                                    className="text-[10px] font-mono text-[#3B82F6] hover:underline"
                                  >
                                    Reset to {currentExp.yearsPlus}
                                  </button>
                                )}
                              </div>
                              <input
                                type="text"
                                value={isExp ? currentExp.yearsPlus : stat.value}
                                onChange={(e) => {
                                  const newStats = [...draftData.statistics];
                                  newStats[idx] = { ...newStats[idx], value: e.target.value };
                                  updateDraftStatistics(newStats);
                                }}
                                className="w-full px-3 py-2 rounded-xl bg-[#0D1424] border border-[#1E2C48] text-sm font-bold text-[#3B82F6] focus:outline-none"
                              />
                            </div>

                            <div>
                              <label className="block text-[11px] font-semibold text-[#8B97AC] mb-1">Primary Label</label>
                              <input
                                type="text"
                                value={stat.label}
                                onChange={(e) => {
                                  const newStats = [...draftData.statistics];
                                  newStats[idx] = { ...newStats[idx], label: e.target.value };
                                  updateDraftStatistics(newStats);
                                }}
                                className="w-full px-3 py-2 rounded-xl bg-[#0D1424] border border-[#1E2C48] text-xs text-[#F2F5F9] focus:outline-none"
                              />
                            </div>

                            <div>
                              <label className="block text-[11px] font-semibold text-[#8B97AC] mb-1">Sublabel (Contextual Detail)</label>
                              <input
                                type="text"
                                value={stat.sublabel || ''}
                                onChange={(e) => {
                                  const newStats = [...draftData.statistics];
                                  newStats[idx] = { ...newStats[idx], sublabel: e.target.value };
                                  updateDraftStatistics(newStats);
                                }}
                                className="w-full px-3 py-2 rounded-xl bg-[#0D1424] border border-[#1E2C48] text-xs text-[#C4CCDA] focus:outline-none"
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* TAB 3: CORE EXPERTISE & SERVICES */}
                {activeTab === 'expertise' && (
                  <div className="space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#1E2C48]">
                      <div>
                        <h3 className="font-heading font-bold text-lg text-[#F2F5F9]">
                          Core Disciplines & Consulting Services ({draftData.expertise.length})
                        </h3>
                        <p className="text-xs text-[#8B97AC]">
                          Add, edit, or customize SAP disciplines, deliverables, and capabilities.
                        </p>
                      </div>

                      <button
                        onClick={() => {
                          const newExp: ExpertiseItem = {
                            id: `service-${Date.now()}`,
                            code: 'SAP S/4',
                            title: 'SAP S/4HANA Migration & Architecture',
                            shortDesc: 'End-to-end cloud and on-premise transition strategies.',
                            fullDesc: 'Comprehensive architectural assessment, data migration, and cutover leadership.',
                            iconName: 'Factory',
                            keyCapabilities: ['Process Mapping', 'Migration Cockpit', 'Shop Floor Integration'],
                            deliverables: ['Readiness Assessment', 'Migration Blueprints', 'Hypercare Support']
                          };
                          updateDraftExpertise([...draftData.expertise, newExp]);
                        }}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#2F6FED] hover:bg-[#3B82F6] text-white text-xs font-semibold shadow-md transition-colors self-start"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Add Discipline</span>
                      </button>
                    </div>

                    <div className="space-y-6">
                      {draftData.expertise.map((exp, idx) => (
                        <div key={exp.id} className="p-5 rounded-2xl bg-[#121B2E] border border-[#1E2C48] space-y-4">
                          <div className="flex items-center justify-between pb-3 border-b border-[#1E2C48]">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-mono font-bold text-[#D9A94E]">#{idx + 1}</span>
                              <span className="font-heading font-bold text-sm text-[#F2F5F9]">{exp.title}</span>
                              <span className="px-2 py-0.5 rounded bg-[#0D1424] text-[11px] font-mono text-[#3B82F6] border border-[#1E2C48]">
                                {exp.code}
                              </span>
                            </div>

                            <button
                              type="button"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                const filtered = draftData.expertise.filter((_, i) => i !== idx);
                                updateDraftExpertise(filtered);
                              }}
                              className="p-1.5 rounded-lg bg-[#0D1424] hover:bg-rose-500/20 text-[#8B97AC] hover:text-rose-400 border border-[#1E2C48] hover:border-rose-500/50 transition-colors cursor-pointer"
                              title="Delete Discipline"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                            <div>
                              <label className="block font-semibold text-[#8B97AC] mb-1">Module ID</label>
                              <input
                                type="text"
                                value={exp.id}
                                onChange={(e) => {
                                  const updated = [...draftData.expertise];
                                  updated[idx] = { ...updated[idx], id: e.target.value };
                                  updateDraftExpertise(updated);
                                }}
                                className="w-full px-3 py-2 rounded-xl bg-[#0D1424] border border-[#1E2C48] text-xs font-mono text-[#F2F5F9] focus:outline-none"
                              />
                            </div>

                            <div>
                              <label className="block font-semibold text-[#8B97AC] mb-1">Module Code (e.g. SAP PP)</label>
                              <input
                                type="text"
                                value={exp.code}
                                onChange={(e) => {
                                  const updated = [...draftData.expertise];
                                  updated[idx] = { ...updated[idx], code: e.target.value };
                                  updateDraftExpertise(updated);
                                }}
                                className="w-full px-3 py-2 rounded-xl bg-[#0D1424] border border-[#1E2C48] text-xs text-[#F2F5F9] focus:outline-none"
                              />
                            </div>

                            <div>
                              <label className="block font-semibold text-[#8B97AC] mb-1">Icon Style</label>
                              <select
                                value={exp.iconName}
                                onChange={(e) => {
                                  const updated = [...draftData.expertise];
                                  updated[idx] = { ...updated[idx], iconName: e.target.value };
                                  updateDraftExpertise(updated);
                                }}
                                className="w-full px-3 py-2 rounded-xl bg-[#0D1424] border border-[#1E2C48] text-xs text-[#F2F5F9] focus:outline-none"
                              >
                                <option value="Factory">Factory (Production)</option>
                                <option value="CheckCircle2">CheckCircle (Quality)</option>
                                <option value="Wrench">Wrench (Maintenance)</option>
                                <option value="ShieldCheck">ShieldCheck (IT Systems)</option>
                                <option value="Cpu">Cpu (Technical)</option>
                                <option value="Layers">Layers (General)</option>
                              </select>
                            </div>

                            <div className="sm:col-span-3">
                              <label className="block font-semibold text-[#8B97AC] mb-1">Discipline Title</label>
                              <input
                                type="text"
                                value={exp.title}
                                onChange={(e) => {
                                  const updated = [...draftData.expertise];
                                  updated[idx] = { ...updated[idx], title: e.target.value };
                                  updateDraftExpertise(updated);
                                }}
                                className="w-full px-3 py-2 rounded-xl bg-[#0D1424] border border-[#1E2C48] text-xs text-[#F2F5F9] focus:outline-none"
                              />
                            </div>

                            <div className="sm:col-span-3">
                              <label className="block font-semibold text-[#8B97AC] mb-1">Short Description (Card Overview)</label>
                              <input
                                type="text"
                                value={exp.shortDesc}
                                onChange={(e) => {
                                  const updated = [...draftData.expertise];
                                  updated[idx] = { ...updated[idx], shortDesc: e.target.value };
                                  updateDraftExpertise(updated);
                                }}
                                className="w-full px-3 py-2 rounded-xl bg-[#0D1424] border border-[#1E2C48] text-xs text-[#C4CCDA] focus:outline-none"
                              />
                            </div>

                            <div className="sm:col-span-3">
                              <label className="block font-semibold text-[#8B97AC] mb-1">Full Detailed Narrative</label>
                              <textarea
                                rows={3}
                                value={exp.fullDesc}
                                onChange={(e) => {
                                  const updated = [...draftData.expertise];
                                  updated[idx] = { ...updated[idx], fullDesc: e.target.value };
                                  updateDraftExpertise(updated);
                                }}
                                className="w-full px-3 py-2 rounded-xl bg-[#0D1424] border border-[#1E2C48] text-xs text-[#C4CCDA] focus:outline-none"
                              />
                            </div>
                          </div>

                          {/* Capabilities Sub-list */}
                          <div className="pt-3 border-t border-[#1E2C48]/60 space-y-2">
                            <div className="flex items-center justify-between">
                              <label className="text-[11px] font-semibold text-[#8B97AC] uppercase font-mono tracking-wider">
                                Key Focus Capabilities ({exp.keyCapabilities?.length || 0})
                              </label>
                              <button
                                onClick={() => {
                                  const updated = [...draftData.expertise];
                                  const currentCaps = updated[idx].keyCapabilities || [];
                                  updated[idx] = {
                                    ...updated[idx],
                                    keyCapabilities: [...currentCaps, 'New Capability']
                                  };
                                  updateDraftExpertise(updated);
                                }}
                                className="text-[11px] text-[#3B82F6] hover:text-[#F2F5F9] font-semibold flex items-center gap-1"
                              >
                                <Plus className="w-3 h-3" />
                                <span>Add Capability</span>
                              </button>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              {(exp.keyCapabilities || []).map((cap, cIdx) => (
                                <div key={cIdx} className="flex items-center gap-1.5">
                                  <input
                                    type="text"
                                    value={cap}
                                    onChange={(e) => {
                                      const updated = [...draftData.expertise];
                                      const caps = [...(updated[idx].keyCapabilities || [])];
                                      caps[cIdx] = e.target.value;
                                      updated[idx] = { ...updated[idx], keyCapabilities: caps };
                                      updateDraftExpertise(updated);
                                    }}
                                    className="w-full px-2.5 py-1.5 rounded-lg bg-[#0D1424] border border-[#1E2C48] text-xs text-[#F2F5F9] focus:outline-none"
                                  />
                                  <button
                                    onClick={() => {
                                      const updated = [...draftData.expertise];
                                      const caps = (updated[idx].keyCapabilities || []).filter((_, i) => i !== cIdx);
                                      updated[idx] = { ...updated[idx], keyCapabilities: caps };
                                      updateDraftExpertise(updated);
                                    }}
                                    className="p-1.5 rounded-lg text-[#8B97AC] hover:text-rose-400"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Deliverables Sub-list */}
                          <div className="pt-3 border-t border-[#1E2C48]/60 space-y-2">
                            <div className="flex items-center justify-between">
                              <label className="text-[11px] font-semibold text-[#8B97AC] uppercase font-mono tracking-wider">
                                Deliverables & Implementation Outputs ({exp.deliverables?.length || 0})
                              </label>
                              <button
                                onClick={() => {
                                  const updated = [...draftData.expertise];
                                  const currentDels = updated[idx].deliverables || [];
                                  updated[idx] = {
                                    ...updated[idx],
                                    deliverables: [...currentDels, 'New Project Deliverable']
                                  };
                                  updateDraftExpertise(updated);
                                }}
                                className="text-[11px] text-[#3B82F6] hover:text-[#F2F5F9] font-semibold flex items-center gap-1"
                              >
                                <Plus className="w-3 h-3" />
                                <span>Add Deliverable</span>
                              </button>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              {(exp.deliverables || []).map((del, dIdx) => (
                                <div key={dIdx} className="flex items-center gap-1.5">
                                  <input
                                    type="text"
                                    value={del}
                                    onChange={(e) => {
                                      const updated = [...draftData.expertise];
                                      const dels = [...(updated[idx].deliverables || [])];
                                      dels[dIdx] = e.target.value;
                                      updated[idx] = { ...updated[idx], deliverables: dels };
                                      updateDraftExpertise(updated);
                                    }}
                                    className="w-full px-2.5 py-1.5 rounded-lg bg-[#0D1424] border border-[#1E2C48] text-xs text-[#F2F5F9] focus:outline-none"
                                  />
                                  <button
                                    onClick={() => {
                                      const updated = [...draftData.expertise];
                                      const dels = (updated[idx].deliverables || []).filter((_, i) => i !== dIdx);
                                      updated[idx] = { ...updated[idx], deliverables: dels };
                                      updateDraftExpertise(updated);
                                    }}
                                    className="p-1.5 rounded-lg text-[#8B97AC] hover:text-rose-400"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>

                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* TAB 4: CASE STUDIES */}
                {activeTab === 'caseStudies' && (
                  <div className="space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#1E2C48]">
                      <div>
                        <h3 className="font-heading font-bold text-lg text-[#F2F5F9]">
                          Case Studies & Client Engagements ({draftData.caseStudies.length})
                        </h3>
                        <p className="text-xs text-[#8B97AC]">
                          Add, modify, remove, or toggle featured status for client implementation projects.
                        </p>
                      </div>

                      <button
                        onClick={() => {
                          const newStudy: CaseStudy = {
                            id: `engagement-${Date.now()}`,
                            title: 'New Client Implementation',
                            company: 'Enterprise Manufacturing Client',
                            location: 'Islamabad / Global',
                            modules: ['SAP PP', 'SAP QM', 'SAP PM'],
                            category: 'full-cycle',
                            categoryLabel: 'Full Lifecycle Implementation',
                            engagementType: 'On-site & Remote Consulting',
                            challenge: 'High operational overhead and disparate shop-floor systems.',
                            solution: 'Standardized end-to-end SAP manufacturing workflows with real-time inspection lot automation.',
                            outcome: 'Streamlined plant productivity by 25% with zero cutover disruption.',
                            metrics: [{ label: 'Productivity Lift', value: '+25%' }],
                            featured: false
                          };
                          updateDraftCaseStudies([newStudy, ...draftData.caseStudies]);
                        }}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#2F6FED] hover:bg-[#3B82F6] text-white text-xs font-semibold shadow-md transition-colors self-start"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Add Case Study</span>
                      </button>
                    </div>

                    <div className="space-y-6">
                      {draftData.caseStudies.map((study, idx) => (
                        <div key={study.id} className="p-5 rounded-2xl bg-[#121B2E] border border-[#1E2C48] space-y-4">
                          <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[#1E2C48]">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-mono font-bold text-[#D9A94E]">#{idx + 1}</span>
                              <span className="font-heading font-bold text-sm text-[#F2F5F9]">{study.title}</span>
                              {study.featured && (
                                <span className="px-2 py-0.5 rounded-full bg-[#D9A94E]/15 text-[#D9A94E] border border-[#D9A94E]/30 text-[10px] font-mono font-semibold">
                                  FEATURED
                                </span>
                              )}
                            </div>

                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => {
                                  const updated = [...draftData.caseStudies];
                                  updated[idx] = { ...updated[idx], featured: !updated[idx].featured };
                                  updateDraftCaseStudies(updated);
                                }}
                                className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors ${
                                  study.featured
                                    ? 'bg-[#D9A94E]/20 text-[#D9A94E] border-[#D9A94E]/40'
                                    : 'bg-[#0D1424] text-[#8B97AC] border-[#1E2C48] hover:text-[#F2F5F9]'
                                }`}
                              >
                                {study.featured ? '★ Featured On Home' : 'Set as Featured'}
                              </button>

                              <button
                                type="button"
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  const filtered = draftData.caseStudies.filter((_, i) => i !== idx);
                                  updateDraftCaseStudies(filtered);
                                }}
                                className="p-1.5 rounded-lg bg-[#0D1424] hover:bg-rose-500/20 text-[#8B97AC] hover:text-rose-400 border border-[#1E2C48] hover:border-rose-500/50 transition-colors cursor-pointer"
                                title="Delete Case Study"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                            <div className="sm:col-span-2">
                              <label className="block font-semibold text-[#8B97AC] mb-1">Project Title</label>
                              <input
                                type="text"
                                value={study.title}
                                onChange={(e) => {
                                  const updated = [...draftData.caseStudies];
                                  updated[idx] = { ...updated[idx], title: e.target.value };
                                  updateDraftCaseStudies(updated);
                                }}
                                className="w-full px-3 py-2 rounded-xl bg-[#0D1424] border border-[#1E2C48] text-xs text-[#F2F5F9] focus:outline-none"
                              />
                            </div>

                            <div>
                              <label className="block font-semibold text-[#8B97AC] mb-1">Client / Company Name</label>
                              <input
                                type="text"
                                value={study.company}
                                onChange={(e) => {
                                  const updated = [...draftData.caseStudies];
                                  updated[idx] = { ...updated[idx], company: e.target.value };
                                  updateDraftCaseStudies(updated);
                                }}
                                className="w-full px-3 py-2 rounded-xl bg-[#0D1424] border border-[#1E2C48] text-xs text-[#F2F5F9] focus:outline-none"
                              />
                            </div>

                            <div>
                              <label className="block font-semibold text-[#8B97AC] mb-1">Location / Market</label>
                              <input
                                type="text"
                                value={study.location}
                                onChange={(e) => {
                                  const updated = [...draftData.caseStudies];
                                  updated[idx] = { ...updated[idx], location: e.target.value };
                                  updateDraftCaseStudies(updated);
                                }}
                                className="w-full px-3 py-2 rounded-xl bg-[#0D1424] border border-[#1E2C48] text-xs text-[#F2F5F9] focus:outline-none"
                              />
                            </div>

                            <div>
                              <label className="block font-semibold text-[#8B97AC] mb-1">Category Type</label>
                              <select
                                value={study.category}
                                onChange={(e) => {
                                  const val = e.target.value as 'full-cycle' | 'operational-support' | 'it-systems';
                                  const updated = [...draftData.caseStudies];
                                  updated[idx] = {
                                    ...updated[idx],
                                    category: val,
                                    categoryLabel: val === 'full-cycle' ? 'Full Lifecycle Implementation' : val === 'operational-support' ? 'Operations & Optimization' : 'IT Infrastructure & Systems'
                                  };
                                  updateDraftCaseStudies(updated);
                                }}
                                className="w-full px-3 py-2 rounded-xl bg-[#0D1424] border border-[#1E2C48] text-xs text-[#F2F5F9] focus:outline-none"
                              >
                                <option value="full-cycle">Full Lifecycle Implementation</option>
                                <option value="operational-support">Operations & Optimization</option>
                                <option value="it-systems">IT Systems & Infrastructure</option>
                              </select>
                            </div>

                            <div>
                              <label className="block font-semibold text-[#8B97AC] mb-1">Engagement Type</label>
                              <input
                                type="text"
                                value={study.engagementType}
                                onChange={(e) => {
                                  const updated = [...draftData.caseStudies];
                                  updated[idx] = { ...updated[idx], engagementType: e.target.value };
                                  updateDraftCaseStudies(updated);
                                }}
                                className="w-full px-3 py-2 rounded-xl bg-[#0D1424] border border-[#1E2C48] text-xs text-[#F2F5F9] focus:outline-none"
                              />
                            </div>

                            <div className="sm:col-span-3">
                              <label className="block font-semibold text-[#8B97AC] mb-1">Client Business Challenge</label>
                              <textarea
                                rows={2}
                                value={study.challenge}
                                onChange={(e) => {
                                  const updated = [...draftData.caseStudies];
                                  updated[idx] = { ...updated[idx], challenge: e.target.value };
                                  updateDraftCaseStudies(updated);
                                }}
                                className="w-full px-3 py-2 rounded-xl bg-[#0D1424] border border-[#1E2C48] text-xs text-[#C4CCDA] focus:outline-none"
                              />
                            </div>

                            <div className="sm:col-span-3">
                              <label className="block font-semibold text-[#8B97AC] mb-1">Solution Delivered & Architecture</label>
                              <textarea
                                rows={2}
                                value={study.solution}
                                onChange={(e) => {
                                  const updated = [...draftData.caseStudies];
                                  updated[idx] = { ...updated[idx], solution: e.target.value };
                                  updateDraftCaseStudies(updated);
                                }}
                                className="w-full px-3 py-2 rounded-xl bg-[#0D1424] border border-[#1E2C48] text-xs text-[#C4CCDA] focus:outline-none"
                              />
                            </div>

                            <div className="sm:col-span-3">
                              <label className="block font-semibold text-[#8B97AC] mb-1">Measurable Business Outcome</label>
                              <textarea
                                rows={2}
                                value={study.outcome}
                                onChange={(e) => {
                                  const updated = [...draftData.caseStudies];
                                  updated[idx] = { ...updated[idx], outcome: e.target.value };
                                  updateDraftCaseStudies(updated);
                                }}
                                className="w-full px-3 py-2 rounded-xl bg-[#0D1424] border border-[#1E2C48] text-xs text-[#C4CCDA] focus:outline-none"
                              />
                            </div>
                          </div>

                          {/* Modules List */}
                          <div className="pt-2 border-t border-[#1E2C48]/60 space-y-2">
                            <div className="flex items-center justify-between">
                              <label className="text-[11px] font-semibold text-[#8B97AC] uppercase font-mono tracking-wider">
                                SAP Modules Applied ({study.modules?.length || 0})
                              </label>
                              <button
                                onClick={() => {
                                  const updated = [...draftData.caseStudies];
                                  const mods = updated[idx].modules || [];
                                  updated[idx] = { ...updated[idx], modules: [...mods, 'SAP PP'] };
                                  updateDraftCaseStudies(updated);
                                }}
                                className="text-[11px] text-[#3B82F6] hover:text-[#F2F5F9] font-semibold flex items-center gap-1"
                              >
                                <Plus className="w-3 h-3" />
                                <span>Add Module Tag</span>
                              </button>
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                              {(study.modules || []).map((mod, mIdx) => (
                                <div key={mIdx} className="flex items-center gap-1">
                                  <input
                                    type="text"
                                    value={mod}
                                    onChange={(e) => {
                                      const updated = [...draftData.caseStudies];
                                      const mods = [...(updated[idx].modules || [])];
                                      mods[mIdx] = e.target.value;
                                      updated[idx] = { ...updated[idx], modules: mods };
                                      updateDraftCaseStudies(updated);
                                    }}
                                    className="w-full px-2 py-1 rounded-lg bg-[#0D1424] border border-[#1E2C48] text-xs font-mono text-[#F2F5F9] focus:outline-none"
                                  />
                                  <button
                                    onClick={() => {
                                      const updated = [...draftData.caseStudies];
                                      const mods = (updated[idx].modules || []).filter((_, i) => i !== mIdx);
                                      updated[idx] = { ...updated[idx], modules: mods };
                                      updateDraftCaseStudies(updated);
                                    }}
                                    className="p-1 text-[#8B97AC] hover:text-rose-400"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* TAB 5: SKILLS MATRIX */}
                {activeTab === 'skills' && (
                  <div className="space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#1E2C48]">
                      <div>
                        <h3 className="font-heading font-bold text-lg text-[#F2F5F9]">
                          Competency Matrix & Skill Items ({draftData.skills.length})
                        </h3>
                        <p className="text-xs text-[#8B97AC]">
                          Configure individual technical skills, proficiency levels, and category groupings.
                        </p>
                      </div>

                      <button
                        onClick={() => {
                          const newSkill: SkillItem = {
                            name: 'SAP Production Planning (PP)',
                            percentage: 95,
                            category: 'Core SAP',
                            details: 'BOM, Routing, MRP, Production Orders & Shop Floor execution.'
                          };
                          updateDraftSkills([...draftData.skills, newSkill]);
                        }}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#2F6FED] hover:bg-[#3B82F6] text-white text-xs font-semibold shadow-md transition-colors self-start"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Add Skill</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {draftData.skills.map((skill, idx) => (
                        <div key={idx} className="p-4 rounded-2xl bg-[#121B2E] border border-[#1E2C48] space-y-3">
                          <div className="flex items-center justify-between pb-2 border-b border-[#1E2C48]">
                            <span className="text-xs font-mono font-bold text-[#D9A94E]">Skill #{idx + 1}</span>
                            <button
                              onClick={() => {
                                const updated = draftData.skills.filter((_, i) => i !== idx);
                                updateDraftSkills(updated);
                              }}
                              className="p-1.5 rounded-lg bg-[#0D1424] hover:bg-rose-500/20 text-[#8B97AC] hover:text-rose-400 border border-[#1E2C48]"
                              title="Delete Skill"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                            <div className="sm:col-span-2">
                              <label className="block font-semibold text-[#8B97AC] mb-1">Skill Name</label>
                              <input
                                type="text"
                                value={skill.name}
                                onChange={(e) => {
                                  const updated = [...draftData.skills];
                                  updated[idx] = { ...updated[idx], name: e.target.value };
                                  updateDraftSkills(updated);
                                }}
                                className="w-full px-3 py-2 rounded-xl bg-[#0D1424] border border-[#1E2C48] text-xs text-[#F2F5F9] focus:outline-none"
                              />
                            </div>

                            <div>
                              <label className="block font-semibold text-[#8B97AC] mb-1">Category Group</label>
                              <select
                                value={skill.category}
                                onChange={(e) => {
                                  const val = e.target.value as 'Core SAP' | 'Methodology & Integration' | 'IT Systems';
                                  const updated = [...draftData.skills];
                                  updated[idx] = { ...updated[idx], category: val };
                                  updateDraftSkills(updated);
                                }}
                                className="w-full px-3 py-2 rounded-xl bg-[#0D1424] border border-[#1E2C48] text-xs text-[#F2F5F9] focus:outline-none"
                              >
                                <option value="Core SAP">Core SAP</option>
                                <option value="Methodology & Integration">Methodology & Integration</option>
                                <option value="IT Systems">IT Systems</option>
                              </select>
                            </div>

                            <div>
                              <label className="block font-semibold text-[#8B97AC] mb-1">Proficiency % ({skill.percentage}%)</label>
                              <input
                                type="number"
                                min={50}
                                max={100}
                                value={skill.percentage}
                                onChange={(e) => {
                                  const updated = [...draftData.skills];
                                  updated[idx] = { ...updated[idx], percentage: parseInt(e.target.value) || 90 };
                                  updateDraftSkills(updated);
                                }}
                                className="w-full px-3 py-2 rounded-xl bg-[#0D1424] border border-[#1E2C48] text-xs font-mono text-[#3B82F6] focus:outline-none"
                              />
                            </div>

                            <div className="sm:col-span-2">
                              <label className="block font-semibold text-[#8B97AC] mb-1">Description / Key Technical Notes</label>
                              <input
                                type="text"
                                value={skill.details || ''}
                                onChange={(e) => {
                                  const updated = [...draftData.skills];
                                  updated[idx] = { ...updated[idx], details: e.target.value };
                                  updateDraftSkills(updated);
                                }}
                                className="w-full px-3 py-2 rounded-xl bg-[#0D1424] border border-[#1E2C48] text-xs text-[#C4CCDA] focus:outline-none"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* TAB 6: CAREER TIMELINE */}
                {activeTab === 'timeline' && (
                  <div className="space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#1E2C48]">
                      <div>
                        <h3 className="font-heading font-bold text-lg text-[#F2F5F9]">
                          Career Milestones & Roles ({draftData.timeline.length})
                        </h3>
                        <p className="text-xs text-[#8B97AC]">
                          Add, reorder, or edit roles in your professional career timeline.
                        </p>
                      </div>

                      <button
                        onClick={() => {
                          const newItem: TimelineItemData = {
                            year: 'Jan 2024 - Present',
                            startDate: '2024-01',
                            endDate: '',
                            role: 'Senior SAP Consultant',
                            company: 'Enterprise Consulting / Client',
                            description: 'Leading SAP PP/QM/PM program execution and plant optimizations.',
                            isCurrent: true,
                            keyHighlights: ['Spearheaded cross-functional go-live', 'Optimized shop floor productivity']
                          };
                          updateDraftTimeline([newItem, ...draftData.timeline]);
                        }}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#2F6FED] hover:bg-[#3B82F6] text-white text-xs font-semibold shadow-md transition-colors self-start"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Add Career Milestone</span>
                      </button>
                    </div>

                    <div className="space-y-6">
                      {draftData.timeline.map((item, idx) => {
                        const dateInfo = getLinkedInDateInfo(item.startDate, item.endDate, item.isCurrent, item.year);

                        return (
                          <div key={idx} className="p-5 rounded-2xl bg-[#121B2E] border border-[#1E2C48] space-y-4">
                            <div className="flex items-center justify-between pb-3 border-b border-[#1E2C48]">
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-mono font-bold text-[#D9A94E]">#{idx + 1}</span>
                                <span className="font-heading font-bold text-sm text-[#F2F5F9]">{item.role}</span>
                                <span className="text-xs text-[#8B97AC]">at {item.company}</span>
                                {item.isCurrent && (
                                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-mono">
                                    CURRENT
                                  </span>
                                )}
                              </div>

                              <div className="flex items-center gap-2">
                                <label className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-[#0D1424] border border-[#1E2C48] hover:border-[#10B981]/50 cursor-pointer text-xs select-none">
                                  <input
                                    type="checkbox"
                                    checked={Boolean(item.isCurrent)}
                                    onChange={(e) => {
                                      const updated = [...draftData.timeline];
                                      const isCurr = e.target.checked;
                                      const newDateInfo = getLinkedInDateInfo(updated[idx].startDate, isCurr ? '' : updated[idx].endDate, isCurr, updated[idx].year);
                                      updated[idx] = {
                                        ...updated[idx],
                                        isCurrent: isCurr,
                                        endDate: isCurr ? '' : updated[idx].endDate,
                                        year: newDateInfo.dateRangeText
                                      };
                                      updateDraftTimeline(updated);
                                    }}
                                    className="w-4 h-4 rounded border-[#1E2C48] text-[#10B981] bg-[#121B2E] focus:ring-2 focus:ring-[#10B981] cursor-pointer accent-[#10B981]"
                                  />
                                  <span className={`font-mono text-[11px] font-semibold ${item.isCurrent ? 'text-[#10B981]' : 'text-[#8B97AC]'}`}>
                                    {item.isCurrent ? 'Current Active Role (Blinks Green on Front Screen)' : 'Mark as Current Role'}
                                  </span>
                                </label>

                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    const updated = draftData.timeline.filter((_, i) => i !== idx);
                                    updateDraftTimeline(updated);
                                  }}
                                  className="p-1.5 rounded-lg bg-[#0D1424] hover:bg-rose-500/20 text-[#8B97AC] hover:text-rose-400 border border-[#1E2C48] hover:border-rose-500/50 transition-colors cursor-pointer"
                                  title="Delete Milestone"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>

                            {/* Auto-Calculated LinkedIn Duration Banner */}
                            <div className="p-3 rounded-xl bg-[#0A0E1A] border border-[#1E2C48] flex flex-wrap items-center justify-between gap-2 text-xs">
                              <div className="flex flex-wrap items-center gap-2">
                                <Calendar className="w-4 h-4 text-[#D9A94E]" />
                                <span className="text-[#8B97AC] font-medium">LinkedIn Duration (Auto-Calculated):</span>
                                <span className="font-mono font-bold text-[#F2F5F9]">{dateInfo.dateRangeText}</span>
                                {dateInfo.durationText && (
                                  <>
                                    <span className="text-[#8B97AC]">·</span>
                                    <span className="px-2.5 py-0.5 rounded-md bg-[#D9A94E]/20 text-[#D9A94E] font-semibold font-mono border border-[#D9A94E]/40">
                                      {dateInfo.durationText}
                                    </span>
                                  </>
                                )}
                              </div>
                              {item.isCurrent ? (
                                <span className="text-[11px] font-mono text-[#10B981] font-bold uppercase flex items-center gap-1">
                                  <span className="w-2 h-2 rounded-full bg-[#10B981] animate-ping" />
                                  Present Role Active
                                </span>
                              ) : (
                                <span className="text-[11px] font-mono text-[#8B97AC]">
                                  Completed Milestone
                                </span>
                              )}
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                              <div>
                                <label className="block font-semibold text-[#8B97AC] mb-1">
                                  Date In (Start Month/Year)
                                </label>
                                <input
                                  type="month"
                                  value={item.startDate || ''}
                                  onChange={(e) => {
                                    const updated = [...draftData.timeline];
                                    const val = e.target.value;
                                    const newDateInfo = getLinkedInDateInfo(val, updated[idx].endDate, updated[idx].isCurrent, updated[idx].year);
                                    updated[idx] = {
                                      ...updated[idx],
                                      startDate: val,
                                      year: newDateInfo.dateRangeText
                                    };
                                    updateDraftTimeline(updated);
                                  }}
                                  className="w-full px-3 py-2 rounded-xl bg-[#0D1424] border border-[#1E2C48] text-xs font-mono text-[#F2F5F9] focus:outline-none focus:border-[#3B82F6]"
                                />
                              </div>

                              <div>
                                <label className="block font-semibold text-[#8B97AC] mb-1">
                                  Date Out (End Month/Year)
                                </label>
                                <input
                                  type="month"
                                  disabled={Boolean(item.isCurrent)}
                                  value={item.isCurrent ? '' : (item.endDate || '')}
                                  placeholder={item.isCurrent ? 'Present' : 'Select end date'}
                                  onChange={(e) => {
                                    const updated = [...draftData.timeline];
                                    const val = e.target.value;
                                    const newDateInfo = getLinkedInDateInfo(updated[idx].startDate, val, false, updated[idx].year);
                                    updated[idx] = {
                                      ...updated[idx],
                                      endDate: val,
                                      year: newDateInfo.dateRangeText
                                    };
                                    updateDraftTimeline(updated);
                                  }}
                                  className={`w-full px-3 py-2 rounded-xl border text-xs font-mono text-[#F2F5F9] focus:outline-none ${
                                    item.isCurrent
                                      ? 'bg-[#121B2E]/50 border-[#1E2C48]/50 text-[#8B97AC] cursor-not-allowed'
                                      : 'bg-[#0D1424] border-[#1E2C48] focus:border-[#3B82F6]'
                                  }`}
                                />
                              </div>

                              <div>
                                <label className="block font-semibold text-[#8B97AC] mb-1">Role Title</label>
                                <input
                                  type="text"
                                  value={item.role}
                                  onChange={(e) => {
                                    const updated = [...draftData.timeline];
                                    updated[idx] = { ...updated[idx], role: e.target.value };
                                    updateDraftTimeline(updated);
                                  }}
                                  className="w-full px-3 py-2 rounded-xl bg-[#0D1424] border border-[#1E2C48] text-xs text-[#F2F5F9] focus:outline-none focus:border-[#3B82F6]"
                                />
                              </div>

                              <div>
                                <label className="block font-semibold text-[#8B97AC] mb-1">Company / Organization</label>
                                <input
                                  type="text"
                                  value={item.company}
                                  onChange={(e) => {
                                    const updated = [...draftData.timeline];
                                    updated[idx] = { ...updated[idx], company: e.target.value };
                                    updateDraftTimeline(updated);
                                  }}
                                  className="w-full px-3 py-2 rounded-xl bg-[#0D1424] border border-[#1E2C48] text-xs text-[#F2F5F9] focus:outline-none focus:border-[#3B82F6]"
                                />
                              </div>

                              <div className="sm:col-span-2 lg:col-span-4">
                                <label className="block font-semibold text-[#8B97AC] mb-1">Overview Description</label>
                                <textarea
                                  rows={2}
                                  value={item.description}
                                  onChange={(e) => {
                                    const updated = [...draftData.timeline];
                                    updated[idx] = { ...updated[idx], description: e.target.value };
                                    updateDraftTimeline(updated);
                                  }}
                                  className="w-full px-3 py-2 rounded-xl bg-[#0D1424] border border-[#1E2C48] text-xs text-[#C4CCDA] focus:outline-none focus:border-[#3B82F6]"
                                />
                              </div>
                            </div>

                          {/* Highlights List */}
                          <div className="pt-2 border-t border-[#1E2C48]/60 space-y-2">
                            <div className="flex items-center justify-between">
                              <label className="text-[11px] font-semibold text-[#8B97AC] uppercase font-mono tracking-wider">
                                Key Highlights & Responsibilities ({item.keyHighlights?.length || 0})
                              </label>
                              <button
                                onClick={() => {
                                  const updated = [...draftData.timeline];
                                  const currentHls = updated[idx].keyHighlights || [];
                                  updated[idx] = {
                                    ...updated[idx],
                                    keyHighlights: [...currentHls, 'New achievement highlight']
                                  };
                                  updateDraftTimeline(updated);
                                }}
                                className="text-[11px] text-[#3B82F6] hover:text-[#F2F5F9] font-semibold flex items-center gap-1"
                              >
                                <Plus className="w-3 h-3" />
                                <span>Add Highlight</span>
                              </button>
                            </div>

                            <div className="space-y-1.5">
                              {(item.keyHighlights || []).map((hl, hlIdx) => (
                                <div key={hlIdx} className="flex items-center gap-1.5">
                                  <input
                                    type="text"
                                    value={hl}
                                    onChange={(e) => {
                                      const updated = [...draftData.timeline];
                                      const hls = [...(updated[idx].keyHighlights || [])];
                                      hls[hlIdx] = e.target.value;
                                      updated[idx] = { ...updated[idx], keyHighlights: hls };
                                      updateDraftTimeline(updated);
                                    }}
                                    className="w-full px-2.5 py-1.5 rounded-lg bg-[#0D1424] border border-[#1E2C48] text-xs text-[#F2F5F9] focus:outline-none"
                                  />
                                  <button
                                    onClick={() => {
                                      const updated = [...draftData.timeline];
                                      const hls = (updated[idx].keyHighlights || []).filter((_, i) => i !== hlIdx);
                                      updated[idx] = { ...updated[idx], keyHighlights: hls };
                                      updateDraftTimeline(updated);
                                    }}
                                    className="p-1.5 rounded-lg text-[#8B97AC] hover:text-rose-400"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                    </div>
                  </div>
                )}

                {/* TAB 7: CLIENT FEEDBACK & TESTIMONIALS */}
                {activeTab === 'testimonials' && (
                  <div className="space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#1E2C48]">
                      <div>
                        <h3 className="font-heading font-bold text-lg text-[#F2F5F9]">
                          Client Endorsements & Testimonials ({draftData.testimonials.length})
                        </h3>
                        <p className="text-xs text-[#8B97AC]">
                          Add, edit, or remove executive recommendations.
                        </p>
                      </div>

                      <button
                        onClick={() => {
                          const newTestimonial: TestimonialItem = {
                            id: `quote-${Date.now()}`,
                            role: 'Plant Operations Director',
                            industry: 'Automotive & Heavy Equipment',
                            location: 'Islamabad / Regional',
                            quote: 'Outstanding functional leadership, proactive troubleshooting, and seamless project execution.'
                          };
                          updateDraftTestimonials([...draftData.testimonials, newTestimonial]);
                        }}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#2F6FED] hover:bg-[#3B82F6] text-white text-xs font-semibold shadow-md transition-colors self-start"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Add Testimonial</span>
                      </button>
                    </div>

                    <div className="space-y-6">
                      {draftData.testimonials.map((t, idx) => (
                        <div key={t.id} className="p-5 rounded-2xl bg-[#121B2E] border border-[#1E2C48] space-y-4">
                          <div className="flex items-center justify-between pb-3 border-b border-[#1E2C48]">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-mono font-bold text-[#D9A94E]">#{idx + 1}</span>
                              <span className="font-heading font-bold text-sm text-[#F2F5F9]">{t.role}</span>
                            </div>

                            <button
                              onClick={() => {
                                const updated = draftData.testimonials.filter((_, i) => i !== idx);
                                updateDraftTestimonials(updated);
                              }}
                              className="p-1.5 rounded-lg bg-[#0D1424] hover:bg-rose-500/20 text-[#8B97AC] hover:text-rose-400 border border-[#1E2C48]"
                              title="Delete Testimonial"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                            <div>
                              <label className="block font-semibold text-[#8B97AC] mb-1">Executive Role</label>
                              <input
                                type="text"
                                value={t.role}
                                onChange={(e) => {
                                  const updated = [...draftData.testimonials];
                                  updated[idx] = { ...updated[idx], role: e.target.value };
                                  updateDraftTestimonials(updated);
                                }}
                                className="w-full px-3 py-2 rounded-xl bg-[#0D1424] border border-[#1E2C48] text-xs text-[#F2F5F9] focus:outline-none"
                              />
                            </div>

                            <div>
                              <label className="block font-semibold text-[#8B97AC] mb-1">Industry Sector</label>
                              <input
                                type="text"
                                value={t.industry}
                                onChange={(e) => {
                                  const updated = [...draftData.testimonials];
                                  updated[idx] = { ...updated[idx], industry: e.target.value };
                                  updateDraftTestimonials(updated);
                                }}
                                className="w-full px-3 py-2 rounded-xl bg-[#0D1424] border border-[#1E2C48] text-xs text-[#F2F5F9] focus:outline-none"
                              />
                            </div>

                            <div>
                              <label className="block font-semibold text-[#8B97AC] mb-1">Location</label>
                              <input
                                type="text"
                                value={t.location}
                                onChange={(e) => {
                                  const updated = [...draftData.testimonials];
                                  updated[idx] = { ...updated[idx], location: e.target.value };
                                  updateDraftTestimonials(updated);
                                }}
                                className="w-full px-3 py-2 rounded-xl bg-[#0D1424] border border-[#1E2C48] text-xs text-[#F2F5F9] focus:outline-none"
                              />
                            </div>

                            <div className="sm:col-span-3">
                              <label className="block font-semibold text-[#8B97AC] mb-1">Recommendation Statement</label>
                              <textarea
                                rows={3}
                                value={t.quote}
                                onChange={(e) => {
                                  const updated = [...draftData.testimonials];
                                  updated[idx] = { ...updated[idx], quote: e.target.value };
                                  updateDraftTestimonials(updated);
                                }}
                                className="w-full px-3 py-2 rounded-xl bg-[#0D1424] border border-[#1E2C48] text-xs text-[#C4CCDA] focus:outline-none leading-relaxed"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* TAB 8: CERTIFICATIONS */}
                {activeTab === 'certifications' && (
                  <div className="space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#1E2C48]">
                      <div>
                        <h3 className="font-heading font-bold text-lg text-[#F2F5F9]">
                          Official Certifications & Credentials ({draftData.certifications.length})
                        </h3>
                        <p className="text-xs text-[#8B97AC]">
                          Manage SAP certifications and credential details.
                        </p>
                      </div>

                      <button
                        onClick={() => {
                          const newCert: CertificationItem = {
                            id: `cert-${Date.now()}`,
                            name: 'SAP Certified Application Associate - SAP S/4HANA Production Planning and Manufacturing',
                            issuer: 'SAP SE',
                            badgeCode: 'SAP S/4HANA',
                            status: 'Certified / Active',
                            verificationPlaceholder: 'SAP Certified Candidate Verification',
                            credentialIdPlaceholder: 'Verification Record Available Upon Request',
                            description: 'Demonstrates comprehensive understanding and in-depth technical skills required of an SAP S/4HANA PP consultant.'
                          };
                          updateDraftCertifications([...draftData.certifications, newCert]);
                        }}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#2F6FED] hover:bg-[#3B82F6] text-white text-xs font-semibold shadow-md transition-colors self-start"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Add Certification</span>
                      </button>
                    </div>

                    <div className="space-y-6">
                      {draftData.certifications.map((cert, idx) => (
                        <div key={cert.id} className="p-5 rounded-2xl bg-[#121B2E] border border-[#1E2C48] space-y-4">
                          <div className="flex items-center justify-between pb-3 border-b border-[#1E2C48]">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-mono font-bold text-[#D9A94E]">#{idx + 1}</span>
                              <span className="font-heading font-bold text-sm text-[#F2F5F9]">{cert.name}</span>
                            </div>

                            <button
                              onClick={() => {
                                const updated = draftData.certifications.filter((_, i) => i !== idx);
                                updateDraftCertifications(updated);
                              }}
                              className="p-1.5 rounded-lg bg-[#0D1424] hover:bg-rose-500/20 text-[#8B97AC] hover:text-rose-400 border border-[#1E2C48]"
                              title="Delete Certification"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                            <div className="sm:col-span-2">
                              <label className="block font-semibold text-[#8B97AC] mb-1">Certification Name</label>
                              <input
                                type="text"
                                value={cert.name}
                                onChange={(e) => {
                                  const updated = [...draftData.certifications];
                                  updated[idx] = { ...updated[idx], name: e.target.value };
                                  updateDraftCertifications(updated);
                                }}
                                className="w-full px-3 py-2 rounded-xl bg-[#0D1424] border border-[#1E2C48] text-xs text-[#F2F5F9] focus:outline-none"
                              />
                            </div>

                            <div>
                              <label className="block font-semibold text-[#8B97AC] mb-1">Issuing Authority</label>
                              <input
                                type="text"
                                value={cert.issuer}
                                onChange={(e) => {
                                  const updated = [...draftData.certifications];
                                  updated[idx] = { ...updated[idx], issuer: e.target.value };
                                  updateDraftCertifications(updated);
                                }}
                                className="w-full px-3 py-2 rounded-xl bg-[#0D1424] border border-[#1E2C48] text-xs text-[#F2F5F9] focus:outline-none"
                              />
                            </div>

                            <div>
                              <label className="block font-semibold text-[#8B97AC] mb-1">Status Badge</label>
                              <input
                                type="text"
                                value={cert.status}
                                onChange={(e) => {
                                  const updated = [...draftData.certifications];
                                  updated[idx] = { ...updated[idx], status: e.target.value };
                                  updateDraftCertifications(updated);
                                }}
                                className="w-full px-3 py-2 rounded-xl bg-[#0D1424] border border-[#1E2C48] text-xs text-[#F2F5F9] focus:outline-none"
                              />
                            </div>

                            <div className="sm:col-span-2">
                              <label className="block font-semibold text-[#8B97AC] mb-1">Badge Code</label>
                              <input
                                type="text"
                                value={cert.badgeCode || ''}
                                onChange={(e) => {
                                  const updated = [...draftData.certifications];
                                  updated[idx] = { ...updated[idx], badgeCode: e.target.value };
                                  updateDraftCertifications(updated);
                                }}
                                className="w-full px-3 py-2 rounded-xl bg-[#0D1424] border border-[#1E2C48] text-xs text-[#F2F5F9] focus:outline-none"
                              />
                            </div>

                            <div className="sm:col-span-3">
                              <label className="block font-semibold text-[#8B97AC] mb-1">Summary Description</label>
                              <textarea
                                rows={2}
                                value={cert.description}
                                onChange={(e) => {
                                  const updated = [...draftData.certifications];
                                  updated[idx] = { ...updated[idx], description: e.target.value };
                                  updateDraftCertifications(updated);
                                }}
                                className="w-full px-3 py-2 rounded-xl bg-[#0D1424] border border-[#1E2C48] text-xs text-[#C4CCDA] focus:outline-none"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* TAB 9: INDUSTRIES TICKER */}
                {activeTab === 'industries' && (
                  <div className="space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#1E2C48]">
                      <div>
                        <h3 className="font-heading font-bold text-lg text-[#F2F5F9]">
                          Industry Experience Banner ({draftData.industriesMarquee.length})
                        </h3>
                        <p className="text-xs text-[#8B97AC]">
                          Industries listed in the animated marquee banner.
                        </p>
                      </div>

                      <button
                        onClick={() => {
                          updateDraftIndustries([...draftData.industriesMarquee, 'New Industry Sector']);
                        }}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#2F6FED] hover:bg-[#3B82F6] text-white text-xs font-semibold shadow-md transition-colors self-start"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Add Industry</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                      {draftData.industriesMarquee.map((ind, idx) => (
                        <div key={idx} className="flex items-center gap-1.5 p-2 rounded-xl bg-[#121B2E] border border-[#1E2C48]">
                          <input
                            type="text"
                            value={ind}
                            onChange={(e) => {
                              const updated = [...draftData.industriesMarquee];
                              updated[idx] = e.target.value;
                              updateDraftIndustries(updated);
                            }}
                            className="w-full px-3 py-1.5 rounded-lg bg-[#0D1424] border border-[#1E2C48] text-xs text-[#F2F5F9] focus:outline-none"
                          />
                          <button
                            onClick={() => {
                              const updated = draftData.industriesMarquee.filter((_, i) => i !== idx);
                              updateDraftIndustries(updated);
                            }}
                            className="p-1.5 rounded-lg text-[#8B97AC] hover:text-rose-400"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* TAB 10: SECURITY & ADMIN USERS */}
                {activeTab === 'security' && (
                  <SecurityTab
                    draftAdminUsers={draftData.adminUsers}
                    onUsersChange={(updatedUsers) => {
                      setDraftData((prev) => ({
                        ...prev,
                        adminUsers: updatedUsers,
                      }));
                    }}
                  />
                )}

                {/* TAB 11: BACKUP & JSON */}
                {activeTab === 'backup' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-heading font-bold text-lg text-[#F2F5F9]">
                        Backup, Export & Factory Reset
                      </h3>
                      <p className="text-xs text-[#8B97AC]">
                        Export portfolio data as formatted JSON for local backup, or restore data anytime.
                      </p>
                    </div>

                    {/* GitHub & Live Data Protection Info */}
                    <div className="p-4 rounded-2xl bg-[#0D1424] border border-[#1E2C48] flex items-start gap-3">
                      <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shrink-0 mt-0.5">
                        <ShieldCheck className="w-5 h-5" />
                      </div>
                      <div className="space-y-1 text-xs">
                        <div className="font-semibold text-[#F2F5F9] flex items-center gap-2">
                          <span>Live Database & GitHub Push Protection Active</span>
                          <span className="px-2 py-0.2 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-mono">
                            Protected
                          </span>
                        </div>
                        <p className="text-[#8B97AC] leading-relaxed">
                          All changes you make directly in this portal are stored in <strong className="text-[#F2F5F9]">Cloud Firestore</strong> and take 100% priority over repository files. When code commits or updates are pushed to GitHub, only the specific code files you modified are pushed — your live database content is completely decoupled and will never be overwritten.
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Export Card */}
                      <div className="p-5 rounded-2xl bg-[#121B2E] border border-[#1E2C48] space-y-3">
                        <div className="flex items-center gap-2 text-xs font-bold text-[#3B82F6] font-mono uppercase">
                          <Download className="w-4 h-4" />
                          <span>Export Portfolio JSON</span>
                        </div>
                        <p className="text-xs text-[#8B97AC]">
                          Download current portfolio configuration file to your computer.
                        </p>
                        <button
                          onClick={handleDownloadJSON}
                          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#2F6FED] hover:bg-[#3B82F6] text-white text-xs font-semibold shadow-md"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Download JSON Backup</span>
                        </button>
                      </div>

                      {/* Reset Card */}
                      <div className="p-5 rounded-2xl bg-[#121B2E] border border-[#1E2C48] space-y-3">
                        <div className="flex items-center gap-2 text-xs font-bold text-rose-400 font-mono uppercase">
                          <RotateCcw className="w-4 h-4" />
                          <span>Reset to Initial Defaults</span>
                        </div>
                        <p className="text-xs text-[#8B97AC]">
                          Load default configuration into draft editor (click Save Changes afterwards to publish live).
                        </p>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setDraftData(initialDefaultPortfolioData);
                            triggerNotice('Loaded default configuration into draft. Click Save Changes to publish.');
                          }}
                          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#0D1424] hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-semibold cursor-pointer transition-colors"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>Reset Draft to Defaults</span>
                        </button>
                      </div>
                    </div>

                    {/* Import JSON Area */}
                    <div className="p-5 rounded-2xl bg-[#121B2E] border border-[#1E2C48] space-y-3">
                      <div className="flex items-center gap-2 text-xs font-bold text-[#D9A94E] font-mono uppercase">
                        <Upload className="w-4 h-4" />
                        <span>Direct JSON Import</span>
                      </div>
                      <textarea
                        rows={5}
                        placeholder="Paste portfolio JSON object here..."
                        value={jsonImportText}
                        onChange={(e) => setJsonImportText(e.target.value)}
                        className="w-full p-3 rounded-xl bg-[#0D1424] border border-[#1E2C48] text-xs font-mono text-[#F2F5F9] focus:outline-none"
                      />
                      {importStatus && (
                        <p className="text-xs text-[#3B82F6]">{importStatus}</p>
                      )}
                      <button
                        onClick={handleImportSubmit}
                        disabled={!jsonImportText.trim()}
                        className="px-4 py-2 rounded-xl bg-[#1E2C48] hover:bg-[#2F6FED] text-white text-xs font-semibold disabled:opacity-40 transition-colors"
                      >
                        Load JSON into Draft
                      </button>
                    </div>
                  </div>
                )}

              </div>

              {/* Sticky Footer Bar with Save & Discard Controls */}
              <div className="px-6 py-4 border-t border-[#1E2C48] bg-[#0A0E1A] flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-xs">
                  {isDirty ? (
                    <div className="flex items-center gap-2 text-amber-300 font-semibold">
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
                      <span>You have unsaved changes in this session</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-[#8B97AC]">
                      <Check className="w-4 h-4 text-emerald-400" />
                      <span>All content is up to date with live site</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  {isDirty && (
                    <button
                      id="admin-discard-btn-footer"
                      onClick={handleDiscardChanges}
                      className="px-4 py-2 rounded-xl bg-[#121B2E] hover:bg-rose-500/20 text-[#8B97AC] hover:text-rose-300 border border-[#1E2C48] text-xs font-semibold flex items-center gap-1.5 transition-colors"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Discard Changes</span>
                    </button>
                  )}

                  <button
                    id="admin-save-btn-footer"
                    onClick={handleSaveChanges}
                    disabled={isSaving || !isDirty}
                    className={`px-6 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all shadow-lg ${
                      isDirty
                        ? 'bg-[#2F6FED] hover:bg-[#3B82F6] text-white ring-2 ring-[#3B82F6]/50 shadow-[#2F6FED]/35 scale-100 hover:scale-[1.02]'
                        : 'bg-[#121B2E] text-[#8B97AC] border border-[#1E2C48] opacity-60 cursor-not-allowed'
                    }`}
                  >
                    {isSaving ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Publishing Live...</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        <span>Save Changes & Publish Live</span>
                        {isDirty && <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-spin" />}
                      </>
                    )}
                  </button>
                </div>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
};
