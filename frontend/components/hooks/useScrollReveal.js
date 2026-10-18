"use client";

import { useEffect, useRef, useState } from "react";

export default function useScrollReveal() {
    const sectionRef = useRef(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const section = sectionRef.current;

        if (!section) return;

        const observer = new IntersectionObserver(
            ([entry]) => setVisible(entry.isIntersecting),
            { threshold: 0 }
        );

        observer.observe(section);
        return () => observer.disconnect();
    }, []);

    return { sectionRef, visible };
}
