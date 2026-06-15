interface BookCardProps {
  title: string;
  authors: string[] | null;
  bookCover: string | null;
  numberOfPosts: number;
}

const BookCard = ({
  title,
  authors,
  bookCover,
  numberOfPosts,
}: BookCardProps) => {
  const formatNumberOfPosts = (number: number): string => {
    if (number > 1000) {
      return `${(number / 1000).toFixed(1)}k`;
    }
    return `${number}`;
  };

  return (
    <div className="flex gap-3 items-center group cursor-pointer px-1">
      <div
        className={`w-10 h-14 ${bookCover !== null ? "" : "bg-[#185FA5]"} rounded shadow-sm flex items-center justify-center p-1 border-l-2 border-white/20 shrink-0`}
      >
        {bookCover !== null ? (
          <img src={bookCover} alt="book cover" className="w-8 h-12" />
        ) : (
          <span className="text-[6px] font-semibold text-white text-center leading-tight">
            {title}
          </span>
        )}
      </div>
      <div className="flex-1">
        <h4 className="text-sm font-medium text-gray-900 group-hover:text-[#2A6B56] transition-colors">
          {title}
        </h4>
        <p className="text-[11px] text-gray-500">
          {authors !== null ? authors.join(", ") : "No authors"}
        </p>
        <p className="text-[11px] font-medium text-[#2A6B56] mt-0.5">
          {formatNumberOfPosts(numberOfPosts)} posts
        </p>
      </div>
    </div>
  );
};

export default BookCard;
