import { forwardRef } from "react";

const Card = forwardRef(({ className = "", children, ...props }, ref) => (
  <div
    ref={ref}
    className={`rounded-lg border border-slate-700 bg-slate-950 ${className}`}
    {...props}
  >
    {children}
  </div>
));

Card.displayName = "Card";

const CardHeader = forwardRef(({ className = "", children, ...props }, ref) => (
  <div
    ref={ref}
    className={`flex flex-col space-y-1.5 p-6 ${className}`}
    {...props}
  >
    {children}
  </div>
));

CardHeader.displayName = "CardHeader";

const CardTitle = forwardRef(({ className = "", children, ...props }, ref) => (
  <h2
    ref={ref}
    className={`text-lg font-semibold leading-none tracking-tight text-white ${className}`}
    {...props}
  >
    {children}
  </h2>
));

CardTitle.displayName = "CardTitle";

const CardContent = forwardRef(
  ({ className = "", children, ...props }, ref) => (
    <div ref={ref} className={`p-6 pt-0 ${className}`} {...props}>
      {children}
    </div>
  ),
);

CardContent.displayName = "CardContent";

export { Card, CardHeader, CardTitle, CardContent };
