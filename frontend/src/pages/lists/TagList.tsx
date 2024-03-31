import { EmptyState } from "@/components/EmptyState";
import { Skeleton } from "@/components/ui/skeleton";
import { Tag as TagIcon } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { useSearchQuery } from "@/services/queries";
import { Tag } from "@/lib/types";
import { TagCard } from "@/components/cards/TagCard";

export default function TagList() {
  const [searchParams] = useSearchParams();

  const queries = searchParams.toString();

  const { data: tagsData, isLoading: areTagsDataLoading } = useSearchQuery(
    "tags",
    queries,
  );

  const handleRedirect = () => {};

  return (
    <>
      <section className="grid grid-cols-4 gap-2 pb-8">
        {areTagsDataLoading ? (
          <>
            <Skeleton className="h-[250px] w-[full]" />
            <Skeleton className="h-[250px] w-[full]" />
            <Skeleton className="h-[250px] w-[full]" />
            <Skeleton className="h-[250px] w-[full]" />
            <Skeleton className="h-[250px] w-[full]" />
            <Skeleton className="h-[250px] w-[full]" />
            <Skeleton className="h-[250px] w-[full]" />
            <Skeleton className="h-[250px] w-[full]" />
          </>
        ) : tagsData.length > 0 ? (
          tagsData.map((tag: Tag) => <TagCard key={tag.id} tagData={tag} />)
        ) : (
          <EmptyState
            objectName="Tag"
            onClick={handleRedirect}
            icon={<TagIcon />}
          />
        )}
      </section>
    </>
  );
}
