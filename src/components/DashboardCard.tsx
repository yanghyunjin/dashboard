// components/DashboardCard.tsx

interface DashboardCardProps {
  title: string;
  valueInSeconds: number;
  displayAsTime?: boolean;
}

const formatTime = (totalSeconds: number): string => {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = Math.floor(totalSeconds % 60);
  return `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
};

const DashboardCard: React.FC<DashboardCardProps> = ({
  title,
  valueInSeconds,
  displayAsTime,
}) => {
  return (
    <div className="dashboard-card">
      <h2 className="text-lg font-bold mb-4">{title}</h2>
      <p className="text-3xl font-bold">
        {displayAsTime ? formatTime(valueInSeconds) : valueInSeconds}
      </p>
    </div>
  );
};

export default DashboardCard;
