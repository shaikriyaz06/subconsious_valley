"use client";
import { useEffect } from 'react';

export default function VideoPreloader() {
  useEffect(() => {
    // Preload video in browser cache
    const video = document.createElement('video');
    video.preload = 'auto';
    video.src = 'https://cdn.subconsciousvalley.workers.dev/hero_video.mp4';
    video.load();
    
    return () => {
      video.src = '';
    };
  }, []);

  return null;
}