import { useState, useEffect } from "react";
import { courses as staticCourses } from "@/lib/course-data";
import type { Course } from "@shared/schema";

export function useCourses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading courses
    const loadCourses = async () => {
      setIsLoading(true);
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 100));
      setCourses(staticCourses);
      setIsLoading(false);
    };

    loadCourses();
  }, []);

  return {
    courses,
    isLoading,
  };
}
