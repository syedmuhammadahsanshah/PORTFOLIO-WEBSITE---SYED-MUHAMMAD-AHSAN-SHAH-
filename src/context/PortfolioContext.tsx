import React, { createContext, useContext, useState, useEffect } from 'react';
import { portfolioData as initialPortfolioData, PortfolioData, CaseStudy, StatItem, SkillItem, TimelineItemData, ExpertiseItem, TestimonialItem } from '../data/portfolioData';
import { db, doc, getDoc, setDoc, onSnapshot } from '../firebase';

const FIRESTORE_DOC_PATH = 'portfolio_content';
const LOCAL_STORAGE_BACKUP = 'ahsan_shah_portfolio_data_v1';
const ADMIN_AUTH_KEY = 'ahsan_shah_admin_auth_v1';
const ADMIN_PIN_KEY = 'ahsan_shah_admin_pin_v1';
const DEFAULT_PIN = '1234'; // Initial admin passcode

interface PortfolioContextType {
  data: PortfolioData;
  isLoading: boolean;
  isSyncing: boolean;
  syncStatus: 'synced' | 'saving' | 'offline' | 'error';
  isAdminAuthenticated: boolean;
  isAdminModalOpen: boolean;
  openAdminModal: () => void;
  closeAdminModal: () => void;
  authenticateAdmin: (pin: string) => boolean;
  logoutAdmin: () => void;
  updateAdminPin: (oldPin: string, newPin: string) => boolean;
  updateConsultantProfile: (profile: Partial<PortfolioData['consultant']>) => void;
  updateStatistics: (stats: StatItem[]) => void;
  updateExpertiseList: (expertise: ExpertiseItem[]) => void;
  updateCaseStudies: (caseStudies: CaseStudy[]) => void;
  updateSkills: (skills: SkillItem[]) => void;
  updateTimeline: (timeline: TimelineItemData[]) => void;
  updateTestimonials: (testimonials: TestimonialItem[]) => void;
  updateIndustries: (industries: string[]) => void;
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
        return JSON.parse(saved);
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
          setData(liveData);
          setSyncStatus('synced');
          try {
            localStorage.setItem(LOCAL_STORAGE_BACKUP, JSON.stringify(liveData));
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
    setData(newData);
    setIsSyncing(true);
    setSyncStatus('saving');

    // Always update local cache instantly
    try {
      localStorage.setItem(LOCAL_STORAGE_BACKUP, JSON.stringify(newData));
    } catch (e) {
      console.error('Local backup write failed:', e);
    }

    // Persist to Cloud Firestore for instant global updates across all devices
    try {
      const docRef = doc(db, 'portfolio', FIRESTORE_DOC_PATH);
      await setDoc(docRef, newData);
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

  const authenticateAdmin = (pin: string): boolean => {
    const currentPin = localStorage.getItem(ADMIN_PIN_KEY) || DEFAULT_PIN;
    if (pin.trim() === currentPin.trim()) {
      setIsAdminAuthenticated(true);
      sessionStorage.setItem(ADMIN_AUTH_KEY, 'true');
      return true;
    }
    return false;
  };

  const logoutAdmin = () => {
    setIsAdminAuthenticated(false);
    sessionStorage.removeItem(ADMIN_AUTH_KEY);
  };

  const updateAdminPin = (oldPin: string, newPin: string): boolean => {
    const currentPin = localStorage.getItem(ADMIN_PIN_KEY) || DEFAULT_PIN;
    if (oldPin.trim() === currentPin.trim() && newPin.trim().length >= 4) {
      localStorage.setItem(ADMIN_PIN_KEY, newPin.trim());
      return true;
    }
    return false;
  };

  const updateConsultantProfile = (profile: Partial<PortfolioData['consultant']>) => {
    const updated = {
      ...data,
      consultant: {
        ...data.consultant,
        ...profile,
      },
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
    const updated = {
      ...data,
      timeline,
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

  const updateIndustries = (industries: string[]) => {
    const updated = {
      ...data,
      industriesMarquee: industries,
    };
    persistChanges(updated);
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

  return (
    <PortfolioContext.Provider
      value={{
        data,
        isLoading,
        isSyncing,
        syncStatus,
        isAdminAuthenticated,
        isAdminModalOpen,
        openAdminModal,
        closeAdminModal,
        authenticateAdmin,
        logoutAdmin,
        updateAdminPin,
        updateConsultantProfile,
        updateStatistics,
        updateExpertiseList,
        updateCaseStudies,
        updateSkills,
        updateTimeline,
        updateTestimonials,
        updateIndustries,
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
