import { forwardRef } from "react";

import { cva } from "class-variance-authority";
import { cn } from "@shared/utils/utils";

const Main = forwardRef(function Main(
  {
    defaultThemeLayout = "horizontal",
    className,
    children,
    footer,
    breadCrumbs,
    ...props
  },
  ref
) {
  const types = cva("flex flex-col flex-1 overflow-y-auto gap-3", {
    variants: {
      layout: {
        horizontal: "p-2",
        mini: "card p-2 mx-2 mt-2",
      },
    },
    defaultVariants: {
      layout: "horizontal",
    },
  });

  return (
    <div
      ref={ref}
      className={cn(
        "wrapper flex flex-col flex-1 min-h-screen overflow-y-auto bg-[#f8fafc]"
      )}
    >
      {breadCrumbs}
      <main
        className={cn(types({ layout: defaultThemeLayout }), className)}
        {...props}
      >
        {children}
      </main>
      {footer}
    </div>
  );
});

export { Main };
