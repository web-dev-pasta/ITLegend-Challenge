export type LessonType = "video" | "attachment" | "quiz";

export type Lesson = {
  id: string;
  title: string;
  type: LessonType;
  videoUrl?: string;
  thumbnailUrl?: string;
  attachmentUrl?: string;
};

export type Course = {
  id: string;
  title: string;
  description: string;
  instructor: string;
  image: string;
  category: string;
  level: string;
  duration: string;
  students: string;
  language: string;
  groups: { title: string; description: string; lessons: Lesson[] }[];
};

const videoLessons = [
  {
    id: "css-overflow",
    title: "CSS Overflow Tutorial",
    videoUrl:
      "https://res.cloudinary.com/dwcxvcjrr/video/upload/v1790987883/CSS-Overflow-Tutorial-One-Minute-Coding_001_1080p_jiahxy.mp4",
  },
  {
    id: "css-transitions",
    title: "CSS Transitions Tutorial",
    videoUrl:
      "https://res.cloudinary.com/dwcxvcjrr/video/upload/v1790987886/CSS-Transitions-Tutorial-One-Minute-Coding_001_1080p_l9civx.mp4",
  },
  {
    id: "javascript-variables",
    title: "JavaScript Variables: var, let and const",
    videoUrl:
      "https://res.cloudinary.com/dwcxvcjrr/video/upload/v1790987874/JavaScript_Variables_Tutorial_-_ES6_var_let_const_xh02us.mp4",
  },
  {
    id: "css-border-radius",
    title: "CSS Border Radius Tutorial",
    videoUrl:
      "https://res.cloudinary.com/dwcxvcjrr/video/upload/v1790990837/CSS_Border_Radius_-_One_Minute_Coding_plzcji.mp4",
  },
  {
    id: "css-borders",
    title: "CSS Borders Tutorial",
    videoUrl:
      "https://res.cloudinary.com/dwcxvcjrr/video/upload/v1790990874/CSS_Borders_-_One_Minute_Coding_yewftt.mp4",
  },
  {
    id: "css-tricks",
    title: "7 CSS Tricks That Will Blow Your Mind",
    videoUrl:
      "https://res.cloudinary.com/dwcxvcjrr/video/upload/v1791033145/7_CSS_Tricks_That_Will_Blow_Your_Mind_bbumrh.mp4",
  },
].map((video) => ({
  ...video,
  type: "video" as const,
  thumbnailUrl: video.videoUrl
    .replace("/video/upload/", "/video/upload/so_1,w_750/")
    .replace(/\.mp4$/, ".jpg"),
}));

const practicePdf =
  "https://3l68buh0b9.ufs.sh/f/qc1LuNydMVsNDgteNyv5C0kQ1NgKLp6IlyJDbenRTEc34dmt";

const courseVideoOrders: Record<string, string[]> = {
  seo: ["css-border-radius", "css-overflow"],
  css: [
    "css-overflow",
    "css-transitions",
    "css-border-radius",
    "css-borders",
    "css-tricks",
  ],
  javascript: ["javascript-variables", "css-tricks", "css-transitions"],
  design: ["css-borders", "css-border-radius", "css-tricks", "css-overflow"],
  react: ["javascript-variables", "css-transitions"],
  marketing: ["css-tricks", "css-overflow", "css-borders"],
};

function courseLessons(topic: string): Lesson[][] {
  const lessons = (courseVideoOrders[topic] ?? courseVideoOrders.css).map(
    (id) => {
      const video = videoLessons.find((item) => item.id === id)!;
      return { ...video, id: `${topic}-${video.id}` };
    },
  );
  const splitAt = Math.min(3, Math.ceil(lessons.length / 2));
  const firstGroup = lessons.slice(0, splitAt);
  const secondGroup = lessons.slice(splitAt);
  return [
    [
      ...firstGroup,
      {
        id: `${topic}-reference-files`,
        title: "Download the course reference sheet",
        type: "attachment",
        attachmentUrl: practicePdf,
      },
      { id: `${topic}-quiz`, title: "Course Quiz", type: "quiz" },
    ],
    [
      ...secondGroup,
      {
        id: `${topic}-practice-files`,
        title: "Practice files",
        type: "attachment",
        attachmentUrl: practicePdf,
      },
    ],
  ];
}

