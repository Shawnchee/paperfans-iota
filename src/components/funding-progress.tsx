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
      <div className="flex justify-between text-xs text-gray-400 mb-1">
        <span>
          ${currentFunding.toLocaleString()} / ${fundingGoal.toLocaleString()}
        </span>
        <span>{daysLeft} days left</span>
      </div>
      <div className="w-full bg-gray-700 rounded-full h-2">
        <div
          className="funding-progress h-2 rounded-full transition-all duration-300"
          style={{ width: `${Math.min(percentageFunded, 100)}%` }}
        />
      </div>
    </div>
  );
}
