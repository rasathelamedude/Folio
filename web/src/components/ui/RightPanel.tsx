import { HiOutlineBookOpen } from "react-icons/hi2";
import Skeleton from "@mui/material/Skeleton";

import BookCard from "./BookCard";
import UserCard from "./UserCard";

import { useQuery } from "@tanstack/react-query";
import { getTrendingBooks, getSuggestedUsers } from "../../api/contentApi";
import type { TrendingBook } from "../../types/Content";
import type { User } from "../../types/User";

const RightPanel = () => {
  const { data: bookData } = useQuery({
    queryKey: ["trending-books"],
    queryFn: () => getTrendingBooks(),
  });

  const { data: userData } = useQuery({
    queryKey: ["suggested-users"],
    queryFn: () => getSuggestedUsers(),
  });

  return (
    <aside className="w-80 p-6 pt-8 flex flex-col gap-10 overflow-y-auto lg:flex">
      {/* 1. CURRENTLY READING SECTION */}
      <section>
        <div className="bg-[#E8F3EF] border border-[#2A6B56]/20 rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-2 text-[10px] font-bold text-[#2A6B56] tracking-wider uppercase mb-3">
            <HiOutlineBookOpen className="w-4 h-4" />
            <span>Currently Reading</span>
          </div>

          <div className="flex gap-3">
            {/* Book Cover */}
            <div className="w-12 h-16 bg-[#185FA5] rounded flex items-center justify-center p-1 shrink-0 shadow-sm border-l-2 border-white/20">
              <span className="text-[6px] font-semibold text-white text-center leading-tight">
                Deep Work
              </span>
            </div>

            {/* Book Details */}
            <div className="flex-1 flex flex-col justify-center">
              <h4 className="text-sm font-semibold text-gray-900">Deep Work</h4>
              <p className="text-xs text-gray-500 mt-0.5">Cal Newport - 2016</p>

              {/* Progress Bar */}
              <div className="mt-3 flex items-center gap-3">
                <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#2A6B56] rounded-full"
                    style={{ width: "62%" }}
                  ></div>
                </div>
                <span className="text-xs font-medium text-gray-700">62%</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. TRENDING BOOKS SECTION */}
      <section>
        <h3 className="text-[10px] font-bold text-gray-400 tracking-wider uppercase mb-4 px-1">
          Trending Books
        </h3>

        {bookData !== undefined ? (
          <div className="flex flex-col gap-4">
            {bookData.trendingBooks?.length === 0 && (
              <p className="text-xs text-gray-500 px-1">
                No trending books yet.
              </p>
            )}

            {bookData.trendingBooks?.map(
              (book: TrendingBook, index: number) => (
                <BookCard
                  title={book.title}
                  authors={book.authors}
                  numberOfPosts={book.postCount}
                  bookCover={book.coverImageUrl}
                  key={index}
                />
              ),
            )}
          </div>
        ) : (
          <div className="flex flex-col gap-4 px-1">
            {[1, 2, 3].map((item) => (
              <div key={item} className="flex gap-3 items-center">
                <Skeleton className="w-10 h-14 rounded shrink-0" />
                <div className="flex-1 space-y-2.5">
                  <Skeleton className="h-3.5 w-3/4 rounded-full" />
                  <Skeleton className="h-2.5 w-1/2 rounded-full" />
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 3. READERS TO FOLLOW SECTION */}
      <section>
        <h3 className="text-[10px] font-bold text-gray-400 tracking-wider uppercase mb-4 px-1">
          Readers to Follow
        </h3>

        {userData !== undefined ? (
          <div className="flex flex-col gap-4 px-1">
            {userData.suggestedUsers?.map((suggestedUser: User) => {
              const avatar = suggestedUser.name.split(" ").map((n) => n[0])[0];
              return <UserCard avatar={avatar} name={suggestedUser.name} />;
            })}
          </div>
        ) : (
          <div className="flex flex-col gap-5 px-1">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="flex items-center justify-between w-full"
              >
                <div className="flex items-center gap-3 flex-1">
                  {/* Circular Avatar Skeleton */}
                  <Skeleton variant="circular" width={30} height={30} />

                  {/* Name and tag descriptions stacked */}
                  <div className="space-y-1 flex-1">
                    <Skeleton variant="rectangular" width={150} height={20} />
                    <Skeleton variant="rectangular" width={150} height={20} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </aside>
  );
};

export default RightPanel;
