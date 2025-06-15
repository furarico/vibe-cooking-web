interface LoadingProps {
  text?: string;
  className?: string;
}

const Loading = ({ text = '', className = '' }: LoadingProps) => {
  return (
    <div
      className={`flex flex-col justify-center items-center gap-6 mt-10 ${className}`}
      role="status"
      aria-live="polite"
    >
      <div
        className="h-10 w-10 animate-spin border-[3px] border-slate-400 rounded-full border-t-transparent"
        aria-label="読み込み中"
      ></div>
      <p className="text-[16px] font-medium hidden md:block">{text}</p>
    </div>
  );
};

export default Loading;
export type { LoadingProps };
