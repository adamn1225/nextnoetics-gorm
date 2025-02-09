// src/motionConfig.ts
export const fadeInUp = {
  initial: { opacity: 0, y: 50 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5 },
};

export const fadeInRight = {
  initial: { opacity: 0, x: 50 },
  whileInView: { opacity: 1, x: 0 },
  viewport: { once: true },
  transition: { duration: 0.5 },
};

export const fadeInLeft = {
  initial: { opacity: 0, x: -50 },
  whileInView: { opacity: 1, x: 0 },
  viewport: { once: true },
  transition: { duration: 0.5 },
};

export const staggerContainer = {
  initial: {},
  whileInView: { staggerChildren: 0.2 },
  transition: { duration: 0.5 },
};

export const textVariant = (delay: number) => ({
  initial: { opacity: 0 },
  whileInView: { opacity: 1, transition: { delay, duration: 1 } },
});

export const zoomIn = {
  initial: { scale: 0 },
  whileInView: { scale: 1, transition: { duration: 0.5 } },
};

export const slideIn = (direction: string, type: string, delay: number, duration: number) => ({
  initial: {
    x: direction === "left" ? "-100%" : direction === "right" ? "100%" : 0,
    y: direction === "up" ? "100%" : direction === "down" ? "-100%" : 0,
    opacity: 0,
  },
  whileInView: {
    x: 0,
    y: 0,
    opacity: 1,
    transition: { type, delay, duration },
  },
});

export const staggerChildren = (staggerChildren: number) => ({
  initial: {},
  whileInView: { staggerChildren },
});

export const fadeIn = (direction: string, type: string, delay: number, duration: number) => ({
  initial: {
    x: direction === "left" ? "-100%" : direction === "right" ? "100%" : 0,
    y: direction === "up" ? "100%" : direction === "down" ? "-100%" : 0,
    opacity: 0,
  },
  whileInView: {
    x: 0,
    y: 0,
    opacity: 1,
    transition: { type, delay, duration },
  },
});

export const textContainer = {
  hidden: { opacity: 1 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.5 },
  },
};

export const fadeInText = (direction: string, type: string, delay: number, duration: number) => ({
  initial: {
    x: direction === "left" ? "-100%" : direction === "right" ? "100%" : 0,
    y: direction === "up" ? "100%" : direction === "down" ? "-100%" : 0,
    opacity: 0,
  },
  whileInView: {
    x: 0,
    y: 0,
    opacity: 1,
    transition: { type, delay, duration },
  },
});

export const slideInFromTop = {
  initial: { opacity: 0, y: -50 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

export const slideInFromBottom = {
  initial: { opacity: 0, y: 50 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

export const slideInFromLeft = {
  initial: { opacity: 0, x: -50 },
  whileInView: { opacity: 1, x: 0 },
  transition: { duration: 0.5 },
};

export const slideInFromRight = {
  initial: { opacity: 0, x: 50 },
  whileInView: { opacity: 1, x: 0 },
  transition: { duration: 0.5 },
};


