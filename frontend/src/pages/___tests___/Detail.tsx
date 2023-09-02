import { Navbar } from "@/components/Navbar";
import DataPage from "@/components/table/page2";
import { Video } from "@/components/video";
import { ScrollArea } from "@/components/ui/scroll-area";

function Detail() {
  return (
    <>
      <Navbar></Navbar>

      <div className="grid grid-cols-2 gap-8 content-center pt-14">
        <div className="justify-self-center mt-12">
          <Video></Video>
        </div>
        <div className="">
          <ScrollArea className="h-[684px] w-[full]">
            <DataPage />
            {/* <DemoPage /> */}
          </ScrollArea>
        </div>
      </div>
    </>
  );
}

export default Detail;
