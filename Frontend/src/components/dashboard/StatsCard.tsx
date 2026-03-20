import React from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCountUp } from '@/hooks/useCountUp';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'info';
}

const variantStyles = {
  default: 'border-l-[#8A9BB5]',
  primary: 'border-l-[#00C8FF]',
  success: 'border-l-[#00D4A1]',
  warning: 'border-l-[#F5A623]',
  info: 'border-l-[#00C8FF]',
};

const variantTextColors = {
  default: 'text-[#8A9BB5]',
  primary: 'text-[#00C8FF]',
  success: 'text-[#00D4A1]',
  warning: 'text-[#F5A623]',
  info: 'text-[#00C8FF]',
};

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  icon: Icon,
  trend,
  variant = 'default',
}) => {
  const numericValue = typeof value === 'number' ? value : parseInt(value.toString()) || 0;
  const { value: animatedValue } = useCountUp(numericValue);

  return (
    <div className={cn(
      "bg-[#111827] border border-[#1E293B] border-l-2 p-5 hover:border-[#00C8FF33] hover:shadow-[0_0_24px_rgba(0,200,255,0.06)] transition-all duration-300",
      variantStyles[variant]
    )}>
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-[10px] tracking-[0.15em] uppercase text-[#8A9BB5]">{title}</p>
          <p className={cn(
            "text-3xl font-light font-mono",
            variantTextColors[variant]
          )}>
            {typeof value === 'number' ? animatedValue : value}
          </p>
          {trend && (
            <p className={cn(
              "text-xs",
              trend.isPositive ? "text-[#00D4A1]" : "text-[#FF4D6D]"
            )}>
              {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}% from last week
            </p>
          )}
        </div>
        <div className="p-2 bg-[#1A2235] border border-[#1E293B]">
          <Icon className={cn("h-5 w-5", variantTextColors[variant])} />
        </div>
      </div>
    </div>
  );
};
