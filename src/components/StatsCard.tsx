interface StatsCardProps {
  icon: string;
  label: string;
  value: number | string;
  color: string;
  index?: number;
}

export default function StatsCard({ icon, label, value, color, index = 0 }: StatsCardProps) {
  return (
    <div 
      className={`glass-card p-6 animate-fade-in stagger-${index + 1}`}
      style={{ opacity: 0 }}
    >
      <div className="flex items-center justify-between mb-4">
        <div 
          className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
          style={{ background: `linear-gradient(135deg, ${color}30, ${color}10)` }}
        >
          {icon}
        </div>
      </div>
      <p className="text-3xl font-bold text-[var(--text-primary)] mb-1">
        {value}
      </p>
      <p className="text-sm text-[var(--text-muted)]">{label}</p>
    </div>
  );
}
