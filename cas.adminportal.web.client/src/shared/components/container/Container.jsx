import clsx from "clsx";
import { useSettings } from "@app/providers";

const Container = ({ children, width, className = "" }) => {
  const { settings } = useSettings();
  const { container } = settings;
  const widthMode = width ?? container;
  return (
    <div
      className={clsx(
        className,
        widthMode === "fixed" ? "container-fluid" : "container-fluid"
      )}
    >
      {children}
    </div>
  );
};

export { Container };
