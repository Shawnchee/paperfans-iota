import { Progress } from "@/components/ui/progress";

interface FundingProgressProps {
  currentFunding: number;
  fundingGoal: number;
  daysLeft: number;
  className?: string;
}

export function FundingProgress({
  currentFunding,
  fundingGoal,
  daysLeft,
  className = "",
}: FundingProgressProps) {
  const percentageFunded = (currentFunding / fundingGoal) * 100;

  return (
    <div className={className}>
      <div className="flex justify-between text-xs text-gray-400 mb-2">
        <span className="font-mono">
          ${currentFunding.toLocaleString()} / ${fundingGoal.toLocaleString()}
        </span>
        <span className="font-mono text-neon-cyan">{daysLeft} days left</span>
      </div>
      <div className="sci-fi-progress w-full rounded-full h-3 relative overflow-hidden">
        <div
          className="sci-fi-progress-fill h-3 rounded-full transition-all duration-500 relative"
          style={{ width: `${Math.min(percentageFunded, 100)}%` }}
        >
          {/* Animated shine effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"></div>
        </div>
      </div>
    </div>
  );
}
