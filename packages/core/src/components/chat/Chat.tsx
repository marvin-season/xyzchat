export type ChatProps = {
  children: React.ReactNode[];
  interact: React.ReactNode;
};

export function Chat({ children, interact }: ChatProps): JSX.Element {
  return (
    <div className="flex flex-col h-full">
      <div className="flex-auto overflow-auto">
        <div className="flex flex-col">{children}</div>
      </div>
      <div className="shrink-0">{interact}</div>
    </div>
  );
}
