import { Link } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Star, Users, Clock, Play } from "lucide-react";
import type { Course } from "@shared/schema";

interface CourseCardProps {
  course: Course;
  onAuthRequired: () => void;
}

export function CourseCard({ course, onAuthRequired }: CourseCardProps) {
  const { user, userProgress, enrollInCourse } = useAuth();
  const { toast } = useToast();

  const isEnrolled = userProgress?.enrollments.some(e => e.courseId === course.id);
  const enrollment = userProgress?.enrollments.find(e => e.courseId === course.id);

  const handleEnroll = async () => {
    if (!user) {
      onAuthRequired();
      return;
    }

    if (isEnrolled) {
      // Navigate to course
      return;
    }

    try {
      await enrollInCourse(course.id);
      toast({
        title: "Enrolled successfully!",
        description: `You are now enrolled in ${course.title}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to enroll in course. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getProgressPercentage = () => {
    if (!enrollment) return 0;
    const completed = enrollment.progress.filter(p => p.completed).length;
    return (completed / course.lessons.length) * 100;
  };

  return (
    <Card className="group hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
      <div className="relative overflow-hidden rounded-t-lg">
        <img
          src={course.image}
          alt={course.title}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-200"
        />
        <div className="absolute top-3 left-3">
          <Badge variant="secondary" className="bg-white/90 text-primary">
            {course.level}
          </Badge>
        </div>
        <div className="absolute top-3 right-3">
          <div className="flex items-center space-x-1 bg-white/90 rounded-full px-2 py-1 text-xs font-medium">
            <Star className="h-3 w-3 text-yellow-500 fill-current" />
            <span>{course.rating}</span>
          </div>
        </div>
      </div>

      <CardContent className="p-6">
        <h3 className="font-bold text-lg mb-2 line-clamp-2">{course.title}</h3>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{course.description}</p>
        
        <div className="flex items-center text-sm text-gray-500 mb-4 space-x-4">
          <div className="flex items-center">
            <Users className="h-4 w-4 mr-1" />
            <span>{course.instructor}</span>
          </div>
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-1" />
            <span>{course.duration}</span>
          </div>
        </div>

        {isEnrolled && (
          <div className="mb-4">
            <div className="flex justify-between text-xs text-gray-600 mb-1">
              <span>Progress</span>
              <span>{Math.round(getProgressPercentage())}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-green-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${getProgressPercentage()}%` }}
              />
            </div>
          </div>
        )}
      </CardContent>

      <CardFooter className="px-6 pb-6">
        <div className="flex items-center justify-between w-full">
          <span className="text-lg font-bold text-primary">${course.price}</span>
          {isEnrolled ? (
            <Link href={`/course/${course.id}`}>
              <Button className="flex items-center">
                <Play className="h-4 w-4 mr-2" />
                Continue
              </Button>
            </Link>
          ) : (
            <Button onClick={handleEnroll} className="flex items-center">
              Enroll Now
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}
