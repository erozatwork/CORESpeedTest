import { Warning } from "@phosphor-icons/react";

export const AlertRemove = (props) => {
  const { value, parent } = props;

  return (
    <>
      <div className="flex flex-col items-center text-center p-4 gap-6">
        <div className="flex items-center justify-center w-16 h-16 rounded-full bg-red-100 text-red-500">
          <Warning size={32} weight="light" />
        </div>
        <p>
          You&apos;re going to Archive the{" "}
          <span className="font-bold text-red-500">{value}</span>
          {parent ? (
            <>
              {" "}
              in the <span className="font-semibold">{parent}</span>
            </>
          ) : null}
          . Are you sure?
        </p>
      </div>
    </>
  );
};
