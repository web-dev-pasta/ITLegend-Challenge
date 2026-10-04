import { Download, ExternalLink, X } from "lucide-react";
import type { Lesson } from "@/lib/course-data";

export default function AttachmentModal({
  lesson,
  onClose,
}: {
  lesson: Lesson;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-[#161a4294] p-3 sm:p-5"
      role="dialog"
      aria-modal="true"
      aria-label={lesson.title}
      onClick={onClose}
    >
      <section
        className="flex h-[86dvh] w-full max-w-[850px] flex-col overflow-hidden rounded-lg bg-white shadow-[0_18px_65px_#14192340]"
        onClick={(event) => event.stopPropagation()}
      >
        <header className="flex items-center justify-between border-b border-[#e8e9ec] px-5 py-4">
          <div>
            <span className="font-poppins text-[9px] tracking-[.1em] text-[#40aa91]">
              COURSE MATERIAL
            </span>
            <h2 className="mb-0 mt-1 text-[17px] font-semibold">
              {lesson.title}
            </h2>
          </div>
          <button
            className="bg-transparent p-1 text-[#555862]"
            onClick={onClose}
            aria-label="Close attachment"
          >
            <X size={21} />
          </button>
        </header>
        <iframe
          className="w-full flex-1 border-0 bg-[#f2f3f6]"
          title={`${lesson.title} PDF`}
          src={lesson.attachmentUrl}
        />
        <footer className="flex justify-between px-5 py-3">
          <a
            className="inline-flex items-center gap-2 text-xs text-[#485293]"
            href={lesson.attachmentUrl}
            download
          >
            <Download size={17} /> Download PDF
          </a>
          <a
            className="inline-flex items-center gap-2 text-xs text-[#485293]"
            href={lesson.attachmentUrl}
            target="_blank"
            rel="noreferrer"
          >
            Open in new tab <ExternalLink size={16} />
          </a>
        </footer>
      </section>
    </div>
  );
}
