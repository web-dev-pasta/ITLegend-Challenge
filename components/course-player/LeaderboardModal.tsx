import { X } from "lucide-react";

const learners = [
  { name: "Ahmed Mohamed", percent: 96 },
  { name: "Mariam Ali", percent: 86 },
  { name: "Omar Hassan", percent: 72 },
  { name: "Nour Adel", percent: 55 },
  { name: "Youssef Samir", percent: 43 },
];

function getProgressMessage(percent: number) {
  if (percent === 100)
    return "أحسنت يا صديقي.. أنهيت الكورس بالكامل! اسمك يستحق مكانه في الليدر بورد.";
  if (percent >= 60)
    return `عظيم يا صديقي.. أداؤك في الكورس ده أفضل من ${percent}% من باقي الطلبة.. كمّل عايز أشوف اسمك في الليدر بورد هنا`;
  if (percent >= 30)
    return `بداية قوية! أنجزت ${percent}% من الكورس. كمّل الدروس والاختبار عشان تتقدم في الليدر بورد.`;
  return `رحلتك بدأت! أنجزت ${percent}% من الكورس. ابدأ بالفيديوهات والاختبار عشان يظهر تقدمك في الليدر بورد.`;
}

export default function LeaderboardModal({
  courseTitle,
  percent,
  onClose,
}: {
  courseTitle: string;
  percent: number;
  onClose: () => void;
}) {
  const ranking = [
    ...learners,
    { name: "You", percent, isCurrentUser: true },
  ].sort((first, second) => second.percent - first.percent);

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-[#151a3b99] p-0 sm:p-5"
      role="dialog"
      aria-modal="true"
      aria-label="Course leaderboard"
      onClick={onClose}
    >
      <section
        className="flex h-full w-full flex-col overflow-y-auto rounded-[14px] border border-[#e8eae8] bg-white px-6 pb-6 pt-4 sm:h-auto sm:max-h-[94dvh] sm:max-w-[410px]"
        onClick={(event) => event.stopPropagation()}
      >
        <header className="relative text-center text-[#080264]">
          <button
            className="absolute right-0 top-0 grid h-8 w-8 place-items-center rounded-full text-[#626570] hover:bg-[#f5f9fa]"
            onClick={onClose}
            aria-label="Close leaderboard"
          >
            <X size={18} />
          </button>
          <p className="mb-1 mt-0 text-[15px] leading-7">{courseTitle}</p>
          <h2 className="mb-0 mt-0 text-[15px] font-bold leading-7">
            Leaderboard
          </h2>
        </header>
        <p
          className="mt-6 rounded-[5px] bg-[#f5f9fa] px-5 py-2 text-right text-[14px] leading-7 text-[#182578]"
          dir="rtl"
        >
          {getProgressMessage(percent)}
        </p>
        <div className="mt-5 flex flex-1 flex-col gap-5 rounded-[27px] bg-[#f5f9fa] px-6 py-6">
          {ranking.map((learner, index) => (
            <div
              className={`flex min-h-[67px] items-center justify-between rounded-[5px] border border-black/10 bg-white px-4 ${"isCurrentUser" in learner && learner.isCurrentUser ? "border-[#41b69d] ring-1 ring-[#41b69d]" : ""}`}
              key={learner.name}
            >
              <span className="flex items-center gap-3 text-sm text-[#303044]">
                <span className="grid h-8 w-8 place-items-center rounded-full bg-[#eff1fc] text-xs font-semibold text-[#485293]">
                  {index + 1}
                </span>
                {learner.name}
              </span>
              <span className="text-xs font-semibold text-[#777982]">
                {learner.percent}%
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
