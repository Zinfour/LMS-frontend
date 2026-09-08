


// Temporary mock data for the Overview screens.
// Real backend data can be connected in useOverviewData.ts.


import type { StudentOverviewData, TeacherOverviewData } from './overview.types';

export const studentOverviewMock: StudentOverviewData = {
  kpis: {
    activeCourses: 3,
    activitiesDone: 18,
    activitiesTotal: 31,
    dueThisWeek: 2,
    overdue: 1,
  },
  courses: [
    {
      id: 'fe-react',
      title: 'Frontend Development with React',
      teacher: 'Anders Ek',
      moduleCount: 5,
      credits: 20,
      status: 'in-progress',
      progressPercent: 62,
      progressLabel: 'Module 3 of 5 · TypeScript in React',
    },
    {
      id: 'db-api',
      title: 'Databases & API Design',
      teacher: 'Maria Lindqvist',
      moduleCount: 4,
      credits: 15,
      status: 'due-soon',
      progressPercent: 38,
      progressLabel: 'Module 2 of 4 · Normalisation',
    },
    {
      id: 'agile',
      title: 'Agile Methods & Teamwork',
      teacher: 'Sofia Berg',
      moduleCount: 3,
      credits: 10,
      status: 'completed',
      progressPercent: 100,
      progressLabel: 'All modules finished',
    },
  ],
  deadlines: [
    {
      id: 'd-todo-app',
      title: 'Hand-in: Todo app with hooks',
      courseTitle: 'Frontend Development with React',
      moduleLabel: 'Module 2',
      dueAt: '2026-09-06T18:00:00',
      status: 'overdue',
    },
    {
      id: 'd-quiz-props',
      title: 'Quiz: Typing props and state',
      courseTitle: 'Frontend Development with React',
      moduleLabel: 'Module 3',
      dueAt: '2026-09-10T23:59:00',
      status: 'due-soon',
    },
    {
      id: 'd-seminar-code-review',
      title: 'Seminar: Code review in pairs',
      courseTitle: 'Databases & API Design',
      moduleLabel: 'Module 2',
      dueAt: '2026-09-14T12:00:00',
      status: 'not-started',
    },
  ],
  feedback: [
    {
      id: 'fb-card-component',
      authorName: 'Anders Ek',
      activityTitle: 'Workshop: Card component',
      createdAt: '2026-09-05T10:00:00',
    },
  ],
};

export const teacherOverviewMock: TeacherOverviewData = {
  kpis: {
    awaitingFeedback: { value: 12, caption: 'Oldest: 3 days ago' },
    lateSubmissions: { value: 3, caption: 'All in Module 2' },
    activeStudents: { value: 27, caption: 'Across 2 courses' },
    unpublishedDrafts: { value: 4, caption: '2 modules · 2 activities' },
  },
  reviewQueue: [
    {
      id: 'r-johan-api',
      studentName: 'Johan Persson',
      activityTitle: 'Typed API client',
      reviewStatus: 'awaiting-feedback',
      submittedAt: '2026-09-05T09:14:00',
    },
    {
      id: 'r-amina-api',
      studentName: 'Amina Yusuf',
      activityTitle: 'Typed API client',
      reviewStatus: 'late-awaiting',
      submittedAt: '2026-09-08T07:41:00',
    },
    {
      id: 'r-karl-quiz',
      studentName: 'Karl Lindqvist',
      activityTitle: 'Quiz: props & state',
      reviewStatus: 'awaiting-feedback',
      submittedAt: '2026-09-04T21:02:00',
    },
    {
      id: 'r-elin-workshop',
      studentName: 'Elin Sandström',
      activityTitle: 'Workshop: card component',
      reviewStatus: 'awaiting-feedback',
      submittedAt: '2026-09-03T16:48:00',
    },
  ],
  deadlines: [
    {
      id: 'td-typed-api',
      title: 'Hand-in: Typed API client',
      dueAt: '2026-09-07T12:00:00',
      submissionsIn: 7,
      submissionsTotal: 18,
    },
    {
      id: 'td-quiz-props',
      title: 'Quiz: props & state',
      dueAt: '2026-09-03T23:59:00',
      submissionsIn: 16,
      submissionsTotal: 18,
    },
    {
      id: 'td-seminar-types',
      title: 'Seminar: reviewing types',
      dueAt: '2026-09-12T10:00:00',
      note: 'Attendance activity · no hand-in',
    },
  ],
  courses: [
    {
      id: 'fe-react',
      title: 'Frontend Development with React',
      status: 'published',
      studentCount: 18,
      moduleCount: 5,
      activityCount: 31,
    },
    {
      id: 'adv-react',
      title: 'Advanced React Patterns',
      status: 'draft',
      studentCount: 9,
      moduleCount: 3,
      activityCount: 12,
    },
  ],
};
