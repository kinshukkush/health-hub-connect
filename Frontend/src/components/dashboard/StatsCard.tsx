import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';

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
  default: 'bg-muted/50 text-muted-foreground',
  primary: 'bg-primary/10 text-primary',
  success: 'bg-success/10 text-success',
  warning: 'bg-warning/10 text-warning',
  info: 'bg-info/10 text-info',
};

const variantGradients = {
  default: 'from-muted/5 to-transparent',
  primary: 'from-primary/5 to-transparent',
  success: 'from-success/5 to-transparent',
  warning: 'from-warning/5 to-transparent',
  info: 'from-info/5 to-transparent',
};

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  icon: Icon,
  trend,
  variant = 'default',
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -4 }}
    >
      <Card className="hover:shadow-xl hover:border-primary/30 transition-all duration-300 overflow-hidden relative group">
        {/* Gradient overlay */}
        <div className={cn(
          "absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-300",
          variantGradients[variant]
        )} />
        
        <CardContent className="p-6 relative">
          <div className="flex items-center justify-between">
            <div className="space-y-2 flex-1">
              <p className="text-sm text-muted-foreground font-medium">{title}</p>
              <motion.p 
                className="text-3xl font-bold text-foreground"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              >
                {value}
              </motion.p>
              {trend && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="flex items-center gap-1"
                >
                  {trend.isPositive ? (
                    <TrendingUp className="h-3 w-3 text-success" />
                  ) : (
                    <TrendingDown className="h-3 w-3 text-destructive" />
                  )}
                  <p className={cn(
                    "text-xs font-semibold",
                    trend.isPositive ? "text-success" : "text-destructive"
                  )}>
                    {Math.abs(trend.value)}% from last week
                  </p>
                </motion.div>
              )}
            </div>
            <motion.div 
              className={cn(
                "flex h-14 w-14 items-center justify-center rounded-xl shadow-lg",
                variantStyles[variant]
              )}
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Icon className="h-7 w-7" />
            </motion.div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
