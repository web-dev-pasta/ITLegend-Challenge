import PlayerExperience from "@/components/course-player/PlayerExperience";

type CourseDetailsPageProps = {
  searchParams: Promise<{ course?: string; lesson?: string }>;
};

export default async function CourseDetailsPage({
  searchParams,
}: CourseDetailsPageProps) {
  const { course, lesson } = await searchParams;
  return <PlayerExperience initialCourseId={course} initialLessonId={lesson} />;
}
