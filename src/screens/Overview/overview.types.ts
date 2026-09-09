/**
 * View-model types for Overview screens (Student & Teacher).
 * Data comes from the backend's GET /overview endpoint.
 */

/* Student */

export type StudentCourseStatus = 'in-progress' | 'due-soon' | 'completed';

export interface StudentCourseSummary {
  id: string;
  title: string;
  teacher: string;
  moduleCount: number;
  credits: number;
  status: StudentCourseStatus;
  /** Fills the progress bar. */
  progressPercent: number;
  /** Shown next to bar (ex "Module 3 of 5 · TypeScript in React" or "All modules finished"). */
  progressLabel: string;
}

export type StudentDeadlineStatus = 'overdue' | 'due-soon' | 'not-started';

export interface StudentDeadline {
  id: string;
  title: string;
  courseTitle: string;
  moduleLabel: string;
  /** ISO date. UI formats it (ex "YESTERDAY" or "THU 3 SEP · 23:59"). */
  dueAt: string;
  status: StudentDeadlineStatus;
}

export interface StudentFeedbackItem {
  id: string;
  authorName: string;
  activityTitle: string;
  /** ISO date. Shown as relative time (ex "2 days ago"). */
  createdAt: string;
}

export interface StudentKpis {
  activeCourses: number;
  activitiesDone: number;
  activitiesTotal: number;
  dueThisWeek: number;
  overdue: number;
}

export interface StudentOverviewData {
  kpis: StudentKpis;
  courses: StudentCourseSummary[];
  deadlines: StudentDeadline[];
  feedback: StudentFeedbackItem[];
}

/* Teacher */

/**
 * Teacher workflow state for a submission — what the teacher needs to do next,
 * NOT whether/when the student handed in (that is `submittedAt`).
 * `not-submitted` and `reviewed` are part of the full submissions vocabulary;
 * the Overview "Needs your review" preview only shows the actionable ones.
 */
export type TeacherReviewStatus = 'late-awaiting' | 'awaiting-feedback' | 'not-submitted' | 'reviewed';
export type TeacherCourseStatus = 'published' | 'draft';

export interface TeacherKpi {
  value: number;
  /** Small line under the value (ex "Oldest: 3 days ago"). */
  caption: string;
}

export interface TeacherKpis {
  awaitingFeedback: TeacherKpi;
  lateSubmissions: TeacherKpi;
  activeStudents: TeacherKpi;
  unpublishedDrafts: TeacherKpi;
}

export interface TeacherReviewItem {
  id: string;
  studentName: string;
  activityTitle: string;
  reviewStatus: TeacherReviewStatus;
  /** ISO date. Shown in the "Submitted" column (ex "5 Sep 09:14"). Not a status. */
  submittedAt: string;
}

export interface TeacherDeadline {
  id: string;
  title: string;
  /** ISO date. UI formats it (ex "MON 7 SEP · 12:00"). */
  dueAt: string;
  /** Hand-ins show a bar and "7 / 18 in". */
  submissionsIn?: number;
  submissionsTotal?: number;
  /** Shown instead of a bar (ex "Attendance activity · no hand-in"). */
  note?: string;
}

export interface TeacherCourseSummary {
  id: string;
  title: string;
  status: TeacherCourseStatus;
  studentCount: number;
  moduleCount: number;
  activityCount: number;
}

export interface TeacherOverviewData {
  kpis: TeacherKpis;
  reviewQueue: TeacherReviewItem[];
  deadlines: TeacherDeadline[];
  courses: TeacherCourseSummary[];
}
