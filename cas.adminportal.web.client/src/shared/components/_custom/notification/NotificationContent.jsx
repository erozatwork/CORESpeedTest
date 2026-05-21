import { formatDistanceToNow } from "date-fns";
import { DotOutline, DownloadSimple } from "@phosphor-icons/react";

import { Avatar, AvatarFallback, AvatarImage } from "@shared/components/ui/avatar";
import { NotificationTooltip } from "./NotificationTooltip";
import { Button } from "@shared/components/ui/button";
import { getFileIcon, formatFileSize } from "@shared/utils/files";

const NotificationContent = (props) => {
  const {
    id,
    type,
    title,
    sender,
    department,
    data,
    description,
    createdAt,
    isRead,
    isOnline,
  } = props;

  return (
    <>
      <div className="flex items-start justify-start gap-3 px-4 py-2 hover:bg-smoke cursor-pointer">
        <div className="relative w-10 h-10">
          <Avatar className="w-10 h-10">
            <AvatarImage src="" alt={sender || "Sender avatar"} />
            <AvatarFallback>
              {sender
                ?.split(" ")
                .map((word) => word[0])
                .join("")
                .toUpperCase() || "CN"}
            </AvatarFallback>
          </Avatar>

          <div className="absolute bottom-1 right-2 translate-x-1/2 translate-y-1/2 pointer-events-none">
            <DotOutline
              size={40}
              className={`${isOnline ? `text-green-500` : `text-gray-400`}`}
              weight="fill"
            />
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <div>
            <h3 className="text-xs font-thin">{title}</h3>
            <div className="flex justify-center items-start space-x-2">
              <span className="text-sm font-semibold text-nowrap">
                {sender}
              </span>
              <div className="flex flex-col items-start">
                <NotificationTooltip text={description} />
              </div>
            </div>
          </div>

          <span className="text-xs text-gray-500 flex items-center">
            {formatDistanceToNow(new Date(createdAt), {
              addSuffix: true,
            })}
            <DotOutline size={20} weight="fill" />
            {department}
          </span>
          {type === "sign-request" && (
            <div className="flex justify-start items-center gap-2 py-2">
              <Button
                type="button"
                variant="ghost"
                className="bg-smoke-inverse rounded-lg self-end sm:self-auto font-normal text-xs text-white"
              >
                Review
              </Button>
              <Button
                type="button"
                className="rounded-lg self-end sm:self-auto font-normal text-xs bg-red-800"
              >
                Sign Document
              </Button>
            </div>
          )}
          {type === "file-received" && (
            <div className="border bg-white rounded-lg p-2 flex justify-between items-center">
              <figure className="text-xs flex items-center space-x-2">
                {getFileIcon(data, 20)}
                <figcaption>
                  <span className="font-medium block">{data.name}</span>
                  <span className="text-gray-500">
                    {formatFileSize(data.size)}
                  </span>
                </figcaption>
              </figure>

              <button
                type="button"
                className="text-gray-500 hover:text-red-500"
              >
                <DownloadSimple size={20} weight="fill" />
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export { NotificationContent };
