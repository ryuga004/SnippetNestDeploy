import { Button } from "@/components/ui/button";
import { useClickOutside } from "@/hooks/onClickOutside";
import { useCloseOnEscape } from "@/hooks/onEscapeClose";
import { useCloseOnScroll } from "@/hooks/onScrollClose";
import { X } from "lucide-react";
import { ReactNode, useRef } from "react";

interface ModalProps {
  children: ReactNode;
  handleClose: () => void;
  className?: string;
  handleSubmit: (e: React.FormEvent) => void;
}

function CenterEditModal({
  handleClose,
  className,
  children,
  handleSubmit,
}: ModalProps) {
  const modalRef = useRef<HTMLDivElement | null>(null);
  useClickOutside(modalRef, handleClose);
  useCloseOnEscape(handleClose);
  useCloseOnScroll(handleClose);

  return (
    <div className="fixed inset-0 z-100 flex  items-center justify-center bg-black/50 backdrop-blur-sm">
      <div
        ref={modalRef}
        className={`relative w-[max-content] h-[max-content] mt-12  bg-white p-3 shadow-xl rounded-lg ${className}`}
      >
        <header>
          <button
            onClick={handleClose}
            className="absolute right-4 top-4 p-2 text-gray-500 hover:text-gray-800"
          >
            <X size={20} />
          </button>
        </header>
        <form onSubmit={handleSubmit}>
          <main>{children}</main>

          <footer className="flex justify-between mt-3">
            <Button
              variant="outline"
              onClick={handleClose}
              className="w-[150px] bg-red-500 hover:bg-red-700 text-white border-red-500"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="w-[150px] bg-blue-500 hover:bg-blue-600 text-white"
            >
              Save Changes
            </Button>
          </footer>
        </form>
      </div>
    </div>
  );
}

export default CenterEditModal;
