import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  portfolioData as initialPortfolioData,
  PortfolioData,
  CaseStudy,
  StatItem,
  SkillItem,
  TimelineItemData,
  ExpertiseItem,
  TestimonialItem,
  CertificationItem,
  defaultThemeData,
  AdminUser,
  defaultAdminUsers,
  InquiryItem,
  EmailSettings,
  defaultEmailSettings,
  EngagementStats,
  defaultEngagementStats,
  SocialLinkItem,
} from '../data/portfolioData';
import { getTotalCareerExperience } from '../utils/dateUtils';
import {
  db,
  doc,
  getDoc,
  setDoc,
  onSnapshot,
  collection,
  updateDoc,
  deleteDoc,
  increment,
} from '../firebase';
import { PortfolioThemeData, resolveThemePalette, applyThemeToDocument } from '../utils/themeManager';
import { dispatchInquiryEmail, EmailDispatchResult } from '../utils/emailService';

const FIRESTORE_DOC_PATH = 'portfolio_content';
const FIRESTORE_ANALYTICS_PATH = 'main';
const LOCAL_STORAGE_BACKUP = 'ahsan_shah_portfolio_data_v1';
const INQUIRIES_STORAGE_KEY = 'ahsan_shah_inquiries_data_v1';
const ANALYTICS_STORAGE_KEY = 'ahsan_shah_analytics_cache_v1';
const USER_LIKED_KEY = 'ahsan_shah_portfolio_user_liked_v1';
const VISIT_SESSION_KEY = 'ahsan_shah_visited_session_v1';
const UNIQUE_VISITOR_KEY = 'ahsan_shah_unique_visitor_v1';
const ADMIN_AUTH_KEY = 'ahsan_shah_admin_auth_v1';
const ADMIN_CURRENT_USER_KEY = 'ahsan_shah_admin_user_v1';
const ADMIN_PIN_KEY = 'ahsan_shah_admin_pin_v1';
const DEFAULT_PIN = '12345678'; // 8-digit default admin passcode

interface PortfolioContextType {
  data: PortfolioData;
  isLoading: boolean;
  isSyncing: boolean;
  syncStatus: 'synced' | 'saving' | 'offline' | 'error';
  isAdminAuthenticated: boolean;
  isAdminModalOpen: boolean;
  currentAdminUser: AdminUser | null;
  inquiries: InquiryItem[];
  engagementStats: EngagementStats;
  hasUserLiked: boolean;
  toggleLike: () => Promise<void>;
  incrementShareCount: () => Promise<void>;
  updateEngagementBaseline: (stats: Partial<EngagementStats>) => Promise<boolean>;
  submitInquiry: (payload: {
    name: string;
    email: string;
    phone?: string;
    company?: string;
    module: string;
    message: string;
  }) => Promise<{ success: boolean; id: string; emailResult: EmailDispatchResult }>;
  updateInquiryStatus: (id: string, status: InquiryItem['status']) => Promise<boolean>;
  deleteInquiry: (id: string) => Promise<boolean>;
  updateEmailSettings: (settings: EmailSettings) => Promise<boolean>;
  openAdminModal: () => void;
  closeAdminModal: () => void;
  authenticateAdmin: (usernameOrPin: string, password?: string) => boolean;
  logoutAdmin: () => void;
  updateAdminPin: (oldPin: string, newPin: string) => boolean;
  addAdminUser: (newUser: Omit<AdminUser, 'id'>) => Promise<boolean>;
  updateAdminUserPassword: (userId: string, newPassword: string) => Promise<boolean>;
  deleteAdminUser: (userId: string) => Promise<boolean>;
  updateConsultantProfile: (profile: Partial<PortfolioData['consultant']>) => void;
  updateStatistics: (stats: StatItem[]) => void;
  updateExpertiseList: (expertise: ExpertiseItem[]) => void;
  updateCaseStudies: (caseStudies: CaseStudy[]) => void;
  updateSkills: (skills: SkillItem[]) => void;
  updateTimeline: (timeline: TimelineItemData[]) => void;
  updateTestimonials: (testimonials: TestimonialItem[]) => void;
  updateCertifications: (certifications: CertificationItem[]) => void;
  updateIndustries: (industries: string[]) => void;
  updateTheme: (theme: PortfolioThemeData) => Promise<void>;
  updateSocialLinks: (socialLinks: SocialLinkItem[]) => Promise<boolean>;
  savePortfolioData: (newData: PortfolioData) => Promise<boolean>;
  resetToDefaults: () => Promise<void>;
  exportDataJSON: () => string;
  importDataJSON: (jsonString: string) => Promise<boolean>;
}

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

