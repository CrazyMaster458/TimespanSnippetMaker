import { CardView } from "@/components/Card";
import { Navbar } from "@/components/Navbar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

function ListView() {
  return (
    <>
      <Navbar></Navbar>

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
              Tate
            </TabsTrigger>
            <TabsTrigger value="tristan">Tristan</TabsTrigger>
            <TabsTrigger value="jwaller">JWaller</TabsTrigger>
            <TabsTrigger value="juel">Juel</TabsTrigger>
          </TabsList>
          <Separator className="my-2" />
          <TabsContent value="jwaller" className="grid grid-cols-5 gap-5">
            <CardView />
            <CardView />
            <CardView />
            <CardView />
            <CardView />
            <CardView />
            <CardView />
            <CardView />
            <CardView />
            <CardView />
            <CardView />
            <CardView />
            <CardView />
            <CardView />
            <CardView />
          </TabsContent>
          <TabsContent value="password">Change your password here.</TabsContent>
        </Tabs>
      </div>
    </>
  );
}

export default ListView;
