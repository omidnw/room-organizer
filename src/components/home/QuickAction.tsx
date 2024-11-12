import React from 'react';
import { Link } from 'react-router-dom';
import { 
  PlusCircle, 
  Grid, 
  Clock, 
  BarChart3,
  LucideIcon 
} from 'lucide-react';

const iconMap: Record<string, LucideIcon> = {
  plus: PlusCircle,
  grid: Grid,
  clock: Clock,
  chart: BarChart3,
};

interface QuickActionProps {
  title: string;
  icon: string;
  link: string;
}

function QuickAction({ title, icon, link }: QuickActionProps) {
  const Icon = iconMap[icon];

  return (
    <Link 
      to={link}
      className="p-4 rounded-lg hover:bg-background transition-colors text-center group"
    >
      <div className="w-12 h-12 mx-auto mb-2 bg-primary/10 rounded-full flex items-center justify-center text-primary group-hover:bg-primary/20 transition-colors">
        {Icon && <Icon size={24} />}
      </div>
      <span className="text-textPrimary font-medium">{title}</span>
    </Link>
  );
}

export default QuickAction; 