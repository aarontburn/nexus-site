'use client';

import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";

const animationConfig = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
};

export default function Transition({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    return (
        <AnimatePresence mode="wait">
            <motion.div
                key={pathname}
                variants={animationConfig}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.25 }}
            >
                {children}
            </motion.div>
        </AnimatePresence>
    );
}