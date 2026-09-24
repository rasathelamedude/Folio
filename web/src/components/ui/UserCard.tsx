interface UserCardProps {
  avatar: string;
  name: string;
  interests?: string[];
  booksRead?: number;
}

const UserCard = ({
  avatar,
  name,
  interests = ["Philosophy", "Psychology"],
  booksRead = 1,
}: UserCardProps) => {
  return (
    <div className="flex items-center justify-between gap-2">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-secondary text-primary flex items-center justify-center text-xs font-semibold shrink-0">
          {avatar}
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-medium text-foreground hover:underline cursor-pointer">
            {name}
          </span>
          <span className="text-[11px] text-foreground/75">
            {interests.join(", ")}
          </span>
          <span className="text-[11px] text-foreground/75">
            {booksRead} books
          </span>
        </div>
      </div>
      <button className="bg-secondary border border-secondary text-foreground hover:bg-background hover:border-primary rounded-full px-3 py-1 text-[11px] font-medium transition-colors">
        Follow
      </button>
    </div>
  );
};

export default UserCard;
