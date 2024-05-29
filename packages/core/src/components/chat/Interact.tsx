import { Input } from "../ui/input";

export type InteractProps = {
  input: string;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onInputChange: (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
  ) => void;
};

export function Interact({
  input,
  onSubmit,
  onInputChange,
}: InteractProps): JSX.Element {
  return (
    <form onSubmit={onSubmit}>
      <div className="flex">
        <Input value={input} onChange={onInputChange} />
      </div>
    </form>
  );
}
