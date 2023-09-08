import { VideoCard } from "@/components/VideoCard";
import { Navbar } from "@/components/Navbar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

function ListView() {
  return (
    <>
      {/* <Navbar></Navbar> */}

      <div className="container mt-8">
        <Tabs
          defaultValue="account"
          className="flex flex-col justify-center content-center"
        >
          <TabsList className="mx-96 grid grid-cols-4 justify-items-stretch">
            <TabsTrigger
              value="tate"
              className="transition duration-150 ease-in-out"
            >
              Rollo
            </TabsTrigger>
            <TabsTrigger value="tristan">Stirling</TabsTrigger>
            <TabsTrigger value="jwaller">JWaller</TabsTrigger>
            <TabsTrigger value="juel">Juel</TabsTrigger>
          </TabsList>
          <Separator className="my-2" />
          <TabsContent value="jwaller" className="grid grid-cols-4 gap-5">
            <VideoCard />
            <VideoCard />
            <VideoCard />
            <VideoCard />
            <VideoCard />
            <VideoCard />
            <VideoCard />
            <VideoCard />
            <VideoCard />
            <VideoCard />
            <VideoCard />
            <VideoCard />
            <VideoCard />
            <VideoCard />
            <VideoCard />
          </TabsContent>
          <TabsContent value="password">Change your password here.</TabsContent>
        </Tabs>
      </div>
    </>
  );
}

export default ListView;
