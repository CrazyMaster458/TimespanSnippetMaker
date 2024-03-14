import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function NotFound() {
  const navigate = useNavigate();

  const handleButtonClick = () => {
    navigate("/");
  };

  return (
    <div className="flex h-[100vh] w-[full] flex-col items-center justify-center pb-10">
      <div className="flex flex-col items-center">
        <p className="text-lg font-medium text-[#2563eb]">404</p>
        <h1 className="pb-3 text-5xl font-bold">Page Not Found</h1>
        <p className="pb-6 text-base font-normal">
          Sorry, we couldn’t find the page you’re looking for.
        </p>
        <Button onClick={handleButtonClick}>Go Back Home</Button>
      </div>
    </div>
  );
}
