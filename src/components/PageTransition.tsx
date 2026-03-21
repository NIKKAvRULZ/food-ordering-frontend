import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useLocation } from 'react-router-dom';

const PageTransition: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const location = useLocation();

    useEffect(() => {
        if (containerRef.current) {
            // Kill existing animations on this container to prevent conflicts
            gsap.killTweensOf(containerRef.current);
            
            // Fade and slide up entrance
            gsap.fromTo(containerRef.current, 
                { opacity: 0, y: 30 },
                { 
                    opacity: 1, 
                    y: 0, 
                    duration: 0.8, 
                    ease: 'power3.out',
                    clearProps: 'all' // Clean up styles after animation
                }
            );
        }
    }, [location.pathname]); // Re-run whenever the route changes

    return (
        <div ref={containerRef} className="page-transition-wrapper" style={{ width: '100%', minHeight: '100vh' }}>
            {children}
        </div>
    );
};

export default PageTransition;
