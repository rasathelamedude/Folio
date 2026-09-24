import { useEffect, useRef, type Dispatch, type SetStateAction } from "react";
import { Link } from "react-router-dom";

interface NotLoggedInAlertModalProps {
  setIsNotLoggedIn: Dispatch<SetStateAction<boolean>>;
}

const NotLoggedInAlertModal = ({
  setIsNotLoggedIn,
}: NotLoggedInAlertModalProps) => {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;

    dialog?.showModal();

    return () => dialog?.close();
  }, []);

  const handleClose = () => {
    setIsNotLoggedIn(false);
  };

  return (
    <dialog
      ref={dialogRef}
      aria-label="Sign in required"
      onCancel={(event) => {
        event.preventDefault();
        handleClose();
      }}
      className="fixed inset-0 m-auto w-[calc(100%-2rem)] max-w-sm
        rounded-2xl border border-secondary bg-background p-6
        text-foreground shadow-xl backdrop:bg-foreground/50
        backdrop:backdrop-blur-sm"
    >
      <h2 className="font-serif text-2xl text-primary">
        Join the conversation
      </h2>

      <p className="mt-3 text-sm leading-relaxed text-foreground/75">
        Sign in to share your thoughts and connect with other readers.
      </p>

      <div className="mt-6 flex justify-end gap-3">
        <button
          type="button"
          onClick={handleClose}
          className="rounded-xl bg-secondary px-4 py-2.5 text-sm
            font-medium hover:bg-secondary/70"
        >
          Maybe later
        </button>

        <Link
          to="/login"
          onClick={handleClose}
          className="rounded-xl bg-primary px-4 py-2.5 text-sm
            font-medium text-background hover:bg-foreground"
        >
          Sign in
        </Link>
      </div>
    </dialog>
  );
};

export default NotLoggedInAlertModal;
