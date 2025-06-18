import { ListIcon } from 'lucide-react';

interface NoContentProps {
  text?: string;
  className?: string;
}

const NoContent = ({ text = '', className = '' }: NoContentProps) => {
  return (
    <div
      className={`flex flex-col justify-center items-center gap-6 my-10 text-slate-500 ${className}`}
      role="status"
      aria-live="polite"
    >
      <ListIcon className="w-10 h-10 mx-auto" />
      <p className="text-sm font-medium hidden md:block">{text}</p>
    </div>
  );
};

export { NoContent };
export type { NoContentProps };
