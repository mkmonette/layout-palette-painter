import { useState, useEffect } from 'react';
import { getCurrentUser } from '@/utils/auth';

interface ProfileData {
  name: string;
  email: string;
  avatar: string;
}

interface ProfileStats {
  totalPalettes: number;
  basicExports: number;
  proExports: number;
}

const DEFAULT_PROFILE: ProfileData = {
  name: 'John Doe',
  email: 'john.doe@example.com',
  avatar: ''
};

const DEFAULT_STATS: ProfileStats = {
  totalPalettes: 0,
  basicExports: 0,
  proExports: 0
};

export const useProfile = () => {
  const [profileData, setProfileData] = useState<ProfileData>(DEFAULT_PROFILE);
  const [profileStats, setProfileStats] = useState<ProfileStats>(DEFAULT_STATS);

  useEffect(() => {
    loadProfileData();
    loadProfileStats();
  }, []);

  const loadProfileData = () => {
    try {
      // Get current user from auth
      const currentUser = getCurrentUser();
      if (currentUser) {
        setProfileData(prev => ({
          ...prev,
          name: currentUser.username,
        }));
      }

      // Load additional profile data from localStorage
      const saved = localStorage.getItem('user_profile');
      if (saved) {
        const parsed = JSON.parse(saved);
        setProfileData(prev => ({
          ...prev,
          ...parsed
        }));
      }
    } catch (error) {
      console.error('Error loading profile data:', error);
    }
  };

  const loadProfileStats = () => {
    try {
      // Load saved palettes count
      const savedPalettes = localStorage.getItem('savedPalettes');
      const palettesCount = savedPalettes ? JSON.parse(savedPalettes).length : 0;

      // Load export stats
      const exportStats = localStorage.getItem('user_export_stats');
      const stats = exportStats ? JSON.parse(exportStats) : DEFAULT_STATS;

      setProfileStats({
        totalPalettes: palettesCount,
        basicExports: stats.basicExports || 0,
        proExports: stats.proExports || 0
      });
    } catch (error) {
      console.error('Error loading profile stats:', error);
    }
  };

  const updateProfile = (updates: Partial<ProfileData>) => {
    const newProfile = { ...profileData, ...updates };
    setProfileData(newProfile);
    localStorage.setItem('user_profile', JSON.stringify(newProfile));
  };

  const incrementExportStat = (type: 'basic' | 'pro') => {
    const newStats = {
      ...profileStats,
      [type === 'basic' ? 'basicExports' : 'proExports']: 
        profileStats[type === 'basic' ? 'basicExports' : 'proExports'] + 1
    };
    setProfileStats(newStats);
    localStorage.setItem('user_export_stats', JSON.stringify(newStats));
  };

  return {
    profileData,
    profileStats,
    updateProfile,
    incrementExportStat,
    loadProfileData,
    loadProfileStats
  };
};