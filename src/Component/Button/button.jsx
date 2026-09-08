export const Button = ({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  className = '',
  ...props
}) => {
  const baseClasses = "inline-flex items-center justify-center font-medium rounded-xl transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background-primary)] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed disabled:active:scale-100";

  const variants = {
    primary: "bg-[var(--primary-color,#2563eb)] hover:bg-[var(--primary-hover,#1d4ed8)] text-white focus-visible:ring-[var(--primary-color,#2563eb)] shadow-[0_0_15px_rgba(37,99,235,0.3)]",
    secondary: "bg-[var(--surface-secondary)] hover:bg-[var(--surface-tertiary)] text-[var(--text-primary)] border border-[var(--border-subtle)] focus-visible:ring-[var(--primary-color)]",
    ghost: "bg-transparent hover:bg-[var(--surface-secondary)] text-[var(--text-primary)] focus-visible:ring-[var(--primary-color)]",
    danger: "bg-red-600 hover:bg-red-700 text-white focus-visible:ring-red-500"
  };

  const sizes = {
    sm: "text-sm px-4 py-2 gap-1.5",
    md: "text-sm px-6 py-2.5 gap-2",
    lg: "text-base px-8 py-3.5 gap-2.5"
  };

  const isDisabled = disabled || loading;

  return (
    <button
      type={type}
      onClick={isDisabled ? undefined : onClick}
      disabled={isDisabled}
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {loading && (
        <svg 
          className="animate-spin -ml-1 mr-1 h-4 w-4 text-current" 
          xmlns="http://www.w3.org/2000/svg" 
          fill="none" 
          viewBox="0 0 24 24"
        >
          <circle 
            className="opacity-25" 
            cx="12" 
            cy="12" 
            r="10" 
            stroke="currentColor" 
            strokeWidth="4"
          ></circle>
          <path 
            className="opacity-75" 
            fill="currentColor" 
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      )}
      {children}
    </button>
  );
};
