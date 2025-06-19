interface LoadingProps {
  text?: string;
  className?: string;
}

const Loading = ({ text = '', className = '' }: LoadingProps) => {
  return (
    <div
      className={`flex flex-col justify-center items-center gap-6 my-10 ${className}`}
      role="status"
      aria-live="polite"
    >
      <div
        className="h-10 w-10 animate-spin border-4 rounded-full border-t-transparent"
        aria-label="Loading"
      ></div>
      <p className="text-sm font-medium hidden md:block text-slate-500">
        {text}
      </p>
    </div>
  );
};

export { Loading };
export type { LoadingProps };
