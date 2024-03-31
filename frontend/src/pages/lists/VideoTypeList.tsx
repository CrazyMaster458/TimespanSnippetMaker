import { EmptyState } from "@/components/EmptyState";
import { Skeleton } from "@/components/ui/skeleton";
import { Tv } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { useSearchQuery } from "@/services/queries";
import { VideoType } from "@/lib/types";
import { VideoTypeCard } from "@/components/cards/VideoTypeCard";

export default function VideoTypeList() {
  const [searchParams] = useSearchParams();

  const queries = searchParams.toString();

  const { data: videoTypesData, isLoading: areVideoTypesDataLoading } =
    useSearchQuery("video_types", queries);

  const handleRedirect = () => {};

  return (
    <>
      <section className="grid grid-cols-4 gap-2 pb-8">
        {areVideoTypesDataLoading ? (
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
        ) : videoTypesData.length > 0 ? (
          videoTypesData.map((videoType: VideoType) => (
            <VideoTypeCard key={videoType.id} videoTypeData={videoType} />
          ))
        ) : (
          <EmptyState
            objectName="Video Type"
            onClick={handleRedirect}
            icon={<Tv />}
          />
        )}
      </section>
    </>
  );
}
