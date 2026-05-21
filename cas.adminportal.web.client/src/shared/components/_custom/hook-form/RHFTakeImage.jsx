import Webcam from "react-webcam";
import { useRef, useState } from "react";
import { useFormContext, Controller } from "react-hook-form";
import PropTypes from "prop-types";
import { Button } from "@shared/components/ui/button";

RHFTakeImage.propTypes = {
    name: PropTypes.string.isRequired,
    label: PropTypes.string,
};

export default function RHFTakeImage({ name, label, ...other }) {
    const webcamRef = useRef(null);
    const [preview, setPreview] = useState(null);
    const { control, setValue, clearErrors } = useFormContext();

    const capture = (onChange) => {
        const screenshot = webcamRef.current?.getScreenshot();

        if (screenshot) {
            setPreview(screenshot);

            // Convert base64 to File
            const byteString = atob(screenshot.split(",")[1]);
            const mimeString = screenshot
                .split(",")[0]
                .split(":")[1]
                .split(";")[0];
            const ab = new ArrayBuffer(byteString.length);
            const ia = new Uint8Array(ab);

            for (let i = 0; i < byteString.length; i++) {
                ia[i] = byteString.charCodeAt(i);
            }

            const file = new File([ab], "photo.jpg", { type: mimeString });

            onChange([file]);
            setValue(name, [file], { shouldValidate: true });
            clearErrors(name);
        }
    };

    const retake = (onChange) => {
        setPreview(null);
        setValue(name, [], { shouldValidate: true });
        onChange([]);
    };

    return (
        <Controller
            name={name}
            control={control}
            rules={{ required: "Photo is required" }}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
                <div>
                    {label && (
                        <label className="block font-medium">{label}</label>
                    )}

                    {!preview ? (
                        <>
                            <Webcam
                                audio={false}
                                ref={webcamRef}
                                screenshotFormat="image/jpeg"
                                className="w-full border border-[#0000003B] dark:border-[#2A2F36] rounded-lg"
                                videoConstraints={{ facingMode: "user" }}
                                {...other}
                            />
                            <Button
                                type="button"
                                onClick={() => capture(onChange)}
                                className="flex items-center text-sm font-semibold leading-6 w-fit bg-smoke text-black float-right !mb-2 mt-2"
                            >
                                <span>Capture and Save</span>
                            </Button>
                        </>
                    ) : (
                        <div className="space-y-2">
                            <img
                                src={preview}
                                alt="Captured"
                                className="w-full border rounded"
                            />
                            <Button
                                type="button"
                                onClick={() => retake(onChange)}
                                className="flex items-center text-sm font-semibold leading-6 w-fit bg-smoke text-black float-right !mb-2"
                            >
                                Retake
                            </Button>
                        </div>
                    )}

                    {error && (
                        <p className="text-red-500 text-sm">{error.message}</p>
                    )}
                </div>
            )}
        />
    );
}
