"use client";

import * as React from "react";
import { cn } from "@shared/utils/index";
import { cva } from "class-variance-authority";
import { X } from "lucide-react";
import { Dialog as DialogPrimitive } from "radix-ui";

const dialogContentVariants = cva(
  "flex flex-col fixed outline-0 z-50 border border-border bg-background p-8 shadow-lg shadow-black/5 duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 sm:rounded-lg",
  {
    variants: {
      // layout / behavior of the dialog
      variant: {
        default:
          "left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] w-full",
        fullscreen: "inset-5 w-full h-full",
      },
      // actual width sizing
      size: {
        sm: "max-w-sm",
        md: "max-w-md",
        lg: "max-w-lg",
        xl: "max-w-xl",
        "2xl": "max-w-2xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "lg",
    },
  }
);

const Dialog = React.forwardRef((props, ref) => {
  return <DialogPrimitive.Root ref={ref} data-slot="dialog" {...props} />;
});

function DialogTrigger({ ...props }) {
  return <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />;
}

const DialogPortal = React.forwardRef((props, ref) => {
  return (
    <DialogPrimitive.Portal ref={ref} data-slot="dialog-portal" {...props} />
  );
});

function DialogClose({ ...props }) {
  return <DialogPrimitive.Close data-slot="dialog-close" {...props} />;
}

const DialogOverlay = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <DialogPrimitive.Overlay
      ref={ref}
      data-slot="dialog-overlay"
      className={cn(
        "fixed inset-0 z-50 bg-black/30 [backdrop-filter:blur(4px)] data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
        className
      )}
      {...props}
    />
  );
});

const DialogContent = React.forwardRef(
  (
    {
      className,
      children,
      showCloseButton = true,
      overlay = true,
      variant,
      size, // 👈 NEW: size prop (sm | md | lg | xl | 2xl)
      ...props
    },
    ref
  ) => {
    return (
      <DialogPortal>
        {overlay && <DialogOverlay />}
        <DialogPrimitive.Content
          ref={ref}
          data-slot="dialog-content"
          className={cn(dialogContentVariants({ variant, size }), className)}
          {...props}
        >
          {children}
          {showCloseButton && (
            <DialogClose className="cursor-pointer outline-0 absolute end-8 top-8 rounded-sm opacity-60 ring-offset-background transition-opacity hover:opacity-100 focus:outline-hidden disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
              <X className="size-4" />
              <span className="sr-only">Close</span>
            </DialogClose>
          )}
        </DialogPrimitive.Content>
      </DialogPortal>
    );
  }
);

export default DialogContent;

const DialogHeader = ({ className, ...props }) => (
  <div
    data-slot="dialog-header"
    className={cn(
      "flex flex-col space-y-1 text-center sm:text-start mb-5",
      className
    )}
    {...props}
  />
);

const DialogFooter = ({ className, ...props }) => (
  <div
    data-slot="dialog-footer"
    className={cn(
      "flex flex-col-reverse sm:flex-row sm:justify-end pt-5 sm:space-x-2.5",
      className
    )}
    {...props}
  />
);

function DialogTitle({ className, ...props }) {
  return (
    <DialogPrimitive.Title
      data-slot="dialog-title"
      className={cn(
        "text-lg font-semibold leading-none tracking-tight",
        className
      )}
      {...props}
    />
  );
}

const DialogBody = ({ className, ...props }) => (
  <div data-slot="dialog-body" className={cn("grow", className)} {...props} />
);

function DialogDescription({ className, ...props }) {
  return (
    <DialogPrimitive.Description
      data-slot="dialog-description"
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  );
}

export {
  Dialog,
  DialogBody,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
};
