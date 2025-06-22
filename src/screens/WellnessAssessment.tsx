import React, { useState } from "react";
import { useAtom } from "jotai";
import { AnimatedWrapper, TextBlockWrapper } from "@/components/DialogWrapper";
import { screenAtom } from "@/store/screens";
import { updateWellnessMetricsAtom, employeeProfileAtom } from "@/store/wellness";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, CheckCircle } from "lucide-react";

interface AssessmentQuestion {
  id: string;
  question: string;
  category: 'stress' | 'energy' | 'workload' | 'balance';
  scale: string;
}

const assessmentQuestions: AssessmentQuestion[] = [
  {
    id: 'stress1',
    question: 'How would you rate your current stress level at work?',
    category: 'stress',
    scale: '1 = Very Low Stress, 10 = Very High Stress'
  },
  {
    id: 'energy1',
    question: 'How energetic do you feel during your workday?',
    category: 'energy',
    scale: '1 = Very Low Energy, 10 = Very High Energy'
  },
  {
    id: 'workload1',
    question: 'How satisfied are you with your current workload?',
    category: 'workload',
    scale: '1 = Very Dissatisfied, 10 = Very Satisfied'
  },
  {
    id: 'balance1',
    question: 'How well are you able to balance work and personal life?',
    category: 'balance',
    scale: '1 = Very Poor Balance, 10 = Excellent Balance'
  },
  {
    id: 'stress2',
    question: 'How often do you feel overwhelmed by your responsibilities?',
    category: 'stress',
    scale: '1 = Never, 10 = Always'
  },
  {
    id: 'energy2',
    question: 'How well do you sleep at night?',
    category: 'energy',
    scale: '1 = Very Poorly, 10 = Excellently'
  }
];

export const WellnessAssessment: React.FC = () => {
  const [, setScreenState] = useAtom(screenAtom);
  const [, updateWellnessMetrics] = useAtom(updateWellnessMetricsAtom);
  const [employeeProfile] = useAtom(employeeProfileAtom);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [isCompleted, setIsCompleted] = useState(false);

  const handleAnswer = (value: number) => {
    const questionId = assessmentQuestions[currentQuestion].id;
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const handleNext = () => {
    if (currentQuestion < assessmentQuestions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      completeAssessment();
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const completeAssessment = () => {
    // Calculate metrics based on answers
    const stressAnswers = Object.entries(answers)
      .filter(([key]) => key.includes('stress'))
      .map(([, value]) => value);
    
    const energyAnswers = Object.entries(answers)
      .filter(([key]) => key.includes('energy'))
      .map(([, value]) => value);
    
    const workloadAnswers = Object.entries(answers)
      .filter(([key]) => key.includes('workload'))
      .map(([, value]) => value);
    
    const balanceAnswers = Object.entries(answers)
      .filter(([key]) => key.includes('balance'))
      .map(([, value]) => value);

    const avgStress = stressAnswers.reduce((a, b) => a + b, 0) / stressAnswers.length;
    const avgEnergy = energyAnswers.reduce((a, b) => a + b, 0) / energyAnswers.length;
    const avgWorkload = workloadAnswers.reduce((a, b) => a + b, 0) / workloadAnswers.length;
    const avgBalance = balanceAnswers.reduce((a, b) => a + b, 0) / balanceAnswers.length;

    // Determine burnout risk
    const riskScore = (avgStress + (10 - avgEnergy) + (10 - avgWorkload) + (10 - avgBalance)) / 4;
    let burnoutRisk: 'low' | 'medium' | 'high' = 'medium';
    
    if (riskScore <= 3) burnoutRisk = 'low';
    else if (riskScore <= 6) burnoutRisk = 'medium';
    else burnoutRisk = 'high';

    updateWellnessMetrics({
      stressLevel: Math.round(avgStress),
      energyLevel: Math.round(avgEnergy),
      workloadSatisfaction: Math.round(avgWorkload),
      workLifeBalance: Math.round(avgBalance),
      burnoutRisk,
      weeklyTrend: 'stable' // This would be calculated based on historical data
    });

    setIsCompleted(true);
  };

  const handleBackToDashboard = () => {
    setScreenState({ currentScreen: "dashboard" });
  };

  if (isCompleted) {
    return (
      <AnimatedWrapper>
        <TextBlockWrapper>
          <div className="text-center max-w-2xl">
            <CheckCircle className="size-16 text-green-400 mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-white mb-4">Assessment Complete!</h2>
            <p className="text-gray-300 mb-8">
              Thank you for completing your wellness assessment. Your results have been saved 
              and your dashboard has been updated with your current wellness metrics.
            </p>
            <div className="space-y-4">
              <Button 
                onClick={handleBackToDashboard}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                View Dashboard
              </Button>
              <Button 
                onClick={() => setScreenState({ currentScreen: "instructions" })}
                variant="outline"
                className="w-full"
              >
                Talk to AI Wellness Coach
              </Button>
            </div>
          </div>
        </TextBlockWrapper>
      </AnimatedWrapper>
    );
  }

  const currentQ = assessmentQuestions[currentQuestion];
  const currentAnswer = answers[currentQ.id];
  const progress = ((currentQuestion + 1) / assessmentQuestions.length) * 100;

  return (
    <AnimatedWrapper>
      <div className="w-full h-full p-6 flex flex-col">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-white">Wellness Assessment</h1>
            <span className="text-gray-300">
              {currentQuestion + 1} of {assessmentQuestions.length}
            </span>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-white/20 rounded-full h-2">
            <div 
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Question */}
        <div className="flex-1 flex flex-col justify-center max-w-3xl mx-auto w-full">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 border border-white/20">
            <h2 className="text-xl font-semibold text-white mb-4">
              {currentQ.question}
            </h2>
            <p className="text-gray-300 mb-8 text-sm">
              {currentQ.scale}
            </p>

            {/* Rating Scale */}
            <div className="grid grid-cols-5 md:grid-cols-10 gap-2 mb-8">
              {Array.from({ length: 10 }, (_, i) => i + 1).map((value) => (
                <button
                  key={value}
                  onClick={() => handleAnswer(value)}
                  className={`
                    aspect-square rounded-lg border-2 transition-all duration-200 font-semibold
                    ${currentAnswer === value 
                      ? 'bg-blue-500 border-blue-400 text-white' 
                      : 'bg-white/10 border-white/30 text-gray-300 hover:bg-white/20'
                    }
                  `}
                >
                  {value}
                </button>
              ))}
            </div>

            {/* Navigation */}
            <div className="flex justify-between">
              <Button
                onClick={handlePrevious}
                disabled={currentQuestion === 0}
                variant="outline"
                className="flex items-center gap-2"
              >
                <ArrowLeft className="size-4" />
                Previous
              </Button>
              
              <Button
                onClick={handleNext}
                disabled={!currentAnswer}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
              >
                {currentQuestion === assessmentQuestions.length - 1 ? 'Complete' : 'Next'}
                <ArrowRight className="size-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </AnimatedWrapper>
  );
};