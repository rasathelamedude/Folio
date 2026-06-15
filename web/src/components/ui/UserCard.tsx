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
        <div className="w-9 h-9 rounded-full bg-[#D0E9E1] text-[#2A6B56] flex items-center justify-center text-xs font-semibold shrink-0">
          {avatar}
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-medium text-gray-900 hover:underline cursor-pointer">
            {name}
          </span>
          <span className="text-[11px] text-gray-500">
            {interests.join(", ")}
          </span>
          <span className="text-[11px] text-gray-500">{booksRead} books</span>
        </div>
      </div>
      <button className="border border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 rounded-full px-3 py-1 text-[11px] font-medium transition-colors">
        Follow
      </button>
    </div>
  );
};

export default UserCard;
