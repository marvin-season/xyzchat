import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";

export type UserQueryProps = {
  query: string;
};

export function UserQuery({ query }: UserQueryProps): JSX.Element {
  return (
    <div className="px-3 py-4 bg-zinc-100">
      <div className="max-w-[42rem] mx-auto flex gap-3 ">
        <Avatar className="w-6 h-6">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
            data-slot="icon"
            className="w-6 h-6 flex-shrink-0 mt-[2px]"
          >
            <path
              fill-rule="evenodd"
              d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-5.5-2.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0ZM10 12a5.99 5.99 0 0 0-4.793 2.39A6.483 6.483 0 0 0 10 16.5a6.483 6.483 0 0 0 4.793-2.11A5.99 5.99 0 0 0 10 12Z"
              clip-rule="evenodd"
            ></path>
          </svg>
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <div className="break-all">{query}</div>
      </div>
    </div>
  );
}

export type AssistantReplyProps = {
  content: string;
};

export function AssistantReply({ content }: AssistantReplyProps): JSX.Element {
  return (
    <div className="px-3 py-4 ">
      <div className="max-w-[42rem] mx-auto flex gap-3 ">
        <Avatar className="w-6 h-6">
          <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <div className="break-all">{content}</div>
      </div>
    </div>
  );
}
