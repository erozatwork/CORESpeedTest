import { forwardRef, useMemo } from "react";
import { isValidElementType } from "react-is";
import * as PhosphorIcons from "@phosphor-icons/react";
import clsx from "clsx";

import { useSettings } from "@app/providers";

export const CoreIcons = forwardRef(
  ({ icon, style, className = "", ...props }, ref) => {
    const { settings } = useSettings();

    if (!style) {
      style = settings.coreIconsStyle;
    }

    return (
      <i
        ref={ref}
        {...props}
        className={clsx(`oc-${style}`, `oc-${icon}`, className)}
      />
    );
  }
);

export const RenderCoreIcon = ({ name, ...props }) => {
  const Icon = useMemo(() => PhosphorIcons[name], [name]);

  if (!isValidElementType(Icon)) {
    console.warn(`Invalid icon: "${name}"`);
    return null;
  }

  return <Icon {...props} />;
};
