import * as React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import clsx from 'clsx';

// Custom Select with glassmorphism and wav3 hover
type ProfileSelectProps = React.PropsWithChildren<React.ComponentPropsWithoutRef<typeof Select>> & {
  className?: string;
};

export function ProfileSelect({ children, className, ...props }: ProfileSelectProps) {
  return (
    <Select {...props}>
      <SelectTrigger className={clsx('glass-input h-10 text-sm px-3 bg-white/80 focus:bg-white', className)}>
        <SelectValue />
      </SelectTrigger>
      <SelectContent className="glass-card-enhanced/80 bg-white/80 backdrop-blur-md border border-wav3 rounded-xl shadow-lg">
        {children}
      </SelectContent>
    </Select>
  );
}

export function ProfileSelectItem({
  children,
  className,
  ...props
}: React.ComponentProps<typeof SelectItem>) {
  return (
    <SelectItem
      {...props}
      className={clsx(
        'bg-white/80 hover:bg-wav3/60 hover:text-primary transition-colors duration-150 cursor-pointer rounded-lg px-3 py-2',
        className
      )}
    >
      {children}
    </SelectItem>
  );
}
