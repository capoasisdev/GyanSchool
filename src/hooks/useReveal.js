import { useEffect } from 'react';

/**
 * useReveal — re-implements the IntersectionObserver scroll animation.
 * Highly robust: immediately activates visible or near-top elements to prevent blank pages on back navigation.
 */
export default function useReveal(extraDeps = []) {
    useEffect(() => {
        const timer = setTimeout(() => {
            const revealElements = document.querySelectorAll('.reveal');

            // 1. Immediately activate elements that are already visible in or near viewport
            revealElements.forEach(el => {
                const rect = el.getBoundingClientRect();
                const isNearTop = rect.top < window.innerHeight + 100;
                if (isNearTop) {
                    el.classList.add('active');
                }
            });

            // 2. Observe the rest using IntersectionObserver
            const observer = new IntersectionObserver(
                (entries, obs) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            entry.target.classList.add('active');
                            obs.unobserve(entry.target);
                        }
                    });
                },
                { threshold: 0.1, rootMargin: '0px 0px -20px 0px' }
            );

            revealElements.forEach(el => {
                if (!el.classList.contains('active')) {
                    observer.observe(el);
                }
            });

            return () => observer.disconnect();
        }, 100);

        return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, extraDeps);
}
