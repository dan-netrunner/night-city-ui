import { useEffect, useId, useRef, type ReactNode } from "react";
import { Button } from "./Button";

export type ModalProps = {
  open: boolean;
  onClose: () => void;
  title: ReactNode;
  kicker?: string;
  children: ReactNode;
  footer?: ReactNode;
};

export function Modal({
  open,
  onClose,
  title,
  kicker,
  children,
  footer,
}: ModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog || !open) return;
    const onCancel = (event: Event) => {
      event.preventDefault();
      onClose();
    };
    dialog.addEventListener("cancel", onCancel);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      dialog.removeEventListener("cancel", onCancel);
      document.body.style.overflow = previous;
    };
  }, [open, onClose]);

  return (
    <dialog
      ref={dialogRef}
      className="cp-modal"
      aria-labelledby={titleId}
      onClick={(event) => {
        if (event.target === dialogRef.current) onClose();
      }}
    >
      <div className="cp-modal__head">
        <div className="cp-panel__heading">
          {kicker && <div className="cp-panel__kicker">{kicker}</div>}
          <h2 className="cp-modal__title" id={titleId}>
            {title}
          </h2>
        </div>
        <Button variant="ghost" size="sm" aria-label="Close dialog" onClick={onClose}>
          ×
        </Button>
      </div>
      <div className="cp-modal__body">{children}</div>
      {footer && <div className="cp-modal__foot">{footer}</div>}
    </dialog>
  );
}