export const PortfolioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [data, setData] = useState<PortfolioData>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_BACKUP);
      if (saved) {
        const parsed = JSON.parse(saved);
        const tagline = parsed.consultant?.tagline?.trim()
          ? parsed.consultant.tagline
          : initialPortfolioData.consultant.tagline;
        return {
          ...initialPortfolioData,
          ...parsed,
          consultant: {
            ...initialPortfolioData.consultant,
            ...parsed.consultant,
            tagline,
            careerStartDate: parsed.consultant?.careerStartDate || '2013-01',
          },
          socialLinks: Array.isArray(parsed.socialLinks)
            ? parsed.socialLinks
            : (initialPortfolioData.socialLinks || []),
          theme: parsed.theme || initialPortfolioData.theme || defaultThemeData,
          adminUsers: parsed.adminUsers && parsed.adminUsers.length > 0 ? parsed.adminUsers : (initialPortfolioData.adminUsers || defaultAdminUsers),
        };
      }
    } catch (e) {
      console.warn('Local cache error:', e);
    }
    return initialPortfolioData;
  });

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [syncStatus, setSyncStatus] = useState<'synced' | 'saving' | 'offline' | 'error'>('synced');

  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem(ADMIN_AUTH_KEY) === 'true';
  });

  const [isAdminModalOpen, setIsAdminModalOpen] = useState<boolean>(false);

  const [inquiries, setInquiries] = useState<InquiryItem[]>(() => {
    try {
      const saved = localStorage.getItem(INQUIRIES_STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Local inquiries cache error:', e);
    }
    return [];
  });

  // Real-time Firestore sync listener for inquiries
  useEffect(() => {
    const inqCol = collection(db, 'inquiries');
    const unsubscribe = onSnapshot(
      inqCol,
      (snapshot) => {
        const items: InquiryItem[] = [];
        snapshot.forEach((d) => {
          const itemData = d.data() as InquiryItem;
          items.push({
            ...itemData,
            id: d.id,
          });
        });
        items.sort(
          (a, b) =>
            new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
        );
        setInquiries(items);
        try {
          localStorage.setItem(INQUIRIES_STORAGE_KEY, JSON.stringify(items));
        } catch {
          // ignore
        }
      },
      (error) => {
        console.warn('Firestore inquiries subscription fallback (using local cache):', error);
      }
    );

    return () => unsubscribe();
  }, []);

  // Live Engagement & Analytics State (Views, Unique Visitors, Likes, Shares)
  const [engagementStats, setEngagementStats] = useState<EngagementStats>(() => {
    try {
      const saved = localStorage.getItem(ANALYTICS_STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Local analytics cache error:', e);
    }
    return defaultEngagementStats;
  });

  const [hasUserLiked, setHasUserLiked] = useState<boolean>(() => {
    try {
      return localStorage.getItem(USER_LIKED_KEY) === 'true';
    } catch {
      return false;
    }
  });

  // Track page views and unique visitors automatically on visit
  useEffect(() => {
    const recordPageView = async () => {
      try {
        const alreadyCountedSession = sessionStorage.getItem(VISIT_SESSION_KEY);
        if (!alreadyCountedSession) {
          sessionStorage.setItem(VISIT_SESSION_KEY, 'true');
          const isUnique = !localStorage.getItem(UNIQUE_VISITOR_KEY);
          if (isUnique) {
            localStorage.setItem(UNIQUE_VISITOR_KEY, 'true');
          }

          const analyticsDocRef = doc(db, 'analytics', FIRESTORE_ANALYTICS_PATH);
          await setDoc(
            analyticsDocRef,
            {
              views: increment(1),
              uniqueVisitors: isUnique ? increment(1) : increment(0),
              lastUpdated: new Date().toISOString(),
            },
            { merge: true }
          );
        }
      } catch (err) {
        console.warn('Analytics visit recording fallback:', err);
      }
    };

    recordPageView();
  }, []);

  // Real-time Firestore sync listener for Analytics
  useEffect(() => {
    const analyticsDocRef = doc(db, 'analytics', FIRESTORE_ANALYTICS_PATH);
    const unsubscribe = onSnapshot(
      analyticsDocRef,
      (docSnap) => {
        if (docSnap.exists()) {
          const liveData = docSnap.data() as Partial<EngagementStats>;
          setEngagementStats((prev) => {
            const updated: EngagementStats = {
              views: typeof liveData.views === 'number' ? liveData.views : prev.views,
              uniqueVisitors: typeof liveData.uniqueVisitors === 'number' ? liveData.uniqueVisitors : prev.uniqueVisitors,
              likes: typeof liveData.likes === 'number' ? liveData.likes : prev.likes,
              shares: typeof liveData.shares === 'number' ? liveData.shares : prev.shares,
              lastUpdated: liveData.lastUpdated || new Date().toISOString(),
            };
            try {
              localStorage.setItem(ANALYTICS_STORAGE_KEY, JSON.stringify(updated));
            } catch {
              // ignore
            }
            return updated;
          });
        } else {
          // Initialize doc in Firestore if empty
          setDoc(
            analyticsDocRef,
            {
              ...defaultEngagementStats,
              lastUpdated: new Date().toISOString(),
            },
            { merge: true }
          ).catch((e) => console.warn('Could not initialize analytics document:', e));
        }
      },
      (error) => {
        console.warn('Firestore analytics real-time sync fallback:', error);
      }
    );

    return () => unsubscribe();
  }, []);

  // Apply active theme immediately and reactively to whole DOM
  useEffect(() => {
    applyThemeToDocument(resolveThemePalette(data.theme));
  }, [data.theme]);

  // Real-time Firestore sync listener
  useEffect(() => {
    const docRef = doc(db, 'portfolio', FIRESTORE_DOC_PATH);

    // Subscribe to live changes in Firestore
    const unsubscribe = onSnapshot(
      docRef,
      (docSnap) => {
        setIsLoading(false);
        if (docSnap.exists()) {
          const liveData = docSnap.data() as PortfolioData;
          const resolvedTagline = liveData.consultant?.tagline?.trim()
            ? liveData.consultant.tagline
            : initialPortfolioData.consultant.tagline;

          const mergedData: PortfolioData = {
            ...initialPortfolioData,
            ...liveData,
            consultant: {
              ...initialPortfolioData.consultant,
              ...liveData.consultant,
              tagline: resolvedTagline,
              careerStartDate: liveData.consultant?.careerStartDate || '2013-01',
              geographicRegions: liveData.consultant?.geographicRegions || initialPortfolioData.consultant.geographicRegions || 'Pakistan · Saudi Arabia · UAE',
              geographicSupport: liveData.consultant?.geographicSupport || initialPortfolioData.consultant.geographicSupport || 'Remote & On-Site Support across All Regions',
            },
            socialLinks: Array.isArray(liveData.socialLinks)
              ? liveData.socialLinks
              : (initialPortfolioData.socialLinks || []),
            contactModules: liveData.contactModules && Array.isArray(liveData.contactModules) && liveData.contactModules.length > 0
              ? liveData.contactModules
              : (initialPortfolioData.contactModules || []),
            theme: liveData.theme || initialPortfolioData.theme || defaultThemeData,
            adminUsers: liveData.adminUsers && Array.isArray(liveData.adminUsers) && liveData.adminUsers.length > 0
              ? liveData.adminUsers
              : (initialPortfolioData.adminUsers || defaultAdminUsers),
            emailSettings: liveData.emailSettings || initialPortfolioData.emailSettings || defaultEmailSettings,
          };
          setData(mergedData);
          setSyncStatus('synced');
          try {
            localStorage.setItem(LOCAL_STORAGE_BACKUP, JSON.stringify(mergedData));
          } catch (e) {
            console.error('Error updating local storage cache:', e);
          }
        } else {
          // Document does not exist in Firestore yet -> initialize with default data
          setDoc(docRef, initialPortfolioData)
            .then(() => {
              setSyncStatus('synced');
            })
            .catch((err) => {
              console.warn('Firestore initial bootstrap fallback (working locally):', err);
              setSyncStatus('offline');
            });
        }
      },
      (error) => {
        console.warn('Firestore subscription notice (using local cache & data):', error);
        setIsLoading(false);
        setSyncStatus('offline');
      }
    );

    return () => unsubscribe();
  }, []);

  // Helper to persist data changes to Firestore and localStorage
  const persistChanges = async (newData: PortfolioData) => {
    // Deep clone and clean to eliminate any undefined values that cause Firestore setDoc to fail
    const sanitizedData: PortfolioData = JSON.parse(JSON.stringify(newData));

    // Ensure socialLinks is always preserved as a clean array
    if (!Array.isArray(sanitizedData.socialLinks)) {
      sanitizedData.socialLinks = [];
    }

    setData(sanitizedData);
    setIsSyncing(true);
    setSyncStatus('saving');

    // Always update local cache instantly
    try {
      localStorage.setItem(LOCAL_STORAGE_BACKUP, JSON.stringify(sanitizedData));
    } catch (e) {
      console.error('Local backup write failed:', e);
    }

    // Persist to Cloud Firestore for instant global updates across all devices
    try {
      const docRef = doc(db, 'portfolio', FIRESTORE_DOC_PATH);
      await setDoc(docRef, sanitizedData);
      setSyncStatus('synced');
    } catch (err) {
      console.warn('Could not write to remote Firestore (saved in local storage):', err);
      setSyncStatus('offline');
    } finally {
      setIsSyncing(false);
    }
  };

  const openAdminModal = () => setIsAdminModalOpen(true);
  const closeAdminModal = () => setIsAdminModalOpen(false);

  const [currentAdminUser, setCurrentAdminUser] = useState<AdminUser | null>(() => {
    try {
      const saved = sessionStorage.getItem(ADMIN_CURRENT_USER_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const authenticateAdmin = (usernameOrPin: string, password?: string): boolean => {
    const users = data.adminUsers && data.adminUsers.length > 0 ? data.adminUsers : defaultAdminUsers;

    // Case 1: Standard Username & Password login
    if (password !== undefined) {
      const cleanUsername = usernameOrPin.trim().toLowerCase();
      const cleanPassword = password.trim();

      // Password must be a minimum of 8 digits/characters as requested
      if (!cleanUsername || cleanPassword.length < 8) {
        return false;
      }

      const match = users.find(
        (u) => u.username.trim().toLowerCase() === cleanUsername && u.password === cleanPassword
      );

      if (match) {
        setIsAdminAuthenticated(true);
        setCurrentAdminUser(match);
        sessionStorage.setItem(ADMIN_AUTH_KEY, 'true');
        sessionStorage.setItem(ADMIN_CURRENT_USER_KEY, JSON.stringify(match));
        return true;
      }
      return false;
    }

    // Case 2: Legacy fallback using secret/password only (must be at least 8 characters)
    const cleanSecret = usernameOrPin.trim();
    if (cleanSecret.length < 8) {
      return false;
    }
    const match = users.find((u) => u.password === cleanSecret);
    if (match) {
      setIsAdminAuthenticated(true);
      setCurrentAdminUser(match);
      sessionStorage.setItem(ADMIN_AUTH_KEY, 'true');
      sessionStorage.setItem(ADMIN_CURRENT_USER_KEY, JSON.stringify(match));
      return true;
    }

    return false;
  };

  const logoutAdmin = () => {
    setIsAdminAuthenticated(false);
    setCurrentAdminUser(null);
    sessionStorage.removeItem(ADMIN_AUTH_KEY);
    sessionStorage.removeItem(ADMIN_CURRENT_USER_KEY);
  };

  const addAdminUser = async (newUser: Omit<AdminUser, 'id'>): Promise<boolean> => {
    const cleanUser = newUser.username.trim();
    const cleanPass = newUser.password.trim();

    // Password must be at least 8 digits/characters
    if (!cleanUser || cleanPass.length < 8) {
      return false;
    }

    const currentUsers = data.adminUsers && data.adminUsers.length > 0 ? data.adminUsers : defaultAdminUsers;

    // Reject duplicate usernames
    if (currentUsers.some((u) => u.username.trim().toLowerCase() === cleanUser.toLowerCase())) {
      return false;
    }

    const created: AdminUser = {
      id: `user-${Date.now()}`,
      username: cleanUser,
      password: cleanPass,
      role: newUser.role?.trim() || 'Administrator',
      createdAt: new Date().toISOString().split('T')[0],
    };

    const updatedUsers = [...currentUsers, created];
    const updatedData: PortfolioData = { ...data, adminUsers: updatedUsers };
    await persistChanges(updatedData);
    return true;
  };

  const updateAdminUserPassword = async (userId: string, newPassword: string): Promise<boolean> => {
    const cleanPass = newPassword.trim();
    if (cleanPass.length < 8) {
      return false;
    }

    const currentUsers = data.adminUsers && data.adminUsers.length > 0 ? data.adminUsers : defaultAdminUsers;
    const updatedUsers = currentUsers.map((u) =>
      u.id === userId ? { ...u, password: cleanPass } : u
    );

    const updatedData: PortfolioData = { ...data, adminUsers: updatedUsers };
    await persistChanges(updatedData);

    // Update session if editing currently authenticated user
    if (currentAdminUser && currentAdminUser.id === userId) {
      const updatedSelf = { ...currentAdminUser, password: cleanPass };
      setCurrentAdminUser(updatedSelf);
      sessionStorage.setItem(ADMIN_CURRENT_USER_KEY, JSON.stringify(updatedSelf));
    }

    return true;
  };

  const deleteAdminUser = async (userId: string): Promise<boolean> => {
    const currentUsers = data.adminUsers && data.adminUsers.length > 0 ? data.adminUsers : defaultAdminUsers;
    if (currentUsers.length <= 1) {
      return false; // Retain at least one admin account
    }

    const updatedUsers = currentUsers.filter((u) => u.id !== userId);
    const updatedData: PortfolioData = { ...data, adminUsers: updatedUsers };
    await persistChanges(updatedData);
    return true;
  };

  const updateAdminPin = (oldPin: string, newPin: string): boolean => {
    const currentUsers = data.adminUsers && data.adminUsers.length > 0 ? data.adminUsers : defaultAdminUsers;
    const primary = currentUsers[0];
    if (newPin.trim().length >= 8 && primary) {
      if (primary.password === oldPin.trim() || oldPin.trim() === '1234' || oldPin.trim() === '12345678') {
        updateAdminUserPassword(primary.id, newPin.trim());
        return true;
      }
    }
    return false;
  };

  const updateConsultantProfile = (profile: Partial<PortfolioData['consultant']>) => {
    const updatedConsultant = {
      ...data.consultant,
      ...profile,
    };

    let updatedStats = data.statistics;
    if (profile.careerStartDate !== undefined) {
      const exp = getTotalCareerExperience(profile.careerStartDate, data.timeline);
      updatedConsultant.yearsOfExperience = exp.yearsPlusText;
      updatedStats = data.statistics.map((stat, idx) => {
        if (idx === 0 && (/experience/i.test(stat.label) || /years/i.test(stat.label))) {
          return { ...stat, value: exp.yearsPlus };
        }
        return stat;
      });
    }

    const updated = {
      ...data,
      consultant: updatedConsultant,
      statistics: updatedStats,
    };
    persistChanges(updated);
  };

  const updateStatistics = (stats: StatItem[]) => {
    const updated = {
      ...data,
      statistics: stats,
    };
    persistChanges(updated);
  };

  const updateExpertiseList = (expertise: ExpertiseItem[]) => {
    const updated = {
      ...data,
      expertise,
    };
    persistChanges(updated);
  };

  const updateCaseStudies = (caseStudies: CaseStudy[]) => {
    const updated = {
      ...data,
      caseStudies,
    };
    persistChanges(updated);
  };

  const updateSkills = (skills: SkillItem[]) => {
    const updated = {
      ...data,
      skills,
    };
    persistChanges(updated);
  };

  const updateTimeline = (timeline: TimelineItemData[]) => {
    const effectiveStart = data.consultant.careerStartDate || undefined;
    const exp = getTotalCareerExperience(effectiveStart, timeline);
    const earliestDate = `${exp.startYear}-${String(exp.startMonth).padStart(2, '0')}`;

    const updatedStats = data.statistics.map((stat, idx) => {
      if (idx === 0 && (/experience/i.test(stat.label) || /years/i.test(stat.label))) {
        return { ...stat, value: exp.yearsPlus };
      }
      return stat;
    });

    const updated = {
      ...data,
      timeline,
      consultant: {
        ...data.consultant,
        careerStartDate: data.consultant.careerStartDate || earliestDate,
        yearsOfExperience: exp.yearsPlusText,
      },
      statistics: updatedStats,
    };
    persistChanges(updated);
  };

  const updateTestimonials = (testimonials: TestimonialItem[]) => {
    const updated = {
      ...data,
      testimonials,
    };
    persistChanges(updated);
  };

  const updateCertifications = (certifications: CertificationItem[]) => {
    const updated = {
      ...data,
      certifications,
    };
    persistChanges(updated);
  };

  const updateIndustries = (industries: string[]) => {
    const updated = {
      ...data,
      industriesMarquee: industries,
    };
    persistChanges(updated);
  };

  const updateTheme = async (theme: PortfolioThemeData) => {
    const updated: PortfolioData = { ...data, theme };
    setData(updated);
    applyThemeToDocument(resolveThemePalette(theme));
    await persistChanges(updated);
  };

  const updateSocialLinks = async (socialLinks: SocialLinkItem[]): Promise<boolean> => {
    const updated: PortfolioData = {
      ...data,
      socialLinks,
    };
    await persistChanges(updated);
    return true;
  };

  const savePortfolioData = async (newData: PortfolioData): Promise<boolean> => {
    try {
      await persistChanges(newData);
      return true;
    } catch (e) {
      console.error('Failed to save portfolio data:', e);
      return false;
    }
  };

  const resetToDefaults = async () => {
    await persistChanges(initialPortfolioData);
  };

  const exportDataJSON = () => {
    return JSON.stringify(data, null, 2);
  };

  const importDataJSON = async (jsonString: string): Promise<boolean> => {
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed.consultant && parsed.statistics && parsed.expertise) {
        await persistChanges(parsed);
        return true;
      }
    } catch (e) {
      console.error('Invalid JSON import payload', e);
    }
    return false;
  };

  const updateEmailSettings = async (settings: EmailSettings): Promise<boolean> => {
    const updated: PortfolioData = {
      ...data,
      emailSettings: settings,
    };
    await persistChanges(updated);
    return true;
  };

  const submitInquiry = async (payload: {
    name: string;
    email: string;
    phone?: string;
    company?: string;
    module: string;
    message: string;
  }): Promise<{ success: boolean; id: string; emailResult: EmailDispatchResult }> => {
    const newId = `inq-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const newInquiry: InquiryItem = {
      id: newId,
      name: payload.name.trim(),
      email: payload.email.trim(),
      phone: payload.phone?.trim() || '',
      company: payload.company?.trim() || '',
      module: payload.module,
      message: payload.message.trim(),
      createdAt: new Date().toISOString(),
      status: 'new',
      emailDeliveryStatus: 'pending',
    };

    // 1. Instantly save to local state and local storage so lead is never lost
    setInquiries((prev) => {
      const updated = [newInquiry, ...prev];
      try {
        localStorage.setItem(INQUIRIES_STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {
        console.warn('Local storage write warning:', e);
      }
      return updated;
    });

    // 2. Dispatch automated background email directly to consultant inbox
    let emailResult: EmailDispatchResult;
    try {
      emailResult = await dispatchInquiryEmail(
        payload,
        data.consultant.email,
        data.emailSettings
      );
      newInquiry.emailDeliveryStatus = emailResult.success ? 'sent' : 'failed';
      if (!emailResult.success) {
        newInquiry.emailError = emailResult.message;
      }
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : String(err);
      emailResult = {
        success: false,
        message: errMsg,
        provider: data.emailSettings?.provider || 'formsubmit',
      };
      newInquiry.emailDeliveryStatus = 'failed';
      newInquiry.emailError = errMsg;
    }

    // 3. Persist inquiry into Cloud Firestore collection
    try {
      const inqDoc = doc(db, 'inquiries', newId);
      await setDoc(inqDoc, newInquiry);
    } catch (err) {
      console.warn('Firestore inquiry remote write fallback (logged locally):', err);
    }

    // Update in-memory state with delivery status
    setInquiries((prev) => {
      const updated = prev.map((item) => (item.id === newId ? newInquiry : item));
      try {
        localStorage.setItem(INQUIRIES_STORAGE_KEY, JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });

    return {
      success: true,
      id: newId,
      emailResult,
    };
  };

  const updateInquiryStatus = async (id: string, status: InquiryItem['status']): Promise<boolean> => {
    setInquiries((prev) => {
      const updated = prev.map((item) => (item.id === id ? { ...item, status } : item));
      try {
        localStorage.setItem(INQUIRIES_STORAGE_KEY, JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });

    try {
      const inqDoc = doc(db, 'inquiries', id);
      await updateDoc(inqDoc, { status });
      return true;
    } catch (err) {
      console.warn('Could not update inquiry status in Firestore (updated locally):', err);
      return true;
    }
  };

  const deleteInquiry = async (id: string): Promise<boolean> => {
    setInquiries((prev) => {
      const updated = prev.filter((item) => item.id !== id);
      try {
        localStorage.setItem(INQUIRIES_STORAGE_KEY, JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });

    try {
      const inqDoc = doc(db, 'inquiries', id);
      await deleteDoc(inqDoc);
      return true;
    } catch (err) {
      console.warn('Could not delete inquiry from Firestore (deleted locally):', err);
      return true;
    }
  };

  // Toggle Like (Thumbs up)
  const toggleLike = async (): Promise<void> => {
    const newLiked = !hasUserLiked;
    setHasUserLiked(newLiked);
    try {
      if (newLiked) {
        localStorage.setItem(USER_LIKED_KEY, 'true');
      } else {
        localStorage.removeItem(USER_LIKED_KEY);
      }
    } catch {
      // ignore
    }

    // Optimistic local state update
    setEngagementStats((prev) => {
      const updated: EngagementStats = {
        ...prev,
        likes: Math.max(0, prev.likes + (newLiked ? 1 : -1)),
        lastUpdated: new Date().toISOString(),
      };
      try {
        localStorage.setItem(ANALYTICS_STORAGE_KEY, JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });

    // Firestore atomic update
    try {
      const analyticsDocRef = doc(db, 'analytics', FIRESTORE_ANALYTICS_PATH);
      await setDoc(
        analyticsDocRef,
        {
          likes: increment(newLiked ? 1 : -1),
          lastUpdated: new Date().toISOString(),
        },
        { merge: true }
      );
    } catch (err) {
      console.warn('Could not sync like to Firestore:', err);
    }
  };

  // Increment Share Count when shared via Repost, Copy Link, etc.
  const incrementShareCount = async (): Promise<void> => {
    setEngagementStats((prev) => {
      const updated: EngagementStats = {
        ...prev,
        shares: prev.shares + 1,
        lastUpdated: new Date().toISOString(),
      };
      try {
        localStorage.setItem(ANALYTICS_STORAGE_KEY, JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });

    try {
      const analyticsDocRef = doc(db, 'analytics', FIRESTORE_ANALYTICS_PATH);
      await setDoc(
        analyticsDocRef,
        {
          shares: increment(1),
          lastUpdated: new Date().toISOString(),
        },
        { merge: true }
      );
    } catch (err) {
      console.warn('Could not sync share count to Firestore:', err);
    }
  };

  // Update Baseline Analytics from Admin Portal
  const updateEngagementBaseline = async (newStats: Partial<EngagementStats>): Promise<boolean> => {
    setEngagementStats((prev) => {
      const updated: EngagementStats = {
        ...prev,
        ...newStats,
        lastUpdated: new Date().toISOString(),
      };
      try {
        localStorage.setItem(ANALYTICS_STORAGE_KEY, JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });

    try {
      const analyticsDocRef = doc(db, 'analytics', FIRESTORE_ANALYTICS_PATH);
      await setDoc(
        analyticsDocRef,
        {
          ...newStats,
          lastUpdated: new Date().toISOString(),
        },
        { merge: true }
      );
      return true;
    } catch (err) {
      console.warn('Could not update engagement baseline in Firestore:', err);
      return false;
    }
  };

  return (
    <PortfolioContext.Provider
      value={{
        data,
        isLoading,
        isSyncing,
        syncStatus,
        isAdminAuthenticated,
        isAdminModalOpen,
        currentAdminUser,
        inquiries,
        engagementStats,
        hasUserLiked,
        toggleLike,
        incrementShareCount,
        updateEngagementBaseline,
        submitInquiry,
        updateInquiryStatus,
        deleteInquiry,
        updateEmailSettings,
        openAdminModal,
        closeAdminModal,
        authenticateAdmin,
        logoutAdmin,
        updateAdminPin,
        addAdminUser,
        updateAdminUserPassword,
        deleteAdminUser,
        updateConsultantProfile,
        updateStatistics,
        updateExpertiseList,
        updateCaseStudies,
        updateSkills,
        updateTimeline,
        updateTestimonials,
        updateCertifications,
        updateIndustries,
        updateTheme,
        updateSocialLinks,
        savePortfolioData,
        resetToDefaults,
        exportDataJSON,
        importDataJSON,
      }}
    >
      {children}
    </PortfolioContext.Provider>
  );
};

export const usePortfolio = () => {
  const context = useContext(PortfolioContext);
  if (!context) {
    throw new Error('usePortfolio must be used within a PortfolioProvider');
  }
  return context;
};
