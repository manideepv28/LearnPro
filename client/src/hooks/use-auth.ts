import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { getFromStorage, saveToStorage } from "@/lib/storage";
import type { User, UserProgress, Enrollment } from "@shared/schema";

interface AuthContextType {
  user: User | null;
  userProgress: UserProgress | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  enrollInCourse: (courseId: string) => Promise<void>;
  updateUserProgress: (userId: string, enrollment: Enrollment) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }): React.ReactElement {
  const [user, setUser] = useState<User | null>(null);
  const [userProgress, setUserProgress] = useState<UserProgress | null>(null);

  useEffect(() => {
    // Load user data from localStorage on app start
    const savedUser = getFromStorage<User>("learnflow_user");
    const savedProgress = getFromStorage<UserProgress>("learnflow_progress");

    if (savedUser) {
      setUser(savedUser);
    }
    if (savedProgress) {
      setUserProgress(savedProgress);
    }
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    // Simple authentication - in a real app, this would validate against a backend
    const existingUsers = getFromStorage<User[]>("learnflow_users") || [];
    const existingUser = existingUsers.find(u => u.email === email);

    if (existingUser) {
      setUser(existingUser);
      saveToStorage("learnflow_user", existingUser);
      
      // Load user progress
      const progress = getFromStorage<UserProgress>(`learnflow_progress_${existingUser.id}`);
      if (progress) {
        setUserProgress(progress);
        saveToStorage("learnflow_progress", progress);
      }
    } else {
      // For demo purposes, create a user with just email
      const newUser: User = {
        id: Date.now().toString(),
        name: email.split('@')[0],
        email,
        createdAt: new Date().toISOString(),
      };
      
      const users = [...existingUsers, newUser];
      saveToStorage("learnflow_users", users);
      setUser(newUser);
      saveToStorage("learnflow_user", newUser);

      // Initialize user progress
      const newProgress: UserProgress = {
        userId: newUser.id,
        enrollments: [],
        achievements: [],
        streak: 0,
      };
      setUserProgress(newProgress);
      saveToStorage("learnflow_progress", newProgress);
      saveToStorage(`learnflow_progress_${newUser.id}`, newProgress);
    }
  };

  const register = async (name: string, email: string, password: string): Promise<void> => {
    const existingUsers = getFromStorage<User[]>("learnflow_users") || [];
    
    // Check if user already exists
    if (existingUsers.some(u => u.email === email)) {
      throw new Error("User already exists");
    }

    const newUser: User = {
      id: Date.now().toString(),
      name,
      email,
      createdAt: new Date().toISOString(),
    };

    const users = [...existingUsers, newUser];
    saveToStorage("learnflow_users", users);
    setUser(newUser);
    saveToStorage("learnflow_user", newUser);

    // Initialize user progress
    const newProgress: UserProgress = {
      userId: newUser.id,
      enrollments: [],
      achievements: [],
      streak: 0,
    };
    setUserProgress(newProgress);
    saveToStorage("learnflow_progress", newProgress);
    saveToStorage(`learnflow_progress_${newUser.id}`, newProgress);
  };

  const logout = () => {
    setUser(null);
    setUserProgress(null);
    localStorage.removeItem("learnflow_user");
    localStorage.removeItem("learnflow_progress");
  };

  const enrollInCourse = async (courseId: string): Promise<void> => {
    if (!user || !userProgress) {
      throw new Error("User not authenticated");
    }

    // Check if already enrolled
    if (userProgress.enrollments.some(e => e.courseId === courseId)) {
      return;
    }

    // Get course data to initialize progress
    const { courses } = await import("@/lib/course-data");
    const course = courses.find(c => c.id === courseId);
    if (!course) {
      throw new Error("Course not found");
    }

    const newEnrollment: Enrollment = {
      courseId,
      enrolledAt: new Date().toISOString(),
      progress: course.lessons.map(lesson => ({
        lessonId: lesson.id,
        completed: false,
      })),
      completed: false,
    };

    const updatedProgress: UserProgress = {
      ...userProgress,
      enrollments: [...userProgress.enrollments, newEnrollment],
    };

    setUserProgress(updatedProgress);
    saveToStorage("learnflow_progress", updatedProgress);
    saveToStorage(`learnflow_progress_${user.id}`, updatedProgress);
  };

  const updateUserProgress = (userId: string, updatedEnrollment: Enrollment) => {
    if (!userProgress || userProgress.userId !== userId) {
      return;
    }

    const enrollmentIndex = userProgress.enrollments.findIndex(
      e => e.courseId === updatedEnrollment.courseId
    );

    if (enrollmentIndex === -1) {
      return;
    }

    const updatedEnrollments = [...userProgress.enrollments];
    updatedEnrollments[enrollmentIndex] = updatedEnrollment;

    // Check for achievements
    const achievements = [...userProgress.achievements];
    
    // First course completion
    if (updatedEnrollment.completed && !achievements.includes('first_course')) {
      achievements.push('first_course');
    }

    // Quiz master (if quiz score >= 90)
    if (updatedEnrollment.quizScore && updatedEnrollment.quizScore >= 90 && !achievements.includes('quiz_master')) {
      achievements.push('quiz_master');
    }

    // Fast learner (completed course in less than a week)
    if (updatedEnrollment.completed && updatedEnrollment.completedAt && !achievements.includes('fast_learner')) {
      const enrolledDate = new Date(updatedEnrollment.enrolledAt);
      const completedDate = new Date(updatedEnrollment.completedAt);
      const daysDiff = (completedDate.getTime() - enrolledDate.getTime()) / (1000 * 60 * 60 * 24);
      
      if (daysDiff <= 7) {
        achievements.push('fast_learner');
      }
    }

    // Update streak (simplified - just increment if active)
    let streak = userProgress.streak;
    if (updatedEnrollment.progress.some(p => p.completed && p.completedAt)) {
      const lastActivity = userProgress.lastActivity;
      const today = new Date().toDateString();
      
      if (!lastActivity || new Date(lastActivity).toDateString() !== today) {
        streak += 1;
      }
    }

    const updatedProgress: UserProgress = {
      ...userProgress,
      enrollments: updatedEnrollments,
      achievements,
      streak,
      lastActivity: new Date().toISOString(),
    };

    setUserProgress(updatedProgress);
    saveToStorage("learnflow_progress", updatedProgress);
    if (user) {
      saveToStorage(`learnflow_progress_${user.id}`, updatedProgress);
    }
  };

  return React.createElement(AuthContext.Provider, {
    value: {
      user,
      userProgress,
      login,
      register,
      logout,
      enrollInCourse,
      updateUserProgress,
    }
  }, children);
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