const catalog = [
  {
    id: "css-essentials",
    title: "CSS Essentials: Layout & Motion",
    category: "Web Development",
    instructor: "Alex Morgan",
    description:
      "Build expressive, responsive interfaces with modern CSS layout and animation.",
    image:
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=900&q=80",
    topic: "css",
    level: "Beginner",
    duration: "4 weeks",
    students: "128 students",
  },
  {
    id: "seo-home",
    title: "Starting SEO as your Home",
    category: "SEO",
    instructor: "Sarah Johnson",
    description:
      "Learn the foundations of search engine optimization and grow your online presence.",
    image:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=900&q=80",
    topic: "seo",
    level: "Beginner",
    duration: "3 weeks",
    students: "65 students",
  },
  {
    id: "javascript-foundations",
    title: "JavaScript Foundations",
    category: "Programming",
    instructor: "Daniel Kim",
    description:
      "Understand JavaScript fundamentals and write your first useful programs.",
    image:
      "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=900&q=80",
    topic: "javascript",
    level: "Beginner",
    duration: "5 weeks",
    students: "214 students",
  },
  {
    id: "ui-design",
    title: "UI Design Fundamentals",
    category: "Design",
    instructor: "Maya Chen",
    description: "Turn product ideas into clear, polished user interfaces.",
    image:
      "https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=900&q=80",
    topic: "design",
    level: "Beginner",
    duration: "3 weeks",
    students: "96 students",
  },
  {
    id: "react-apps",
    title: "Build Apps with React",
    category: "Web Development",
    instructor: "Omar Hassan",
    description:
      "Create interactive applications with reusable React components.",
    image:
      "https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=900&q=80",
    topic: "react",
    level: "Intermediate",
    duration: "6 weeks",
    students: "182 students",
  },
  {
    id: "digital-marketing",
    title: "Digital Marketing Basics",
    category: "Marketing",
    instructor: "Emma Wilson",
    description:
      "Plan campaigns, reach the right audience, and measure what works.",
    image:
      "https://images.unsplash.com/photo-1432888622747-4eb9a8efeb07?auto=format&fit=crop&w=900&q=80",
    topic: "marketing",
    level: "Beginner",
    duration: "4 weeks",
    students: "143 students",
  },
];

export const courses: Course[] = catalog.map((item) => {
  const [firstGroup, secondGroup] = courseLessons(item.topic);
  const videoCount = (courseVideoOrders[item.topic] ?? []).length;
  return {
    ...item,
    language: "English",
    groups: [
      {
        title: "Course content",
        description: `${videoCount} lessons, course files and a quiz.`,
        lessons: firstGroup,
      },
      ...(secondGroup.length > 1
        ? [
            {
              title: "More to explore",
              description: "More videos and practice files.",
              lessons: secondGroup,
            },
          ]
        : []),
    ],
  };
});

const QuizQuestions = [
  {
    prompt: "Which property controls how overflowing content is displayed?",
    options: ["display", "overflow", "position", "visibility"],
  },
  {
    prompt: "Which value allows content to scroll when it does not fit?",
    options: ["hidden", "clip", "scroll", "none"],
  },
  {
    prompt: "What does overflow: hidden do?",
    options: [
      "Adds a scrollbar",
      "Clips content outside the box",
      "Expands the element",
      "Moves content behind",
    ],
  },
  {
    prompt: "Which axis is controlled by overflow-y?",
    options: ["Horizontal", "Vertical", "Both axes", "Neither axis"],
  },
  {
    prompt: "Which element can contain independently scrolling content?",
    options: [
      "An element with a constrained height",
      "An element with no content",
      "A static image only",
      "The document title",
    ],
  },
];

export const getQuizQuestions = () => QuizQuestions;

export function getCourse(courseId: string | null | undefined): Course {
  return courses.find((course) => course.id === courseId) ?? courses[0];
}
