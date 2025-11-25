"use client";
import { useEffect } from 'react';

export default function GlobalStyleFix() {
  useEffect(() => {
    const applyGlobalFix = () => {
      // Target all form elements and apply inline styles
      const elements = document.querySelectorAll('input, button, label, select, textarea, h1, h2, h3, h4, h5, h6, p, span, div');
      
      elements.forEach(element => {
        // Only apply if element doesn't already have inline opacity/color
        if (!element.style.opacity) {
          element.style.opacity = '1';
        }
        if (!element.style.color && !element.classList.contains('text-white')) {
          element.style.color = 'inherit';
        }
      });
    };

    // Apply fix on mount
    applyGlobalFix();

    // Apply fix when DOM changes (for dynamic content)
    const observer = new MutationObserver(applyGlobalFix);
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    return () => observer.disconnect();
  }, []);

  return null; // This component doesn't render anything
}