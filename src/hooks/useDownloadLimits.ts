import { useState, useEffect } from 'react';
import { useFeatureAccess } from '@/hooks/useFeatureAccess';

interface DownloadData {
  count: number;
  lastReset: string;
}

export const useDownloadLimits = () => {
  const { isPro } = useFeatureAccess();
  const [downloadCount, setDownloadCount] = useState(0);
  const MAX_DOWNLOADS = isPro ? Infinity : 3; // Pro: unlimited, Free: 3 per day

  useEffect(() => {
    loadDownloadData();
  }, []);

  const loadDownloadData = () => {
    try {
      const saved = localStorage.getItem('downloadLimits');
      if (saved) {
        const data: DownloadData = JSON.parse(saved);
        const lastReset = new Date(data.lastReset);
        const today = new Date();
        
        // Reset count if it's a new day
        if (lastReset.toDateString() !== today.toDateString()) {
          setDownloadCount(0);
          saveDownloadData(0);
        } else {
          setDownloadCount(data.count);
        }
      }
    } catch (error) {
      console.error('Error loading download data:', error);
    }
  };

  const saveDownloadData = (count: number) => {
    const data: DownloadData = {
      count,
      lastReset: new Date().toISOString()
    };
    localStorage.setItem('downloadLimits', JSON.stringify(data));
  };

  const canDownload = () => {
    return isPro || downloadCount < MAX_DOWNLOADS;
  };

  const getRemainingDownloads = () => {
    return isPro ? Infinity : Math.max(0, MAX_DOWNLOADS - downloadCount);
  };

  const incrementDownload = () => {
    if (!canDownload()) return false;
    
    const newCount = downloadCount + 1;
    setDownloadCount(newCount);
    saveDownloadData(newCount);
    return true;
  };

  return {
    downloadCount,
    canDownload,
    getRemainingDownloads,
    incrementDownload,
    MAX_DOWNLOADS: isPro ? Infinity : MAX_DOWNLOADS
  };
};