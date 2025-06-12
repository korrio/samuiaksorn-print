/* eslint-disable @typescript-eslint/no-empty-object-type */
// components/ui/dialog.d.ts
import * as React from "react"

interface DialogProps {
  children: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

interface DialogContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

interface DialogHeaderProps extends React.HTMLAttributes<HTMLDivElement> {}

interface DialogTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {}

interface DialogDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {}

interface DialogFooterProps extends React.HTMLAttributes<HTMLDivElement> {}

interface DialogTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  asChild?: boolean;
}

interface DialogPortalProps {
  children: React.ReactNode;
}

interface DialogOverlayProps extends React.HTMLAttributes<HTMLDivElement> {}

export declare const Dialog: React.FC<DialogProps>;
export declare const DialogContent: React.ForwardRefExoticComponent<DialogContentProps & React.RefAttributes<HTMLDivElement>>;
export declare const DialogHeader: React.FC<DialogHeaderProps>;
export declare const DialogTitle: React.ForwardRefExoticComponent<DialogTitleProps & React.RefAttributes<HTMLHeadingElement>>;
export declare const DialogDescription: React.ForwardRefExoticComponent<DialogDescriptionProps & React.RefAttributes<HTMLParagraphElement>>;
export declare const DialogFooter: React.FC<DialogFooterProps>;
export declare const DialogTrigger: React.ForwardRefExoticComponent<DialogTriggerProps & React.RefAttributes<HTMLButtonElement>>;
export declare const DialogPortal: React.FC<DialogPortalProps>;
export declare const DialogOverlay: React.ForwardRefExoticComponent<DialogOverlayProps & React.RefAttributes<HTMLDivElement>>;