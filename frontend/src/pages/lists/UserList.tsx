/* eslint-disable react-hooks/exhaustive-deps */
import { UserCard } from "@/components/cards/UserCard";
import { useEffect } from "react";
import { Navigate, useSearchParams } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton.tsx";
import { User } from "@/lib/types";
import { useSearchInfiniteQuery } from "@/services/queries";
import { useInView } from "react-intersection-observer";
import { EmptyState } from "@/components/EmptyState";
import { User as UserIcon } from "lucide-react";
import { useStateContext } from "@/contexts/ContextProvider";

export default function UserList() {
  const { currentUser } = useStateContext();

  if (currentUser!.admin !== 1) {
    return <Navigate to={"/"} />;
  }

  const handleRedirect = () => {};

  const [searchParams] = useSearchParams();

  const queries = searchParams.toString();

  const userQuery = useSearchInfiniteQuery("users", queries);

  const { ref, inView } = useInView({});

  useEffect(() => {
    if (inView && !userQuery.isFetchingNextPage && userQuery.hasNextPage) {
      userQuery.fetchNextPage();
    }
  }, [inView, userQuery.isFetchingNextPage]);

  useEffect(() => {
    userQuery.refetch();
  }, [searchParams]);

  return (
    <>
      <section>
        <div className="flex flex-col gap-2 pb-8">
          {userQuery.isLoading ? (
            <>
              <Skeleton className="w-[full] py-6" />
              <Skeleton className="w-[full] py-6" />
              <Skeleton className="w-[full] py-6" />
              <Skeleton className="w-[full] py-6" />
              <Skeleton className="w-[full] py-6" />
              <Skeleton className="w-[full] py-6" />
              <Skeleton className="w-[full] py-6" />
              <Skeleton className="w-[full] py-6" />
              <Skeleton className="w-[full] py-6" />
              <Skeleton className="w-[full] py-6" />
            </>
          ) : userQuery.data && userQuery.data.pages.length > 0 ? (
            userQuery.data.pages.map((page) =>
              page.data.map((video: User) => (
                <UserCard key={video.id} userData={video} />
              )),
            )
          ) : (
            !userQuery.isLoading &&
            !userQuery.isFetching &&
            !userQuery.isFetchingNextPage && (
              <EmptyState
                objectName="User"
                onClick={handleRedirect}
                icon={<UserIcon />}
                showButton={false}
              />
            )
          )}

          {!userQuery.isLoading && userQuery.isFetching && null}
          {!userQuery.isLoading && userQuery.isFetchingNextPage && (
            <>
              <Skeleton className="w-[full] py-6" />
              <Skeleton className="w-[full] py-6" />
              <Skeleton className="w-[full] py-6" />
              <Skeleton className="w-[full] py-6" />
            </>
          )}
        </div>
        <div ref={ref}></div>
      </section>
    </>
  );
}
