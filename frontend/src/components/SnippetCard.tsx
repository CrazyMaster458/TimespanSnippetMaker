/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import axiosClient from "@/api/axios";
import { TimespanInput } from "@/components/TimespanInput";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Download } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import {
  Snippet,
  UpdateSnippet,
  Tag,
  TimeProp,
  updateSnippetSchema,
} from "@/lib/types";
import { parseTime } from "@/utils/timeUtils";
import { SelectCreate } from "./Select";
import { Option, tagSchema } from "@/lib/types";
import { deleteData, putData } from "@/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { LoadingButton } from "./LoadingButton";
import { AxiosProgressEvent } from "axios";

type SnippetCardProps = {
  snippetData: Snippet;
  tagsData: Tag[];
  onClick: React.MouseEventHandler<HTMLDivElement>;
  setSnippetTimes?: (newTime: SnippetTime) => void;
};

type SnippetTime = {
  starts_at: string;
  ends_at: string;
};

export const SnippetCard: React.FC<SnippetCardProps> = ({
  snippetData,
  tagsData,
  onClick,
  setSnippetTimes,
}) => {
  const queryClient = useQueryClient();

  const [snippetStart, setSnippetStart] = useState<TimeProp>(
    parseTime(snippetData.starts_at),
  );
  const [snippetEnd, setSnippetEnd] = useState<TimeProp>(
    parseTime(snippetData.ends_at),
  );

  // This code saves any tags that are already associated with the snippet into the selectedTags state so it can be diplayed in the SelectCreate component
  const mappedSnippetTags = snippetData.snippet_tags
    ? snippetData.snippet_tags.map((tag) => tag.tag_id)
    : [];
  const [selectedTags, setSelectedTags] = useState<Option[]>(
    tagsData
      .filter((tag) => mappedSnippetTags.includes(tag.id))
      .map((tag) => ({ value: tag.id, label: tag.name }) as Option),
  );

  const [description, setDescription] = useState(snippetData.description || "");
  const [snippetDuration, setSnippetDuration] = useState("0:00");

  const handleCardClick = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      onClick(event);
    },
    [onClick],
  );

  const { mutateAsync: updateSnippetData } = useMutation({
    mutationFn: (data: UpdateSnippet) =>
      putData(`/snippets/${data.id}`, data, updateSnippetSchema),
    onSuccess: () => {
      const queryKey = ["videos", snippetData.video_id, "snippets"];

      queryClient.invalidateQueries(queryKey);
    },
    onError: (error) => {
      console.error("Error updating snippet:", error);
    },
  });

  const { mutateAsync: deleteSnippet, isPending } = useMutation({
    mutationFn: () => deleteData(`/snippets/${snippetData.id}`),
    onSuccess: () => {
      const queryKey = ["videos", snippetData.video_id, "snippets"];

      queryClient.invalidateQueries(queryKey);
    },
    onError: (error) => {
      console.error("Error updating snippet:", error);
    },
  });

  const updateData = async () => {
    try {
      const data: UpdateSnippet = {
        id: snippetData.id,
        description: description,
        starts_at: Object.values(snippetStart).join(":"),
        ends_at: Object.values(snippetEnd).join(":"),
        video_id: snippetData.video_id,
        snippet_tags:
          selectedTags.length > 0
            ? selectedTags.map((tag) => tag.value)
            : undefined,
      };
      await updateSnippetData(data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteSnippet = () => {
    deleteSnippet();
  };

  const cutVideo = async () => {
    try {
      const response = await axiosClient.post(`/cut/${snippetData.id}`);
      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const downloadSnippet = async () => {
    try {
      const response = await axiosClient.get(`/download/${snippetData.id}`, {
        responseType: "blob", // Set the response type to "blob" to handle binary data
        onDownloadProgress: (progressEvent: AxiosProgressEvent) => {
          if (progressEvent.event.lengthComputable) {
            console.log(
              ((progressEvent.loaded / progressEvent.total!) * 100).toFixed() +
                "%",
            );
          } else {
            console.log("Download in progress, please wait...");
          }
        },
      });
      console.log(response);

      // Extract the filename from response headers
      const filename = response.headers["X-Filename"] || "video.mp4";

      // Create a URL for the blob object received in the response
      // const url = window.URL.createObjectURL(new Blob([response.data]));
      const url = window.URL.createObjectURL(response.data);

      // Create a link element to trigger the download
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", filename); // Set the filename here
      document.body.appendChild(link);
      link.click();

      // Cleanup
      window.URL.revokeObjectURL(url);
      document.body.removeChild(link);
    } catch (error) {
      console.log(error);
    }
  };

  // useEffect(() => {
  //   if (snippetStart && snippetEnd && !initialLoad) {
  //     setSnippetTimes({
  //       starts_at: Object.values(snippetStart).join(":"),
  //       ends_at: Object.values(snippetEnd).join(":"),
  //     });
  //   }
  // }, [snippetStart, snippetEnd]);

  useEffect(() => {
    if (snippetEnd && snippetStart) {
      const leadingZeroFormatter = new Intl.NumberFormat(undefined, {
        minimumIntegerDigits: 2,
      });

      let minutes =
        parseInt(snippetEnd.minutes) - parseInt(snippetStart.minutes);
      let seconds =
        parseInt(snippetEnd.seconds) - parseInt(snippetStart.seconds);

      if (seconds < 0) {
        seconds += 60;
        minutes--;
      }

      let hours = parseInt(snippetEnd.hours) - parseInt(snippetStart.hours);

      if (minutes < 0) {
        minutes += 60;
        hours--;
      }

      if (hours < 0) {
        minutes = 0;
        seconds = 0;
      }

      setSnippetDuration(`${minutes}:${leadingZeroFormatter.format(seconds)}`);
    }
  }, [snippetEnd, snippetStart]);

  return (
    <div>
      <div className="collapse-arrow collapse">
        <input type="radio" name="my-accordion-2" onClick={handleCardClick} />
        <div className="collapse-title">
          <div className="flex justify-between">
            <div>{description}</div>
            <div className="flex items-center">
              <div>{snippetDuration}</div>
            </div>
          </div>
        </div>
        <div className="collapse-content">
          <div className="flex flex-row gap-4">
            <div className="flex flex-row gap-1">
              {snippetStart && snippetEnd ? (
                <>
                  <TimespanInput
                    snippetTime={snippetStart}
                    setSnippetTime={setSnippetStart}
                  />
                  <div className="place-self-center">-</div>
                  <TimespanInput
                    snippetTime={snippetEnd}
                    setSnippetTime={setSnippetEnd}
                  />
                </>
              ) : (
                <p>Loading...</p>
              )}
            </div>
            <div className="w-full focus-within:h-auto">
              <Input
                type="text"
                className="w-full"
                value={description}
                maxLength={255}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Description"
              />
            </div>
          </div>

          <div className="pt-3">
            {selectedTags && tagsData ? (
              <>
                <SelectCreate
                  data={tagsData}
                  endpoint="tags"
                  selectedOptions={selectedTags}
                  isMulti={true}
                  setSelectedOptions={setSelectedTags}
                  placeholder="Select Tags"
                  schema={tagSchema}
                />
              </>
            ) : (
              <p>Loading...</p>
            )}
          </div>

          <div className="pt-3">
            <Textarea
              defaultValue={snippetData.transcript}
              placeholder="Transcript not avalible"
              readOnly
            />
          </div>

          <div className="flex w-full place-items-center justify-between pt-5">
            <div className="flex justify-start gap-3">
              <Button
                className="px-5"
                disabled={isPending}
                onClick={updateData}
                variant="default"
              >
                Save
              </Button>
              <Button
                variant="outline"
                onClick={downloadSnippet}
                disabled={isPending}
              >
                <Download className="pr-2" /> Download
              </Button>
            </div>
            {isPending ? (
              <>
                <LoadingButton className="justify-self-end" />
              </>
            ) : (
              <>
                <Button
                  variant="outline"
                  onClick={handleDeleteSnippet}
                  className="justify-self-end bg-red-500"
                >
                  DELETE
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
