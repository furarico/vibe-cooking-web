interface LoadingProps {
  text?: string;
  className?: string;
}

const Loading = ({ text = '読みこみちゅう...', className }: LoadingProps) => {
  return (
    <div
      className={`flex flex-col justify-center items-center gap-6 mt-10 ${className || ''}`}
    >
      <div className="h-10 w-10 animate-spin border-[3px] border-slate-400 rounded-full border-t-transparent"></div>
      <p className="text-[16px] font-medium">{text}</p>
    </div>
  );
};

export default Loading;
export type { LoadingProps };
