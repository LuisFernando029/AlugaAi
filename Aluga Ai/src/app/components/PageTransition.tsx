// components/PageTransition.tsx
"use client";
import { motion } from "framer-motion";

const variants = {
  initial: (direction: "left" | "right") => ({
    x: direction === "left" ? 1000 : -1000,
    opacity: 0,
  }),
  animate: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.6, ease: "easeInOut" },
  },
  exit: (direction: "left" | "right") => ({
    x: direction === "left" ? -1000 : 1000,
    opacity: 0,
    transition: { duration: 0.6, ease: "easeInOut" },
  }),
};

export default function PageTransition({
  children,
  direction = "left",
}: {
  children: React.ReactNode;
  direction?: "left" | "right";
}) {
  return (
    <motion.div
      custom={direction}
      initial="initial"
      animate="animate"
      exit="exit"
      variants={variants}
    >
      {children}
    </motion.div>
  );
}
