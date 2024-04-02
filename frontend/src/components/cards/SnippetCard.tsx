/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
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
import { CreateSelect } from "../CreateSelect";
import { Option, tagSchema } from "@/lib/types";
import { LoadingButton } from "../LoadingButton";
import {
  useCutVideoMutation,
  useDeleteSnippetMutation,
  useDownloadVideo,
  useUpdateMutation,
} from "@/services/mutations";

type SnippetCardProps = {
  snippetData: Snippet;
  tagsData: Tag[];
  onClick?: React.MouseEventHandler<HTMLDivElement>;
  isEditable?: boolean;
  parent?: string;
};

export const SnippetCard: React.FC<SnippetCardProps> = ({
  snippetData,
  tagsData,
  onClick,
  isEditable = true,
  parent = "",
}) => {
  const [snippetStart, setSnippetStart] = useState<TimeProp>(
    parseTime(snippetData.starts_at),
  );
  const [snippetEnd, setSnippetEnd] = useState<TimeProp>(
    parseTime(snippetData.ends_at),
  );

  // This code saves any tags that are already associated with the snippet into the selectedTags state so it can be diplayed in the CreateSelect component
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
      onClick?.(event);
    },
    [onClick],
  );

  const { mutateAsync: updateSnippetData, isPending: isUpdatePending } =
    useUpdateMutation("snippets", updateSnippetSchema, "videos");

  const { mutateAsync: deleteSnippet, isPending: isDeletePending } =
    useDeleteSnippetMutation(snippetData.video_id, parent);

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

  const { mutateAsync: cutMutation, isPending: isCutPending } =
    useCutVideoMutation("cut");

  const handleDeleteSnippet = () => {
    deleteSnippet(snippetData.id);
  };

  const cutVideo = async () => {
    cutMutation(snippetData.id);
  };

  const {
    data: downloadedData,
    mutateAsync: downloadVideo,
    isPending: isDownloadPending,
  } = useDownloadVideo("download");

  const downloadSnippet = async () => {
    try {
      await downloadVideo(snippetData.id);

      const filename = "video.mp4";
      const url = window.URL.createObjectURL(downloadedData);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();

      // Cleanup
      window.URL.revokeObjectURL(url);
      document.body.removeChild(link);
    } catch (error) {
      console.log(error);
    }
  };

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
      <div className="collapse collapse-arrow">
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
                readOnly={!isEditable}
              />
            </div>
          </div>

          <div className="pt-3">
            {selectedTags && tagsData ? (
              <>
                <CreateSelect
                  data={tagsData}
                  endpoint="tags"
                  selectedOptions={selectedTags}
                  isMulti={true}
                  setSelectedOptions={setSelectedTags}
                  placeholder="Select Tags"
                  schema={tagSchema}
                  isEditable={isEditable}
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
              {isEditable ? (
                isUpdatePending ? (
                  <LoadingButton className="justify-self-end" />
                ) : (
                  <Button
                    className="px-5"
                    disabled={
                      isDeletePending || isCutPending || isDownloadPending
                    }
                    onClick={updateData}
                    variant="default"
                  >
                    Save
                  </Button>
                )
              ) : null}
              {isCutPending ? (
                <LoadingButton className="justify-self-end" />
              ) : (
                <Button
                  variant="outline"
                  onClick={cutVideo}
                  disabled={
                    isUpdatePending || isDeletePending || isDownloadPending
                  }
                >
                  Cut Video
                </Button>
              )}

              {isDownloadPending ? (
                <LoadingButton className="justify-self-end" />
              ) : (
                <Button
                  variant="outline"
                  onClick={downloadSnippet}
                  disabled={isDeletePending || isCutPending || isUpdatePending}
                >
                  <Download className="pr-2" /> Download
                </Button>
              )}
            </div>
            {isEditable ? (
              isDeletePending ? (
                <>
                  <LoadingButton className="justify-self-end" />
                </>
              ) : (
                <>
                  <Button
                    variant="outline"
                    onClick={handleDeleteSnippet}
                    className="justify-self-end bg-red-500 text-white hover:bg-red-600"
                    disabled={
                      isCutPending || isUpdatePending || isDownloadPending
                    }
                  >
                    DELETE
                  </Button>
                </>
              )
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};
