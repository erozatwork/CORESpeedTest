import Popover from "@mui/material/Popover";

const PopOverComponent = ({
    open = false,
    anchorEl = null,
    header,
    footer,
    width,
    anchorOrigin,
    transformOrigin,
    onClose,
    children,
}) => {
    /**
     * Usage
     * anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
     * transformOrigin={{ vertical: "top", horizontal: "left" }}
     * width: 220,
     **/
    return (
        <>
            <Popover
                open={open}
                anchorEl={anchorEl}
                onClose={onClose}
                anchorOrigin={anchorOrigin}
                transformOrigin={transformOrigin}
                PaperProps={{
                    sx: {
                        p: 0,
                        width: width,
                        overflow: "hidden",
                        borderRadius: 2,
                    },
                }}
            >
                <div className="text-xs w-full">
                    {header ? (
                        header
                    ) : (
                        <div className="flex justify-end items-center bg-gray-100 px-3 py-2 border-b border-gray-200">
                            <button
                                onClick={onClose}
                                className="text-gray-500 hover:text-black text-xs"
                            >
                                ✕
                            </button>
                        </div>
                    )}

                    {children}
                    {footer && footer}
                </div>
            </Popover>
        </>
    );
};

export { PopOverComponent };
