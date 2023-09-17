import { ScrollArea } from "@/components/ui/scroll-area";
import { VideoPlayer } from "../components/VideoPlayer";
import { SnippetCard } from "@/components/SnippetCard";

export default function Detail() {
  return (
    <>
      <div className="grid grid-cols-2 gap-8 content-center pt-14">
        <div className="justify-self-center mt-12">
          <VideoPlayer />
        </div>
        <div className="">
          <ScrollArea className="h-[684px] w-[full] grid gap-4 grid-cols-1 pr-12">
            <SnippetCard />
            <SnippetCard />
            <SnippetCard />
            <SnippetCard />
            <SnippetCard />
            <SnippetCard />
            <SnippetCard />
            <SnippetCard />
            <SnippetCard />
            <SnippetCard />
            <SnippetCard />
            <SnippetCard />
            <SnippetCard />
            <SnippetCard />
            <SnippetCard />
            <SnippetCard />
            <SnippetCard />
            <SnippetCard />
            <SnippetCard />
          </ScrollArea>
        </div>
      </div>
    </>
  );
}
