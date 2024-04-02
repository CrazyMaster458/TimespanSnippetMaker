import { createContext, useContext } from "react";
import { VideoInputSection } from "../components/AdvancedSearch/VideoInputSection";
import { SnippetInputSection } from "../components/AdvancedSearch/SnippetInputSection";
import { InfluencerInputSection } from "../components/AdvancedSearch/InfluencerInputSection";
import { VideoTypeInputSection } from "../components/AdvancedSearch/VideoTypeInputSection";
import { TagInputSection } from "../components/AdvancedSearch/TagInputSection";
import { UserInputSection } from "../components/AdvancedSearch/UserInputSection";

interface AdvancedSearchContextType {
  selectedContentType: number;
  contentType: { id: number; name: string; value: string }[];
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

// Initialize the context with an initial value matching the defined type
const AdvancedSearchContentContext = createContext<AdvancedSearchContextType>({
  selectedContentType: 0,
  contentType: [],
  setOpen: () => {},
});

export const AdvancedSearchDialogContent: React.FC<
  AdvancedSearchContextType
> = ({ selectedContentType, contentType, setOpen }) => {
  let contentSection;
  switch (contentType[selectedContentType - 1].value) {
    case "videos":
      contentSection = <VideoInputSection />;
      break;
    case "snippets":
      contentSection = <SnippetInputSection />;
      break;
    case "influencers":
      contentSection = <InfluencerInputSection />;
      break;
    case "video-types":
      contentSection = <VideoTypeInputSection />;
      break;
    case "tags":
      contentSection = <TagInputSection />;
      break;
    case "users":
      contentSection = <UserInputSection />;
      break;
    default:
      contentSection = null;
  }

  return (
    <AdvancedSearchContentContext.Provider
      value={{
        selectedContentType,
        contentType,
        setOpen,
      }}
    >
      {contentSection}
    </AdvancedSearchContentContext.Provider>
  );
};

// Function to consume the content section value
export const useAdvancedSearchContent = () =>
  useContext(AdvancedSearchContentContext);
