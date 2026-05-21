import { forwardRef } from "react";
import { modalVariant } from "./variant";

import { cn } from "@shared/utils/utils";

// Forwarding ref to ensure this component can hold a ref

const ModalContent = forwardRef(
  ({ className, children, tabIndex = -1, maxWidth, props }, ref) => {
    return (
      <div
        ref={ref}
        tabIndex={tabIndex}
        className={cn(
          modalVariant({
            maxWidth,
          }),
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
export { ModalContent };
