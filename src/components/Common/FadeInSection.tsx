
import { Box } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';

interface FadeInSectionProps {
    children: React.ReactNode;
    delay?: number; // Delay in seconds (e.g., 0.1, 0.2)
    direction?: 'up' | 'down' | 'left' | 'right' | 'none'; // Direction of slide
}

const FadeInSection: React.FC<FadeInSectionProps> = ({
    children,
    delay = 0,
    direction = 'up'
}) => {
    const [isVisible, setVisible] = useState(false);
    const domRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setVisible(true);
                    // Once visible, we can stop observing if we only want it to animate once
                    if (domRef.current) observer.unobserve(domRef.current);
                }
            });
        }, {
            threshold: 0.1, // Trigger when 10% of the element is visible
            rootMargin: '0px 0px -50px 0px' // Offset to trigger slightly before/after
        });

        if (domRef.current) {
            observer.observe(domRef.current);
        }

        return () => {
            if (domRef.current) {
                observer.unobserve(domRef.current);
            }
        };
    }, []);

    const getTransform = () => {
        switch (direction) {
            case 'up': return 'translateY(20px)';
            case 'down': return 'translateY(-20px)';
            case 'left': return 'translateX(20px)';
            case 'right': return 'translateX(-20px)';
            default: return 'none';
        }
    };

    return (
        <Box
            ref={domRef}
            sx={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'none' : getTransform(),
                transition: `opacity 0.8s ease-out ${delay}s, transform 0.8s ease-out ${delay}s`,
                willChange: 'opacity, transform',
            }}
        >
            {children}
        </Box>
    );
};

export default FadeInSection;
