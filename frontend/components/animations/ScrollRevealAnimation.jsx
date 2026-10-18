"use client";

import { useEffect, useRef, useState } from "react";

export default function ScrollRevealAnimation({
    as: Element = "div",
    children,
    className = "",
    threshold = 0,
    ...elementProps
}) {
    const elementRef = useRef(null);
    const [visible, setVisible] = useState(null);

    useEffect(() => {
        const element = elementRef.current;
        if (!element) return undefined;

        const observer = new IntersectionObserver(
            ([entry]) => setVisible(entry.isIntersecting),
            { threshold }
        );

        observer.observe(element);
        return () => observer.disconnect();
    }, [threshold]);

    return (
        <Element
            ref={elementRef}
            className={`scroll-reveal-root ${className}`.trim()}
            data-scroll-visible={visible}
            {...elementProps}
        >
            {children}
        </Element>
    );
}
