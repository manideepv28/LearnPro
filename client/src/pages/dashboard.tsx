import { Link } from "wouter";
import { Navbar } from "@/components/navbar";
import { ProgressBar } from "@/components/progress-bar";
import { useAuth } from "@/hooks/use-auth";
import { useCourses } from "@/hooks/use-courses";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  GraduationCap, 
  Trophy, 
  Medal, 
  Calendar, 
  Clock, 
  BookOpen, 
  Target,
  TrendingUp,
  Play
} from "lucide-react";

export default function Dashboard() {
  const { user, userProgress } = useAuth();
  const { courses } = useCourses();

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <GraduationCap className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Please sign in to view your dashboard</h1>
            <p className="text-gray-600">Track your learning progress and continue your courses</p>
          </div>
        </div>
      </div>
    );
  }

  const enrolledCourses = userProgress?.enrollments || [];
  const totalEnrolled = enrolledCourses.length;
  const completedCourses = enrolledCourses.filter(e => e.completed).length;
  const totalLessons = enrolledCourses.reduce((total, enrollment) => {
    const course = courses.find(c => c.id === enrollment.courseId);
    return total + (course?.lessons.length || 0);
  }, 0);
  const completedLessons = enrolledCourses.reduce((total, enrollment) => {
    return total + enrollment.progress.filter(p => p.completed).length;
  }, 0);

  const overallProgress = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;

  const recentActivity = enrolledCourses
    .flatMap(enrollment => 
      enrollment.progress
        .filter(p => p.completed && p.completedAt)
        .map(p => {
          const course = courses.find(c => c.id === enrollment.courseId);
          const lesson = course?.lessons.find(l => l.id === p.lessonId);
          return {
            courseTitle: course?.title || '',
            lessonTitle: lesson?.title || '',
            completedAt: p.completedAt!,
            type: lesson?.type || 'video'
          };
        })
    )
    .sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime())
    .slice(0, 5);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user.name}!
          </h1>
          <p className="text-gray-600">Continue your learning journey and achieve your goals.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Courses</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalEnrolled}</div>
              <p className="text-xs text-muted-foreground">
                {completedCourses} completed
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Overall Progress</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{Math.round(overallProgress)}%</div>
              <p className="text-xs text-muted-foreground">
                {completedLessons} of {totalLessons} lessons
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Learning Streak</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{userProgress?.streak || 0}</div>
              <p className="text-xs text-muted-foreground">
                days in a row
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Certificates</CardTitle>
              <Medal className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{completedCourses}</div>
              <p className="text-xs text-muted-foreground">
                earned this month
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Learning Progress */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BookOpen className="h-5 w-5 mr-2" />
                  Your Courses
                </CardTitle>
              </CardHeader>
              <CardContent>
                {enrolledCourses.length === 0 ? (
                  <div className="text-center py-8">
                    <GraduationCap className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-600 mb-2">No enrolled courses yet</h3>
                    <p className="text-gray-500 mb-4">Start learning today with our expert-led courses</p>
                    <Link href="/">
                      <Button>Browse Courses</Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {enrolledCourses.map((enrollment) => {
                      const course = courses.find(c => c.id === enrollment.courseId);
                      if (!course) return null;

                      const completedLessons = enrollment.progress.filter(p => p.completed).length;
                      const totalLessons = course.lessons.length;
                      const progress = (completedLessons / totalLessons) * 100;

                      return (
                        <div key={enrollment.courseId} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex-1">
                              <h4 className="font-semibold text-lg">{course.title}</h4>
                              <p className="text-sm text-gray-600">by {course.instructor}</p>
                            </div>
                            <div className="flex items-center space-x-2">
                              {enrollment.completed && (
                                <Badge variant="secondary" className="bg-green-100 text-green-800">
                                  <Trophy className="h-3 w-3 mr-1" />
                                  Completed
                                </Badge>
                              )}
                              <Link href={`/course/${course.id}`}>
                                <Button size="sm">
                                  <Play className="h-4 w-4 mr-1" />
                                  Continue
                                </Button>
                              </Link>
                            </div>
                          </div>
                          <div className="mb-2">
                            <div className="flex justify-between text-sm text-gray-600 mb-1">
                              <span>Progress</span>
                              <span>{completedLessons}/{totalLessons} lessons</span>
                            </div>
                            <ProgressBar progress={progress} />
                          </div>
                          {enrollment.quizScore !== undefined && (
                            <div className="text-sm text-gray-600">
                              Quiz Score: {enrollment.quizScore}%
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Recent Activity */}
            {recentActivity.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Clock className="h-5 w-5 mr-2" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {recentActivity.map((activity, index) => (
                      <div key={index} className="flex items-center space-x-3 text-sm">
                        <div className="flex-shrink-0">
                          {activity.type === 'quiz' ? (
                            <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                          ) : (
                            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                          )}
                        </div>
                        <div className="flex-1">
                          <span className="font-medium">{activity.lessonTitle}</span>
                          <span className="text-gray-500"> in {activity.courseTitle}</span>
                        </div>
                        <span className="text-gray-400">
                          {new Date(activity.completedAt).toLocaleDateString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Achievements */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Trophy className="h-5 w-5 mr-2" />
                  Achievements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {userProgress?.achievements.includes('first_course') && (
                    <div className="flex items-center space-x-3">
                      <Trophy className="h-5 w-5 text-yellow-500" />
                      <span className="text-sm">First Course Completed</span>
                    </div>
                  )}
                  {userProgress?.achievements.includes('quiz_master') && (
                    <div className="flex items-center space-x-3">
                      <Medal className="h-5 w-5 text-yellow-500" />
                      <span className="text-sm">Quiz Master</span>
                    </div>
                  )}
                  {userProgress?.achievements.includes('fast_learner') && (
                    <div className="flex items-center space-x-3">
                      <TrendingUp className="h-5 w-5 text-yellow-500" />
                      <span className="text-sm">Fast Learner</span>
                    </div>
                  )}
                  {(!userProgress?.achievements || userProgress.achievements.length === 0) && (
                    <p className="text-sm text-gray-500">Complete courses to earn achievements!</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Learning Streak */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="h-5 w-5 mr-2" />
                  Learning Streak
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">
                    {userProgress?.streak || 0}
                  </div>
                  <div className="text-gray-600">Days in a row</div>
                  <p className="text-xs text-gray-500 mt-2">
                    Keep learning daily to maintain your streak!
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Link href="/">
                  <Button variant="outline" className="w-full justify-start">
                    <BookOpen className="h-4 w-4 mr-2" />
                    Browse Courses
                  </Button>
                </Link>
                <Button variant="outline" className="w-full justify-start" disabled>
                  <Trophy className="h-4 w-4 mr-2" />
                  View Certificates
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
