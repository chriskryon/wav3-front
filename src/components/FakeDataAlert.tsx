import { AlertTriangle } from 'lucide-react';
import type { ReactNode } from 'react';

interface FakeDataAlertProps {
  title?: ReactNode;
  description?: ReactNode;
  icon?: ReactNode;
  className?: string;
}

export function FakeDataAlert({
  title = 'Demo Data',
  description = (
    <>
      This feature is not yet available. All data shown is for demonstration purposes only.<br />
      Please check back soon for real functionality.
    </>
  ),
  icon = (
    <span className="flex items-center justify-center rounded-full bg-primary/10 text-primary w-8 h-8 mr-3 shadow-sm">
      <AlertTriangle className="h-5 w-5" />
    </span>
  ),
  className = 'mb-6',
}: FakeDataAlertProps) {
  return (
    <div
      className={`flex items-center gap-4 rounded-xl border border-primary/20 bg-primary/5 px-5 py-4 shadow-sm ${className}`}
      role="alert"
    >
      {icon}
      <div className="flex flex-col gap-1">
        <span className="font-semibold text-primary text-base">{title}</span>
        <span className="text-main text-sm leading-snug">{description}</span>
      </div>
    </div>
  );
}
