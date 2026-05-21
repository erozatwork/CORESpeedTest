import PropTypes from "prop-types";
import { useRef, useState, useEffect } from "react";
import { useFormContext, Controller, useWatch } from "react-hook-form";
import { Separator } from "@shared/components/ui/separator";

import SignatureCanvas from "react-signature-canvas";

import { Button } from "@shared/components/ui/button";
import { ThemeSettings } from "@shared/styles/theme/overrides/ThemeSettings";
import { PopOverComponent } from "@shared/components/_custom/popover/PopOver";
import { usePopoverState } from "@shared/components/_custom/popover/usePopOverState";
import { PlusCircle, ArrowUUpLeft, Eraser } from "@phosphor-icons/react";

RHFSignaturePad.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string,
  rules: PropTypes.object,
  hideActions: PropTypes.bool,
  base64: PropTypes.bool,
  savedSignatures: PropTypes.array,
  isLoadingSignatures: PropTypes.bool,
};

export default function RHFSignaturePad({
  name,
  label,
  rules = { required: "Signature is required." },
  hideActions = false,
  base64 = false,
  savedSignatures = [],
  isLoadingSignatures = false,
}) {
  const { settings } = ThemeSettings();
  const sigCanvasRef = useRef(null);
  const { control, setValue, clearErrors } = useFormContext();
  const [preview, setPreview] = useState(null);
  const [empty, setEmpty] = useState(true);

  const { popState, openPopover, closePopover } = usePopoverState();
  const popoverId = `saved-sig-popover-${name}`;

  const value = useWatch({ name, control });

  // Sync canvas with external value resets (e.g., when parent calls setValue(name, []))
  useEffect(() => {
    if (Array.isArray(value) && value.length === 0 && sigCanvasRef.current && !sigCanvasRef.current.isEmpty()) {
      sigCanvasRef.current.clear();
      setPreview(null);
      setEmpty(true);
    }
  }, [value]);

  const clear = () => {
    sigCanvasRef.current.clear();
    setValue(name, [], { shouldValidate: true });
    setPreview(null);
    setEmpty(true);
  };

  const undo = (onChange) => {
    if (sigCanvasRef.current) {
      const data = sigCanvasRef.current.toData();
      if (data.length > 0) {
        data.pop();
        sigCanvasRef.current.fromData(data);
        if (data.length === 0) {
          clear();
        } else if (hideActions) {
          save(onChange);
        }
      }
    }
  };

  const save = (onChange) => {
    if (!sigCanvasRef.current.isEmpty()) {
      const dataUrl = sigCanvasRef.current.toDataURL("image/png");

      const byteString = atob(dataUrl.split(",")[1]);
      const mimeString = dataUrl.split(",")[0].split(":")[1].split(";")[0];
      const ab = new ArrayBuffer(byteString.length);
      const ia = new Uint8Array(ab);

      for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }

      const file = new File([ab], "signature.png", { type: mimeString });

      clearErrors(name);
      setPreview(dataUrl);
      setEmpty(false);

      if (base64) {
        onChange([dataUrl]);
      } else {
        onChange([file]);
      }
    }
  };

  const handleSelectSaved = (sig, onChange) => {
    if (sigCanvasRef.current) {
      sigCanvasRef.current.clear();
      sigCanvasRef.current.fromDataURL(sig);
    }
    setPreview(sig);
    setEmpty(false);
    if (base64) {
      onChange([sig]);
    } else {
      onChange([sig]);
    }
    closePopover(popoverId);
  };

  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <div className="space-y-2 w-full">
          {label && <label className="text-sm font-semibold">{label}</label>}
          {!hideActions && (
            <div className="mb-5">
              <h6 className="text-dark text-md font-medium">
                Electronic Signature / Acknowledgement.
              </h6>
              <p className="text-sm text-gray-600 ">
                By providing an electronic confirmation or acknowledgement, each
                party agrees that it constitutes an effective original signature
                for all purposes under this document and may be used with the same
                effect as a manually signed original.
              </p>
              <Separator className="my-5" />
            </div>
          )}
          <SignatureCanvas
            ref={sigCanvasRef}
            penColor={settings?.themeMode === "dark" ? "white" : "black"}
            onEnd={() => { if (hideActions) save(onChange); }}
            canvasProps={{
              height: hideActions ? 300 : 360,
              className: `signature-canvas border rounded-lg w-full border-[#0000003B] dark:border-[#2A2F36] dark:bg-gray-100 ${error && "border-dashed border-2 border-red-500"
                }`,
            }}
          />
          {error && (
            <p className="text-xs text-red-500 mt-1">{error.message}</p>
          )}

          <div className="flex flex-row justify-between items-center gap-2 !mb-2 mt-2">
            <div>
              <button
                type="button"
                onClick={(e) => openPopover(popoverId, e.currentTarget)}
                className="flex items-center gap-2 group transition-all duration-200"
              >
                <div className="p-1 rounded-full bg-blue-50 group-hover:bg-blue-100 text-blue-500 transition-colors border border-blue-100 shadow-sm">
                  <PlusCircle size={20} weight="duotone" />
                </div>
                <span className="text-[11px] font-bold tracking-wide uppercase text-blue-600/80 group-hover:text-blue-600">
                  Use Saved Signature
                </span>
              </button>

              <PopOverComponent
                open={popState[popoverId]?.isOpen}
                anchorEl={popState[popoverId]?.anchorEl}
                onClose={() => closePopover(popoverId)}
                width={280}
              >
                <div className="p-3 bg-white dark:bg-zinc-900 border-b border-gray-100 dark:border-zinc-800">
                  <h6 className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                    Select a Signature
                  </h6>
                </div>
                <div className="p-2 grid grid-cols-1 gap-2 max-h-60 overflow-y-auto bg-gray-50/50 dark:bg-zinc-900/50">
                  {isLoadingSignatures ? (
                    <div className="p-4 text-center">
                      <div className="inline-block w-5 h-5 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
                      <p className="text-[11px] text-gray-400 uppercase font-medium tracking-tight mt-2">
                        Loading...
                      </p>
                    </div>
                  ) : savedSignatures?.length > 0 ? (
                    savedSignatures.map((sig, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleSelectSaved(sig, onChange)}
                        className="p-2 border border-gray-200 dark:border-zinc-800 rounded-lg hover:border-blue-400 hover:bg-white dark:hover:bg-zinc-800 transition-all group overflow-hidden bg-white dark:bg-zinc-900"
                      >
                        <img
                          src={sig}
                          alt={`Saved ${idx}`}
                          className="w-full h-12 object-contain group-hover:scale-105 transition-transform"
                        />
                      </button>
                    ))
                  ) : (
                    <div className="p-4 text-center">
                      <p className="text-[11px] text-gray-400 uppercase font-medium tracking-tight">
                        No saved signatures found
                      </p>
                    </div>
                  )}
                </div>
              </PopOverComponent>
            </div>

            <div className="flex items-center gap-6">
              <button
                type="button"
                onClick={() => undo(onChange)}
                className="text-amber-600 hover:text-amber-700 font-bold text-[11px] uppercase tracking-wider transition-colors"
              >
                Undo
              </button>
              <button
                type="button"
                onClick={clear}
                className="text-[#E11D48] hover:text-[#BE123C] font-bold text-[11px] uppercase tracking-wider transition-colors"
              >
                Clear
              </button>
            </div>
          </div>

            {!hideActions && (
              <div className="flex flex-row gap-2">
                <Button
                  type="button"
                  onClick={clear}
                  className="bg-smoke text-black text-sm font-semibold"
                >
                  Clear Signature
                </Button>
                <Button
                  type="button"
                  onClick={() => save(onChange)}
                  className="text-white text-sm font-semibold"
                >
                  Save Signature
                </Button>
              </div>
            )}
        </div>
      )}
    />
  );
}
