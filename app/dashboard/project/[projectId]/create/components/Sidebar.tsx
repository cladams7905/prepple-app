"use client";

import LoadingDots from "@/components/shared/loadingdots";
import { showToastError } from "@/components/shared/showToast";
import { checkStringLength } from "@/lib/actions";
import { createUserToast } from "@/lib/actions/userToasts";
import { Tables } from "@/lib/supabase/types";
import { Check, CirclePlus } from "lucide-react";
import {
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
  useTransition,
} from "react";
import TemplateModal from "./TemplateModal";
import { ToastType } from "@/lib/enums";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";

export default function Sidebar({
  userToasts,
  project,
  activeToast,
  setActiveToast,
  setCurrentToasts,
  toastType,
  setToastType,
}: {
  userToasts: Tables<"UserToasts">[];
  project: Tables<"Projects">;
  activeToast: Tables<"UserToasts"> | undefined;
  setActiveToast: Dispatch<SetStateAction<Tables<"UserToasts"> | undefined>>;
  setCurrentToasts: Dispatch<SetStateAction<Tables<"UserToasts">[]>>;
  toastType: ToastType | undefined;
  setToastType: Dispatch<SetStateAction<ToastType | undefined>>;
}) {
  const [isPending, startTransition] = useTransition();
  const templateModalRef = useRef<HTMLDialogElement>(null);

  const handleCreateToast = () => {
    startTransition(async () => {
      const { data, error } = await createUserToast({
        title: getToastTitle(),
        event_type: "",
        project_id: project.id,
      });
      if (error) {
        showToastError(error);
      } else {
        setCurrentToasts((prevToasts) => [...prevToasts, data]);
        setActiveToast(data);
        templateModalRef.current?.showModal();
      }
    });
  };

  const getToastTitle = () => {
    let title = "New Toast";
    let count = 0;
    userToasts.forEach((toast) => {
      if (toast.title?.includes("New Toast")) {
        count++;
      }
    });
    userToasts.forEach((toast) => {
      const match = toast.title?.match(/\d/);
      if (match) {
        const num = parseInt(match[0]);
        if (num >= count) {
          count = num + 1;
        }
      }
    });
    if (count > 0) {
      title = `New Toast (${count})`;
    }
    return title;
  };

  useEffect(() => {
    if (activeToast) {
      setCurrentToasts((prevToasts) =>
        prevToasts.map((toast) =>
          toast.id === activeToast.id ? { ...toast, ...activeToast } : toast
        )
      );
    }
  }, [activeToast]);

  const sortedToasts = userToasts.sort((a, b) => {
    const titleA = a.title || "";
    const titleB = b.title || "";
    return titleA.localeCompare(titleB);
  });

  return (
    <div className="flex flex-col join-item rounded-none bg-white relative h-full p-4 border-r border-neutral shadow-lg z-[3]">
      <div
        className="btn btn-primary border border-neutral hover:border-neutral w-full"
        onClick={() => handleCreateToast()}
      >
        {isPending ? (
          <LoadingDots color="oklch(var(--bc))" size="sm" />
        ) : (
          <>
            <CirclePlus height={18} width={18} />
            New Toast
          </>
        )}
      </div>
      <TemplateModal
        templateModalRef={templateModalRef}
        toastType={toastType}
        setToastType={setToastType}
        activeToast={activeToast}
        setActiveToast={setActiveToast}
      />
      <div className="mt-4">
        <div className="text-sm ml-2 font-semibold">
          My Toasts ({userToasts.length})
        </div>
        <ul className="menu px-0 py-2 mt-2 overflow-y-scroll flex-nowrap max-h-[75vh] flex flex-col gap-3">
          {sortedToasts.map((toast, i) => (
            <li
              key={i}
              className={`flex gap-2 rounded-lg border border-neutral ${
                activeToast?.id === toast.id && `bg-link-hover`
              }`}
            >
              <a
                className="flex w-full items-center cursor-pointer justify-between"
                onClick={() => {
                  setActiveToast(toast);
                }}
              >
                <div>
                  <p>{checkStringLength(toast.title)}</p>
                  {toast.event_type === "" ? (
                    <div className="flex items-center gap-1">
                      <p className="text-sm text-error">No Event Selected</p>
                      <ExclamationTriangleIcon color="oklch(var(--er))" />
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">{toast.event_type}</p>
                  )}
                </div>
                {activeToast?.id === toast.id && (
                  <Check color="oklch(var(--bc))" height={22} width={22} />
                )}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
