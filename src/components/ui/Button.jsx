import { forwardRef } from "react";

const Button = forwardRef(
  (
    {
      className = "",
      variant = "default",
      size = "md",
      disabled = false,
      children,
      ...props
    },
    ref,
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

    const variants = {
      default: "bg-slate-100 text-slate-900 hover:bg-slate-200",
      secondary: "bg-slate-700 text-slate-100 hover:bg-slate-600",
      outline:
        "border border-slate-300 bg-transparent hover:bg-slate-50 text-slate-900",
      ghost: "hover:bg-slate-100 text-slate-900",
    };

    const sizes = {
      sm: "px-3 py-1.5 text-xs",
      md: "px-4 py-2 text-sm",
      lg: "px-6 py-3 text-base",
    };

    return (
      <button
        ref={ref}
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
        disabled={disabled}
        {...props}
      >
        {children}
      </button>
    );
  },
);

Button.displayName = "Button";

export default Button;
