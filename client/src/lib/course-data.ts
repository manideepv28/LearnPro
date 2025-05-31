import type { Course } from "@shared/schema";

export const courses: Course[] = [
  {
    id: "1",
    title: "Complete JavaScript Bootcamp",
    instructor: "Sarah Johnson",
    rating: 4.8,
    students: 12340,
    duration: "40 hours",
    level: "Beginner",
    price: 49.99,
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
    description: "Master JavaScript from basics to advanced concepts with hands-on projects and real-world applications.",
    category: "Programming",
    lessons: [
      { 
        id: "1-1", 
        title: "Introduction to JavaScript", 
        videoId: "PkZNo7MFNFg", 
        type: "video", 
        completed: false 
      },
      { 
        id: "1-2", 
        title: "Variables and Data Types", 
        videoId: "9Y8hgIpvHNA", 
        type: "video", 
        completed: false 
      },
      { 
        id: "1-3", 
        title: "Functions and Scope", 
        videoId: "xjAu2Y2nJ34", 
        type: "video", 
        completed: false 
      },
      { 
        id: "1-4", 
        title: "JavaScript Quiz", 
        type: "quiz", 
        completed: false 
      }
    ],
    quiz: {
      questions: [
        {
          question: "What is the correct way to declare a variable in JavaScript?",
          options: ["var x = 5;", "variable x = 5;", "v x = 5;", "declare x = 5;"],
          correct: 0
        },
        {
          question: "Which of the following is a JavaScript data type?",
          options: ["string", "number", "boolean", "All of the above"],
          correct: 3
        },
        {
          question: "What does the '===' operator do in JavaScript?",
          options: ["Assignment", "Loose equality", "Strict equality", "Not equal"],
          correct: 2
        }
      ]
    }
  },
  {
    id: "2",
    title: "UI/UX Design Fundamentals",
    instructor: "Michael Chen",
    rating: 4.9,
    students: 8750,
    duration: "25 hours",
    level: "Intermediate",
    price: 69.99,
    image: "https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
    description: "Learn modern UI/UX design principles, user research methods, and industry-standard tools.",
    category: "Design",
    lessons: [
      { 
        id: "2-1", 
        title: "Design Thinking Process", 
        videoId: "pXtN4y3O35M", 
        type: "video", 
        completed: false 
      },
      { 
        id: "2-2", 
        title: "User Research Methods", 
        videoId: "WpzmOH0hrEM", 
        type: "video", 
        completed: false 
      },
      { 
        id: "2-3", 
        title: "Prototyping in Figma", 
        videoId: "FTlczfEyHnU", 
        type: "video", 
        completed: false 
      },
      { 
        id: "2-4", 
        title: "Design Quiz", 
        type: "quiz", 
        completed: false 
      }
    ],
    quiz: {
      questions: [
        {
          question: "What does UX stand for?",
          options: ["User Experience", "User Extension", "Universal Experience", "Unique Extension"],
          correct: 0
        },
        {
          question: "Which tool is commonly used for wireframing?",
          options: ["Photoshop", "Figma", "Word", "Excel"],
          correct: 1
        },
        {
          question: "What is the main purpose of user personas?",
          options: ["Decoration", "Understanding target users", "Marketing", "Development"],
          correct: 1
        }
      ]
    }
  },
  {
    id: "3",
    title: "Digital Marketing Mastery",
    instructor: "Emma Rodriguez",
    rating: 4.7,
    students: 15620,
    duration: "35 hours",
    level: "Beginner",
    price: 59.99,
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
    description: "Complete guide to digital marketing strategies, from social media to content marketing.",
    category: "Marketing",
    lessons: [
      { 
        id: "3-1", 
        title: "Introduction to Digital Marketing", 
        videoId: "bixR-KIJKYM", 
        type: "video", 
        completed: false 
      },
      { 
        id: "3-2", 
        title: "Social Media Strategy", 
        videoId: "R1ZVZh8920w", 
        type: "video", 
        completed: false 
      },
      { 
        id: "3-3", 
        title: "Content Marketing Essentials", 
        videoId: "UBOeC9M6zxM", 
        type: "video", 
        completed: false 
      },
      { 
        id: "3-4", 
        title: "Marketing Quiz", 
        type: "quiz", 
        completed: false 
      }
    ],
    quiz: {
      questions: [
        {
          question: "What is the primary goal of content marketing?",
          options: ["Increase sales", "Build brand awareness", "Engage audience", "All of the above"],
          correct: 3
        },
        {
          question: "Which platform is best for B2B marketing?",
          options: ["Instagram", "TikTok", "LinkedIn", "Snapchat"],
          correct: 2
        },
        {
          question: "What does SEO stand for?",
          options: ["Social Engine Optimization", "Search Engine Optimization", "Site Engine Optimization", "System Engine Optimization"],
          correct: 1
        }
      ]
    }
  },
  {
    id: "4",
    title: "Data Science with Python",
    instructor: "Dr. Alex Kumar",
    rating: 4.9,
    students: 9430,
    duration: "50 hours",
    level: "Advanced",
    price: 89.99,
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
    description: "Learn data analysis, machine learning, and visualization with Python and popular libraries.",
    category: "Programming",
    lessons: [
      { 
        id: "4-1", 
        title: "Python for Data Science", 
        videoId: "LHBE6Q9XlzI", 
        type: "video", 
        completed: false 
      },
      { 
        id: "4-2", 
        title: "Data Analysis with Pandas", 
        videoId: "vmEHCJofslg", 
        type: "video", 
        completed: false 
      },
      { 
        id: "4-3", 
        title: "Machine Learning Basics", 
        videoId: "GwIo3gDZCVQ", 
        type: "video", 
        completed: false 
      },
      { 
        id: "4-4", 
        title: "Data Science Quiz", 
        type: "quiz", 
        completed: false 
      }
    ],
    quiz: {
      questions: [
        {
          question: "Which library is primarily used for data manipulation in Python?",
          options: ["NumPy", "Pandas", "Matplotlib", "Scikit-learn"],
          correct: 1
        },
        {
          question: "What is supervised learning?",
          options: ["Learning without labeled data", "Learning with labeled data", "Learning with a teacher", "Learning by trial and error"],
          correct: 1
        },
        {
          question: "Which of these is a classification algorithm?",
          options: ["Linear Regression", "K-Means", "Random Forest", "PCA"],
          correct: 2
        }
      ]
    }
  },
  {
    id: "5",
    title: "Business Strategy Fundamentals",
    instructor: "Jennifer Lee",
    rating: 4.6,
    students: 7200,
    duration: "30 hours",
    level: "Intermediate",
    price: 79.99,
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
    description: "Master business strategy, competitive analysis, and strategic planning for modern organizations.",
    category: "Business",
    lessons: [
      { 
        id: "5-1", 
        title: "Strategic Planning Foundations", 
        videoId: "iuPpBtC2tZc", 
        type: "video", 
        completed: false 
      },
      { 
        id: "5-2", 
        title: "Competitive Analysis", 
        videoId: "V8aS3mrfW8c", 
        type: "video", 
        completed: false 
      },
      { 
        id: "5-3", 
        title: "Market Positioning", 
        videoId: "BBiMhHWWUKM", 
        type: "video", 
        completed: false 
      },
      { 
        id: "5-4", 
        title: "Business Strategy Quiz", 
        type: "quiz", 
        completed: false 
      }
    ],
    quiz: {
      questions: [
        {
          question: "What is a SWOT analysis?",
          options: ["Sales, Workforce, Operations, Technology", "Strengths, Weaknesses, Opportunities, Threats", "Strategy, Workflow, Objectives, Timeline", "Systems, Workflow, Organization, Training"],
          correct: 1
        },
        {
          question: "What does competitive advantage mean?",
          options: ["Being the largest company", "Having the lowest prices", "Unique value that competitors can't easily replicate", "Having the most employees"],
          correct: 2
        },
        {
          question: "What is market segmentation?",
          options: ["Dividing the company into departments", "Dividing the market into distinct groups", "Dividing the product into features", "Dividing the budget into categories"],
          correct: 1
        }
      ]
    }
  },
  {
    id: "6",
    title: "Mobile App Development with React Native",
    instructor: "Carlos Rodriguez",
    rating: 4.8,
    students: 11200,
    duration: "45 hours",
    level: "Intermediate",
    price: 74.99,
    image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
    description: "Build cross-platform mobile apps with React Native, from basics to app store deployment.",
    category: "Programming",
    lessons: [
      { 
        id: "6-1", 
        title: "React Native Introduction", 
        videoId: "0-S5a0eXPoc", 
        type: "video", 
        completed: false 
      },
      { 
        id: "6-2", 
        title: "Navigation and State Management", 
        videoId: "VozPNrt-LfE", 
        type: "video", 
        completed: false 
      },
      { 
        id: "6-3", 
        title: "Building Your First App", 
        videoId: "ur6I5m2nTvk", 
        type: "video", 
        completed: false 
      },
      { 
        id: "6-4", 
        title: "React Native Quiz", 
        type: "quiz", 
        completed: false 
      }
    ],
    quiz: {
      questions: [
        {
          question: "What is React Native primarily used for?",
          options: ["Web development", "Mobile app development", "Desktop apps", "Game development"],
          correct: 1
        },
        {
          question: "Which platforms can React Native target?",
          options: ["Only iOS", "Only Android", "Both iOS and Android", "Only web browsers"],
          correct: 2
        },
        {
          question: "What language is primarily used in React Native?",
          options: ["Java", "Swift", "JavaScript", "Kotlin"],
          correct: 2
        }
      ]
    }
  }
];
