# ITLegend FE Challenge

**Live demo:** [it-legend-challenge.vercel.app/courses](https://it-legend-challenge.vercel.app/courses)

## Pages and routes

| Page          | Route                     |
| ------------- | ------------------------- |
| Home          | `/`                       |
| Courses       | `/courses`                |
| Course player | `/courses/course-details` |

The course player folder is named `course-details`, using **kebab-case**: lowercase words separated by hyphens. This keeps the URL readable and consistent with the project's route naming style, also makes it ready for beautify using `BeautifyPathName` funciton, it's the main funciton in `show-path-name.tsx`.

## How course content is organized

Course content is defined in one place: `lib/course-data.ts`. The pages and player read from this data instead of maintaining separate copies.

The data is assembled in this order:

1. **`videoLessons`** stores each video once, with its ID, title, and Cloudinary URL. A thumbnail URL is derived from the video URL.
2. **`courseVideoOrders`** maps a course topic to an ordered list of video IDs. This lets courses reuse videos while showing them in different orders.
3. **`catalog`** stores the course details shown in the catalog, such as title, description, instructor, image, and topic.
4. **`courseLessons(topic)`** looks up the topic's videos, gives each lesson a course-specific ID, splits the videos into groups, and adds the course attachment and quiz.
5. **`courses`** combines each catalog entry with its generated lesson groups. `getCourse(courseId)` finds a course by ID and falls back to the first course if no match is found.

To add a course, add its course details to `catalog`, create a matching topic entry in `courseVideoOrders`, and add any new videos to `videoLessons`. The `topic` value in `catalog` must match the key in `courseVideoOrders`.

Lessons have one of three types: `video`, `attachment`, or `quiz`.

## How progress works

Progress is stored in the browser's `localStorage` under `lms-progress`. The saved value is a JSON object keyed by course ID. Each course entry contains:

- `completed`: IDs of completed videos and quizzes.
- `current`: the ID of the lesson the learner last selected or should continue from.

Example:

```json
{
  "css-essentials": {
    "completed": ["css-css-overflow"],
    "current": "css-css-transitions"
  }
}
```

When a learner starts a course for the first time, the first lesson is saved as `current`. Selecting another lesson updates `current` and the URL. Completing a video or submitting a quiz adds its lesson ID to `completed`. When a video ends, the player marks it complete and saves the next video as the current lesson.

The progress percentage is calculated from videos and quizzes. The catalog uses that percentage for the progress bar. Selecting **Continue** opens the saved `current` lesson. A new course starts at its first lesson.

## Other data saved in the browser

The project uses `localStorage` for learner data.

| Key                            | Saved data                                                                                                                                   |
| ------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------- |
| `lms-progress`                 | Current lesson and completed lesson IDs for each course.                                                                                     |
| `lms-comments-{courseId}`      | Comments for a specific course.                                                                                                              |
| `lms-quiz-{courseId}-{quizId}` | Quiz start time, selected answers, and submission status. The timer is based on the saved start time, so closing the quiz does not pause it. |
| `lms-video-durations`          | Video durations, keyed by video URL, for display in the lesson list.                                                                         |

Comments, quiz answers, and progress are loaded when their page or component opens, then written back when the learner changes them. Quiz answers remain saved when the modal closes. When the timer expires or the quiz is submitted, answers are locked until the learner chooses to retake it.

## Project structure

```text
app/
  page.tsx                         Home page
  courses/page.tsx                 Course catalog
  courses/course-details/page.tsx  Course player route
components/course-player/          Player and course feature components
lib/course-data.ts                 Course, lesson, and quiz data
```
