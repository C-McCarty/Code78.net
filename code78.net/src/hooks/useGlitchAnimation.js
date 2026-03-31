import { useEffect } from 'react';

export default function useGlitchAnimation() {
    useEffect(() => {
        const elements = Array.from(document.querySelectorAll('.glitch'));
        const timeouts = [];

        elements.forEach(el => {
            const animateGlitch = () => {
                el.className = 'glitch';
                const CHANCE = Math.random();
                const ANIM_CODE = CHANCE < 0.2 ? 1 : CHANCE < 0.5 ? 3 : 2;
                setTimeout(() => el.classList.add(`glitch${ANIM_CODE}`), Math.random() * 100);

                // Schedule next glitch
                const delay = Math.random() * 5000 + 5000;
                const t = setTimeout(animateGlitch, delay);
                timeouts.push(t);
            };

            animateGlitch();
        });

        return () => timeouts.forEach(clearTimeout);
    }, []);
}