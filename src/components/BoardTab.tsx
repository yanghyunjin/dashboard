// components/BoardTab.tsx

interface BoardTabProps {
  title: string;
  active: boolean;
  onClick: () => void;
}

const BoardTab: React.FC<BoardTabProps> = ({ title, active, onClick }) => {
  return (
    <div className={`board-tab ${active ? "active" : ""}`} onClick={onClick}>
      {title}
    </div>
  );
};

export default BoardTab;
