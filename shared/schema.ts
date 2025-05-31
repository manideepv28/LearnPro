import { z } from "zod";

export const userSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  createdAt: z.string(),
});

export const lessonSchema = z.object({
  id: z.string(),
  title: z.string(),
  type: z.enum(["video", "quiz"]),
  videoId: z.string().optional(),
  completed: z.boolean().default(false),
  completedAt: z.string().optional(),
});

export const quizQuestionSchema = z.object({
  question: z.string(),
  options: z.array(z.string()),
  correct: z.number(),
});

export const quizSchema = z.object({
  questions: z.array(quizQuestionSchema),
});

export const courseSchema = z.object({
  id: z.string(),
  title: z.string(),
  instructor: z.string(),
  rating: z.number(),
  students: z.number(),
  duration: z.string(),
  level: z.enum(["Beginner", "Intermediate", "Advanced"]),
  price: z.number(),
  image: z.string(),
  description: z.string(),
  category: z.string(),
  lessons: z.array(lessonSchema),
  quiz: quizSchema,
});

export const enrollmentSchema = z.object({
  courseId: z.string(),
  enrolledAt: z.string(),
  progress: z.array(z.object({
    lessonId: z.string(),
    completed: z.boolean(),
    completedAt: z.string().optional(),
  })),
  quizScore: z.number().optional(),
  completed: z.boolean().default(false),
  completedAt: z.string().optional(),
});

export const userProgressSchema = z.object({
  userId: z.string(),
  enrollments: z.array(enrollmentSchema),
  achievements: z.array(z.string()),
  streak: z.number().default(0),
  lastActivity: z.string().optional(),
});

export type User = z.infer<typeof userSchema>;
export type Lesson = z.infer<typeof lessonSchema>;
export type QuizQuestion = z.infer<typeof quizQuestionSchema>;
export type Quiz = z.infer<typeof quizSchema>;
export type Course = z.infer<typeof courseSchema>;
export type Enrollment = z.infer<typeof enrollmentSchema>;
export type UserProgress = z.infer<typeof userProgressSchema>;
