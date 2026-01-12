interface StatusBadgeProps {
  status: 'success' | 'warning' | 'error' | 'info';
  text: string;
}

const statusConfig = {
  success: { bg: 'bg-ios-green/10', text: 'text-ios-green', dot: 'bg-ios-green' },
  warning: { bg: 'bg-ios-orange/10', text: 'text-ios-orange', dot: 'bg-ios-orange' },
  error: { bg: 'bg-ios-red/10', text: 'text-ios-red', dot: 'bg-ios-red' },
  info: { bg: 'bg-ios-blue/10', text: 'text-ios-blue', dot: 'bg-ios-blue' },
};

export default function StatusBadge({ status, text }: StatusBadgeProps) {
  const config = statusConfig[status];
  
  return (
    <span className={`inline-flex items-center space-x-2 px-3 py-1.5 rounded-full ${config.bg} ${config.text} font-text font-medium text-sm`}>
      <span className={`w-2 h-2 rounded-full ${config.dot}`} />
      <span>{text}</span>
    </span>
  );
}
