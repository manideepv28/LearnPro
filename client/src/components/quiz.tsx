import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle } from "lucide-react";
import type { Quiz as QuizType } from "@shared/schema";

interface QuizProps {
  quiz: QuizType;
  answers: number[];
  onAnswersChange: (answers: number[]) => void;
  onSubmit: (score: number) => void;
  isCompleted: boolean;
}

export function Quiz({ quiz, answers, onAnswersChange, onSubmit, isCompleted }: QuizProps) {
  const [submitted, setSubmitted] = useState(isCompleted);
  const [showResults, setShowResults] = useState(isCompleted);

  const handleAnswerChange = (questionIndex: number, answerIndex: number) => {
    const newAnswers = [...answers];
    newAnswers[questionIndex] = answerIndex;
    onAnswersChange(newAnswers);
  };

  const handleSubmit = () => {
    if (answers.length !== quiz.questions.length) {
      return;
    }

    let correctCount = 0;
    quiz.questions.forEach((question, index) => {
      if (answers[index] === question.correct) {
        correctCount++;
      }
    });

    const score = Math.round((correctCount / quiz.questions.length) * 100);
    setSubmitted(true);
    setShowResults(true);
    onSubmit(score);
  };

  const getScore = () => {
    if (answers.length !== quiz.questions.length) return 0;
    
    let correctCount = 0;
    quiz.questions.forEach((question, index) => {
      if (answers[index] === question.correct) {
        correctCount++;
      }
    });
    
    return Math.round((correctCount / quiz.questions.length) * 100);
  };

  const isAnswerComplete = answers.length === quiz.questions.length && 
    answers.every(answer => answer !== undefined && answer !== -1);

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">Course Quiz</h2>
        <p className="text-gray-600">Test your knowledge with these questions</p>
      </div>

      {quiz.questions.map((question, questionIndex) => (
        <Card key={questionIndex} className="w-full">
          <CardHeader>
            <CardTitle className="text-lg flex items-center justify-between">
              <span>Question {questionIndex + 1}</span>
              {showResults && (
                <Badge variant={answers[questionIndex] === question.correct ? "default" : "destructive"}>
                  {answers[questionIndex] === question.correct ? (
                    <CheckCircle className="h-4 w-4 mr-1" />
                  ) : (
                    <XCircle className="h-4 w-4 mr-1" />
                  )}
                  {answers[questionIndex] === question.correct ? "Correct" : "Incorrect"}
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4 font-medium">{question.question}</p>
            
            <RadioGroup
              value={answers[questionIndex]?.toString() || ""}
              onValueChange={(value) => handleAnswerChange(questionIndex, parseInt(value))}
              disabled={submitted}
            >
              {question.options.map((option, optionIndex) => {
                const isSelected = answers[questionIndex] === optionIndex;
                const isCorrect = optionIndex === question.correct;
                
                let optionClass = "";
                if (showResults) {
                  if (isCorrect) {
                    optionClass = "text-green-700 bg-green-50 border-green-200";
                  } else if (isSelected && !isCorrect) {
                    optionClass = "text-red-700 bg-red-50 border-red-200";
                  }
                }

                return (
                  <div key={optionIndex} className={`flex items-center space-x-2 p-3 rounded-lg border ${optionClass}`}>
                    <RadioGroupItem value={optionIndex.toString()} id={`q${questionIndex}_option${optionIndex}`} />
                    <Label htmlFor={`q${questionIndex}_option${optionIndex}`} className="flex-1 cursor-pointer">
                      {option}
                    </Label>
                    {showResults && isCorrect && (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    )}
                    {showResults && isSelected && !isCorrect && (
                      <XCircle className="h-5 w-5 text-red-600" />
                    )}
                  </div>
                );
              })}
            </RadioGroup>
          </CardContent>
        </Card>
      ))}

      {!submitted && (
        <div className="text-center pt-6">
          <Button 
            onClick={handleSubmit}
            disabled={!isAnswerComplete}
            size="lg"
          >
            Submit Quiz
          </Button>
        </div>
      )}

      {showResults && (
        <Card className="bg-gray-50">
          <CardContent className="pt-6">
            <div className="text-center">
              <h3 className="text-xl font-bold mb-2">Quiz Complete!</h3>
              <div className="text-3xl font-bold mb-2">
                {getScore()}%
              </div>
              <p className="text-gray-600 mb-4">
                You got {quiz.questions.filter((q, i) => answers[i] === q.correct).length} out of {quiz.questions.length} questions correct.
              </p>
              <Badge variant={getScore() >= 70 ? "default" : "destructive"} className="text-sm">
                {getScore() >= 70 ? "Passed!" : "Keep Practicing!"}
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
