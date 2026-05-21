import { Warning } from "@phosphor-icons/react";

export const AlertHide = (props) => {
    const { value } = props;

    return (
        <>
            <div className="flex flex-col items-center text-center p-4 gap-6">
                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-red-100 text-red-500">
                    <Warning size={48} />
                </div>
                <p>
                    You&apos;re going to change the visibility of{" "}
                    <span className="font-bold text-red-500">{value[0]}</span>{" "}
                    menu. Are you sure?
                </p>
            </div>
        </>
    );
};
