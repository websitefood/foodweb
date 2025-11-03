import React, { useEffect } from 'react';

/**
 * Simple AdSense component.
 * Usage: import AdSense from '../components/AdSense'; <AdSense adSlot="YYYYYYYYYYY" />
 *
 * Replace data-ad-client in index.html with your ca-pub-... and set adSlot prop to your Ad Unit ID.
 */
export default function AdSense({ adSlot, style = { display: 'block' } }) {
  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      // ignore if ads script not loaded yet
      // console.warn('adsbygoogle push failed', e);
    }
  }, []);

  return (
    <ins className="adsbygoogle"
         style={style}
         data-ad-client="ca-pub-9016100392250723"   // <-- replace with your publisher ID if you prefer to set here
         data-ad-slot={adSlot}
         data-ad-format="auto"
         data-full-width-responsive="true"></ins>
  );
}
