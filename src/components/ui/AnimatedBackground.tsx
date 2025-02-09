"use client";

import { useAnimationFrame } from "motion/react";
import { useRef, useState } from "react";
import Image from "next/image";

const AnimatedBackground = () => {
    const cubeRef = useRef<HTMLDivElement>(null);
    const objectRef = useRef<HTMLDivElement>(null);
    const [isAlive, setIsAlive] = useState(false);

    useAnimationFrame((t) => {
        if (!cubeRef.current) return;

        const rotateX = Math.sin(t / 6000) * 360; // Smooth 3D rotation
        const rotateY = Math.cos(t / 6000) * 360;
        const x = Math.sin(t / 3000) * 400; // Larger X-axis range
        const y = Math.cos(t / 3000) * 300; // Larger Y-axis range

        cubeRef.current.style.transform = `translate(${x}px, ${y}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;

        // Keep the inner object centered while rotating
        if (objectRef.current) {
            objectRef.current.style.transform = `rotateX(${-rotateX}deg) rotateY(${-rotateY}deg)`;
        }
    });

    return (
        <div className="absolute inset-0 overflow-hidden flex justify-center items-center pointer-events-none">
            <div className="cube" ref={cubeRef}>
                <div className="side front" />
                <div className="side back" />
                <div className="side left" />
                <div className="side right" />
                <div className="side top" />
                <div className="side bottom" />

                {/* Object Inside the Cube - Mouse Enter/Leave to Activate */}
                <div
                    className="inner-object"
                    ref={objectRef}
                    onMouseEnter={() => setIsAlive(true)}
                    onMouseLeave={() => setIsAlive(false)}
                >
                    {/* <img
                        src="/rose-life.gif"
                        alt="Rose Life"
                        width="300"
                        height="300"
                        className={`rose ${isAlive ? "alive" : ""}`}
                    /> */}

                </div>
            </div>
            <StyleSheet />
        </div>
    );
};

/**
 * ==============   Styles   ================
 */
function StyleSheet() {
    return (
        <style suppressHydrationWarning>{`
        .absolute {
            perspective: 2000px;
            z-index: 0; /* Keep cube behind text */
        }

        .cube {
            width: 200px;
            height: 200px;
            position: relative;
            transform-style: preserve-3d;
        }

        .side {
            position: absolute;
            width: 200px;
            height: 200px;
            background: rgba(243, 244, 246, 0.4); /* Tailwind gray-200 with opacity */
            border: 1px solid rgba(0, 0, 0, 0.1);
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1), inset 0 0 20px rgba(0, 0, 0, 0.05);
        }

        /* Define the positions for each face */
        .front { transform: rotateY(0deg) translateZ(100px); }
        .back { transform: rotateY(180deg) translateZ(100px); }
        .left { transform: rotateY(-90deg) translateZ(100px); }
        .right { transform: rotateY(90deg) translateZ(100px); }
        .top { transform: rotateX(90deg) translateZ(100px); }
        .bottom { transform: rotateX(-90deg) translateZ(100px); }

        /* Add subtle gradients for depth */
        .front { background: linear-gradient(145deg, rgba(59, 130, 246, 0.1), rgba(226, 232, 240, 0.2)); }
        .back { background: linear-gradient(145deg, rgba(59, 130, 246, 0.1), rgba(203, 213, 225, 0.2)); }
        .left { background: linear-gradient(145deg, rgba(17, 24, 39, 0.2), rgba(148, 163, 184, 0.2)); }
        .right { background: linear-gradient(145deg, rgba(17, 24, 39, 0.2), rgba(226, 232, 240, 0.2)); }
        .top { background: linear-gradient(145deg, rgba(255, 255, 255, 0.2), rgba(248, 250, 252, 0.2)); }
        .bottom { background: linear-gradient(145deg, rgba(203, 213, 225, 0.2), rgba(148, 163, 184, 0.2)); }

        /* Inner object (the rose inside the cube) */
        .inner-object {
            position: absolute;
            width: 200px;
            height: 200px;
            display: flex;
            justify-content: center;
            align-items: center;
            transform-style: preserve-3d;
        }

        `}</style>
    );
}

export default AnimatedBackground;