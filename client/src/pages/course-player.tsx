import { useState, useEffect } from "react";
import { useRoute, Link } from "wouter";
import { Navbar } from "@/components/navbar";
import { VideoPlayer } from "@/components/video-player";
import { Quiz } from "@/components/quiz";
import { ProgressBar } from "@/components/progress-bar";
import { useAuth } from "@/hooks/use-auth";
import { useCourses } from "@/hooks/use-courses";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { 
  ChevronLeft, 
  ChevronRight, 
  Play, 
  CheckCircle,
  Award,
  BookOpen,
  ArrowLeft
} from "lucide-react";
import type { Course, Lesson } from "@shared/schema";

export default function CoursePlayer() {
  const [, params] = useRoute("/course/:courseId");
  const courseId = params?.courseId;
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState<number[]>([]);
  
  const { user, userProgress, updateUserProgress } = useAuth();
  const { courses } = useCourses();
  const { toast } = useToast();

  const course = courses.find(c => c.id === courseId);
  const enrollment = userProgress?.enrollments.find(e => e.courseId === courseId);

  useEffect(() => {
    if (enrollment) {
      // Find first incomplete lesson
      const firstIncomplete = enrollment.progress.findIndex(p => !p.completed);
      if (firstIncomplete !== -1) {
        setCurrentLessonIndex(firstIncomplete);
      }
    }
  }, [enrollment]);

  if (!course) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Course not found</h1>
            <Link href="/">
              <Button>Back to Courses</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Please sign in to access this course</h1>
            <Link href="/">
              <Button>Back to Home</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!enrollment) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">You are not enrolled in this course</h1>
            <Link href="/">
              <Button>Browse Courses</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const currentLesson = course.lessons[currentLessonIndex];
  const completedLessons = enrollment.progress.filter(p => p.completed).length;
  const totalLessons = course.lessons.length;
  const courseProgress = (completedLessons / totalLessons) * 100;

  const markLessonCompleted = (lessonId: string) => {
    const updatedProgress = enrollment.progress.map(p => 
      p.lessonId === lessonId 
        ? { ...p, completed: true, completedAt: new Date().toISOString() }
        : p
    );

    const updatedEnrollment = {
      ...enrollment,
      progress: updatedProgress
    };

    // Check if course is completed
    const allCompleted = updatedProgress.every(p => p.completed);
    if (allCompleted && !enrollment.completed) {
      updatedEnrollment.completed = true;
      updatedEnrollment.completedAt = new Date().toISOString();
      
      toast({
        title: "🎉 Course Completed!",
        description: "Congratulations! You've completed the entire course.",
      });
    }

    updateUserProgress(user.id, updatedEnrollment);
  };

  const markQuizCompleted = (score: number) => {
    const updatedEnrollment = {
      ...enrollment,
      quizScore: score
    };

    markLessonCompleted(currentLesson.id);
    updateUserProgress(user.id, updatedEnrollment);

    toast({
      title: score >= 70 ? "Quiz Passed!" : "Quiz Completed",
      description: `You scored ${score}%. ${score >= 70 ? "Great job!" : "Keep practicing!"}`,
    });
  };

  const goToNextLesson = () => {
    if (currentLessonIndex < course.lessons.length - 1) {
      setCurrentLessonIndex(currentLessonIndex + 1);
      setQuizAnswers([]);
    }
  };

  const goToPreviousLesson = () => {
    if (currentLessonIndex > 0) {
      setCurrentLessonIndex(currentLessonIndex - 1);
      setQuizAnswers([]);
    }
  };

  const isLessonCompleted = (lessonId: string) => {
    return enrollment.progress.find(p => p.lessonId === lessonId)?.completed || false;
  };

  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      
      <div className="flex h-[calc(100vh-64px)]">
        {/* Main Content Area */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <div className="bg-gray-900 text-white p-4 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/dashboard">
                <Button variant="ghost" size="sm" className="text-white hover:bg-gray-800">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
              <div>
                <h1 className="text-xl font-bold">{course.title}</h1>
                <p className="text-gray-300 text-sm">by {course.instructor}</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-300">
                Progress: {completedLessons}/{totalLessons} lessons
              </div>
              <ProgressBar progress={courseProgress} className="w-32" />
            </div>
          </div>

          {/* Video/Quiz Content */}
          <div className="flex-1 flex items-center justify-center p-4">
            <div className="w-full max-w-4xl">
              {currentLesson.type === 'video' ? (
                <VideoPlayer
                  videoId={currentLesson.videoId!}
                  title={currentLesson.title}
                  onVideoEnd={() => markLessonCompleted(currentLesson.id)}
                  isCompleted={isLessonCompleted(currentLesson.id)}
                />
              ) : (
                <div className="bg-white rounded-lg p-6">
                  <Quiz
                    quiz={course.quiz}
                    answers={quizAnswers}
                    onAnswersChange={setQuizAnswers}
                    onSubmit={markQuizCompleted}
                    isCompleted={isLessonCompleted(currentLesson.id)}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Navigation */}
          <div className="bg-gray-900 text-white p-4 flex justify-between items-center">
            <Button
              variant="outline"
              onClick={goToPreviousLesson}
              disabled={currentLessonIndex === 0}
              className="bg-gray-800 border-gray-700 text-white hover:bg-gray-700"
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>
            
            <div className="text-center">
              <div className="text-sm text-gray-300">
                Lesson {currentLessonIndex + 1} of {course.lessons.length}
              </div>
              <div className="font-medium">{currentLesson.title}</div>
            </div>

            <Button
              variant="outline"
              onClick={goToNextLesson}
              disabled={currentLessonIndex === course.lessons.length - 1}
              className="bg-gray-800 border-gray-700 text-white hover:bg-gray-700"
            >
              Next
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-80 bg-white overflow-y-auto">
          <div className="p-6">
            <h3 className="font-bold text-lg mb-4 flex items-center">
              <BookOpen className="h-5 w-5 mr-2" />
              Course Content
            </h3>
            
            <div className="space-y-2 mb-6">
              {course.lessons.map((lesson, index) => {
                const isCompleted = isLessonCompleted(lesson.id);
                const isCurrent = index === currentLessonIndex;
                
                return (
                  <div
                    key={lesson.id}
                    className={`p-3 rounded-lg cursor-pointer transition-colors ${
                      isCurrent 
                        ? 'bg-primary text-white' 
                        : 'hover:bg-gray-100'
                    }`}
                    onClick={() => {
                      setCurrentLessonIndex(index);
                      setQuizAnswers([]);
                    }}
                  >
                    <div className="flex items-center">
                      <div className="mr-3">
                        {lesson.type === 'quiz' ? (
                          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs ${
                            isCompleted 
                              ? 'bg-green-500 border-green-500 text-white' 
                              : 'border-gray-300'
                          }`}>
                            {isCompleted ? <CheckCircle className="h-3 w-3" /> : '?'}
                          </div>
                        ) : (
                          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                            isCompleted 
                              ? 'bg-green-500 border-green-500 text-white' 
                              : 'border-gray-300'
                          }`}>
                            {isCompleted ? <CheckCircle className="h-3 w-3" /> : <Play className="h-3 w-3" />}
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className={`font-medium ${isCurrent ? 'text-white' : ''}`}>
                          {lesson.title}
                        </div>
                        <div className={`text-xs ${isCurrent ? 'text-blue-100' : 'text-gray-500'}`}>
                          {lesson.type === 'quiz' ? 'Quiz' : 'Video'}
                        </div>
                      </div>
                      {isCompleted && (
                        <CheckCircle className="h-4 w-4 text-green-500 ml-2" />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Course Progress Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Course Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <ProgressBar progress={courseProgress} />
                  <div className="text-sm text-gray-600">
                    {completedLessons} of {totalLessons} lessons completed
                  </div>
                  {enrollment.completed && (
                    <Badge className="w-full justify-center bg-green-100 text-green-800">
                      <Award className="h-3 w-3 mr-1" />
                      Course Completed!
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Quiz Score */}
            {enrollment.quizScore !== undefined && (
              <Card className="mt-4">
                <CardHeader>
                  <CardTitle className="text-sm">Quiz Score</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-center">
                    {enrollment.quizScore}%
                  </div>
                  <div className="text-center text-sm text-gray-600">
                    {enrollment.quizScore >= 70 ? 'Passed!' : 'Try Again'}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
