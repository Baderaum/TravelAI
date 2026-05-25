"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";

type AskDialogResult =
  | "yes"
  | "no"
  | "closed";

type Props = {
  open: boolean;
  question: string;
  title?: string;
  yesLabel?: string;
  noLabel?: string;
  loading?: boolean;
  onAnswer: (result: AskDialogResult) => void;
};

export default function AskDialog({
  open,
  question,
  title = "Are you sure?",
  yesLabel = "Yes",
  noLabel = "No",
  loading = false,
  onAnswer,
}: Props) {
  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        if (!value) {
          onAnswer("closed");
        }
      }}
    >
      <DialogContent className="w-full !max-w-md rounded-[32px] border border-white/10 bg-black p-0 text-white shadow-[0_0_80px_rgba(255,255,255,0.08)]">
        <div className="p-7">
          <DialogTitle className="text-2xl font-semibold">
            {title}
          </DialogTitle>

          <DialogDescription className="mt-4 text-base leading-7 text-neutral-400">
            {question}
          </DialogDescription>

          <div className="mt-8 flex gap-3">
            <button
              onClick={() => onAnswer("no")}
              disabled={loading}
              className="flex-1 rounded-2xl border border-white/10 bg-white/5 px-5 py-3 font-medium text-white transition hover:bg-white/10 disabled:opacity-50"
            >
              {noLabel}
            </button>

            <button
              onClick={() => onAnswer("yes")}
              disabled={loading}
              className="flex-1 rounded-2xl bg-white px-5 py-3 font-medium text-black transition hover:bg-neutral-200 disabled:opacity-50"
            >
              {loading ? "Loading..." : yesLabel}
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}