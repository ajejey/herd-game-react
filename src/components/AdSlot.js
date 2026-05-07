import React, { useEffect, useRef } from 'react';

const AD_CLIENT = 'ca-pub-3613850686549619';

const AdSlot = ({ slot, format = 'auto', layout, responsive = true, className = '', style }) => {
  const insRef = useRef(null);
  const pushedRef = useRef(false);

  useEffect(() => {
    if (pushedRef.current) return;
    if (!slot) return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      pushedRef.current = true;
    } catch (e) {
      // AdSense not loaded yet or blocked — fail silently
    }
  }, [slot]);

  if (!slot) return null;

  return (
    <div className={`w-full flex justify-center my-4 ${className}`}>
      <ins
        ref={insRef}
        className="adsbygoogle"
        style={style || { display: 'block', width: '100%', minHeight: 100 }}
        data-ad-client={AD_CLIENT}
        data-ad-slot={slot}
        data-ad-format={format}
        {...(layout ? { 'data-ad-layout': layout } : {})}
        data-full-width-responsive={responsive ? 'true' : 'false'}
      />
    </div>
  );
};

export default AdSlot;
