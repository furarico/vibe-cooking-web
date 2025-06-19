import { cn } from '@/lib/utils';

const Footer: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <footer className={cn('w-full', className)}>
      <div className="text-center text-xs text-slate-500">
        <p>© 2025 Vibe Cooking</p>
      </div>
    </footer>
  );
};

export { Footer };
