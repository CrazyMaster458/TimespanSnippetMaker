import { EmptyState } from "@/components/EmptyState";
import { InfluencerCard } from "@/components/cards/InfluencerCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Users } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { useSearchQuery } from "@/services/queries";
import { Influencer } from "@/lib/types";

export default function InfluencerList() {
  const [searchParams] = useSearchParams();

  const queries = searchParams.toString();

  const { data: influencersData, isLoading: areInfluencersDataLoading } =
    useSearchQuery("influencers", queries);

  const handleRedirect = () => {};

  return (
    <>
      <section className="grid grid-cols-4 gap-2 pb-8">
        {areInfluencersDataLoading ? (
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
        ) : influencersData.length > 0 ? (
          influencersData.map((influencer: Influencer) => (
            <InfluencerCard key={influencer.id} influencerData={influencer} />
          ))
        ) : (
          <EmptyState
            objectName="Influencer"
            onClick={handleRedirect}
            icon={<Users />}
          />
        )}
      </section>
    </>
  );
}
