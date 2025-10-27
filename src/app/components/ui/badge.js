import { cn } from "../../lib/utils";

const Badge = ({ className, variant = "default", children, ...props }) => {
  const variants = {
    default: "bg-gray-900 text-gray-50 hover:bg-gray-900/80",
    outline: "border border-gray-200 text-gray-900",
  };

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export { Badge };