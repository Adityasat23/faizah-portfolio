import React from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

interface ButtonProps extends HTMLMotionProps<"button"> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", children, ...props }, ref) => {
    const baseStyles = "inline-flex items-center justify-center rounded-full font-bold uppercase tracking-wider text-xs transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2";
    
    const variants = {
      primary: "bg-[var(--foreground)] text-[var(--background)] hover:bg-opacity-90",
      secondary: "bg-[var(--color-secondary)] text-[var(--foreground)] hover:bg-opacity-90",
      outline: "border border-[var(--foreground)] text-[var(--foreground)] hover:bg-[var(--foreground)] hover:text-[var(--background)]",
      ghost: "text-[var(--foreground)] hover:bg-[var(--foreground)] hover:bg-opacity-10",
    };

    const sizes = {
      sm: "px-4 py-2",
      md: "px-6 py-3",
      lg: "px-8 py-4 text-sm",
    };

    return (
      <motion.button
        ref={ref}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {children}
      </motion.button>
    );
  }
);

Button.displayName = "Button";
