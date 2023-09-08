import { Navbar } from "@/components/Navbar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { VideoPlayer } from "./VideoPlayer";
import { SnippetCard } from "@/components/SnippetCard";

function Detail() {
  return (
    <>
      <Navbar></Navbar>

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

export default Detail;
