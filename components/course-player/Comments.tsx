"use client";

import { FormEvent, useEffect, useState } from "react";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

type CommentItem = {
  id: string;
  name: string;
  date: string;
  text: string;
  image: string;
};
const starterComments: CommentItem[] = [
  {
    id: "student-1",
    name: "Student Name Goes Here",
    date: "Oct 10, 2021",
    text: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Pariatur explicabo tenetur excepturi rerum incidunt labore adipisci.",
    image: "https://randomuser.me/api/portraits/men/1.jpg",
  },
  {
    id: "student-2",
    name: "Student Name Goes Here",
    date: "Oct 15, 2021",
    text: "This lesson made the topic much easier to understand. Looking forward to the next one!",
    image: "https://randomuser.me/api/portraits/women/44.jpg",
  },
  {
    id: "student-3",
    name: "Student Name Goes Here",
    date: "Oct 19, 2021",
    text: "Clear explanations and useful examples. Thank you for sharing these course materials.",
    image: "https://randomuser.me/api/portraits/men/7.jpg",
  },
];

export default function Comments({ courseId }: { courseId: string }) {
  const key = `lms-comments-${courseId}`;
  const [comments, setComments] = useState<CommentItem[]>([]);
  const [draft, setDraft] = useState("");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(key);
    const savedComments = saved
      ? (JSON.parse(saved) as Partial<CommentItem>[]).map((comment, index) => ({
          ...comment,
          id:
            comment.id ?? `${comment.date ?? "saved"}-${comment.text ?? index}`,
          name: comment.name ?? "Student",
          date: comment.date ?? "",
          text: comment.text ?? "",
          image:
            comment.image ?? "https://randomuser.me/api/portraits/lego/1.jpg",
        }))
      : [];
    const all = [...savedComments, ...starterComments];
    const combined = [
      ...new Map(all.map((comment) => [comment.id, comment])).values(),
    ];
    queueMicrotask(() => {
      setComments(combined);
      setReady(true);
    });
  }, [key]);

  function submitComment(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const text = draft.trim();
    if (!text || !ready) return;
    const next = [
      {
        id: crypto.randomUUID(),
        name: "You",
        date: new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(
          new Date(),
        ),
        text,
        image: "https://randomuser.me/api/portraits/lego/1.jpg",
      },
      ...comments,
    ];
    setComments(next);
    localStorage.setItem(key, JSON.stringify(next));
    setDraft("");
  }

  return (
    <section>
      <h2 className="mb-4 mt-0 text-2xl font-semibold">Comments</h2>
      <div aria-live="polite" className="flex flex-col">
        {ready
          ? comments.map((comment) => (
              <article
                className="flex items-start gap-4 border-b border-[#eceef0] py-4 last:border-b-0"
                key={comment.id}
              >
                <Image
                  src={comment.image}
                  alt="Student profile"
                  width={48}
                  height={48}
                  className="h-12 w-12 shrink-0 rounded-full object-cover"
                  unoptimized
                />
                <div className="flex min-w-0 flex-col items-start">
                  <strong className="text-[13px] leading-snug font-semibold text-[#6c6c6c]">
                    {comment.name}
                  </strong>
                  <time className="mt-1 text-[11px] text-[#92939a]">
                    {comment.date}
                  </time>
                  <p className="mt-2 font-poppins text-xs leading-relaxed text-[#85858d]">
                    {comment.text}
                  </p>
                </div>
              </article>
            ))
          : null}
      </div>
      <form className="mt-3" onSubmit={submitComment}>
        <label className="sr-only" htmlFor="new-comment">
          Write a comment
        </label>
        <textarea
          className="block min-h-[150px] w-full resize-y rounded border-0 p-[18px] font-poppins text-xs text-[#5d6068] shadow-[0_0_26px_8px_rgb(0_0_0_/_4%)] outline-none placeholder:text-[#9a9ba2]"
          id="new-comment"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder="Write a comment"
          disabled={!ready}
        />
        <button
          className="mt-3 inline-flex items-center gap-2 rounded-[3px] bg-[#41b69d] px-4 py-3 text-[13px] font-medium text-white hover:bg-[#329c85] disabled:opacity-60"
          type="submit"
          disabled={!ready}
        >
          Submit Review <ArrowRight size={18} />
        </button>
      </form>
    </section>
  );
}
