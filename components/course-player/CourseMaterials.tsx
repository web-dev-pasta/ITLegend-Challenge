import { BookOpen, Clock3, Globe2, GraduationCap } from "lucide-react";
import type { Course } from "@/lib/course-data";

export default function CourseMaterials({ course }: { course: Course }) {
  const details = [
    { label: "Duration", value: course.duration, icon: Clock3 },
    {
      label: "Lessons",
      value: `${course.groups.flatMap((group) => group.lessons).length} lessons`,
      icon: BookOpen,
    },
    { label: "Enrolled", value: course.students, icon: GraduationCap },
    { label: "Language", value: course.language, icon: Globe2 },
    { label: "Level", value: course.level, icon: GraduationCap },
    { label: "Category", value: course.category, icon: BookOpen },
    { label: "Certificate", value: "Included", icon: GraduationCap },
    { label: "Access", value: "Lifetime", icon: Globe2 },
  ];

  return (
    <section>
      <h2 className="mb-4 mt-0 text-2xl font-semibold">Course Materials</h2>
      <div className="grid grid-flow-col grid-cols-2 grid-rows-4 gap-x-4 rounded-[3px] bg-white px-3 py-2 shadow-[0_0_30px_10px_rgb(0_0_0_/_4%)] sm:gap-x-16 sm:px-5">
        {details.map(({ label, value, icon: Icon }, index) => (
          <div
            className={`flex min-w-0 min-h-[43px] items-center justify-between gap-2 border-b border-[#eceef0] text-[10px] sm:text-xs ${index === 3 || index === 7 ? "border-b-0" : ""}`}
            key={label}
          >
            <span className="flex items-center gap-1.5 whitespace-nowrap text-[#686b74] sm:gap-2">
              <Icon className="shrink-0 text-[#5c606c]" size={15} />
              {label}:
            </span>
            <strong className="text-right text-[9px] font-medium sm:text-[11px]">
              {value}
            </strong>
          </div>
        ))}
      </div>
    </section>
  );
}
