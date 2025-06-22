import React from "react";
import { useAtom } from "jotai";
import { AnimatedWrapper, TextBlockWrapper } from "@/components/DialogWrapper";
import { screenAtom } from "@/store/screens";
import { employeeProfileAtom, burnoutRiskAtom } from "@/store/wellness";
import { Button } from "@/components/ui/button";
import { 
  Activity, 
  Brain, 
  Heart, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle,
  MessageCircle,
  BarChart3
} from "lucide-react";

export const Dashboard: React.FC = () => {
  const [, setScreenState] = useAtom(screenAtom);
  const [employeeProfile] = useAtom(employeeProfileAtom);
  const [burnoutRisk] = useAtom(burnoutRiskAtom);

  const handleWellnessAssessment = () => {
    setScreenState({ currentScreen: "wellnessAssessment" });
  };

  const handleAICoach = () => {
    setScreenState({ currentScreen: "instructions" });
  };

  if (!employeeProfile) {
    return (
      <AnimatedWrapper>
        <TextBlockWrapper>
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white mb-4">Welcome to WellnessAI</h2>
            <p className="text-gray-300 mb-6">Please complete your profile setup first.</p>
            <Button onClick={() => setScreenState({ currentScreen: "settings" })}>
              Setup Profile
            </Button>
          </div>
        </TextBlockWrapper>
      </AnimatedWrapper>
    );
  }

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'text-green-400';
      case 'medium': return 'text-yellow-400';
      case 'high': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getRiskIcon = (risk: string) => {
    switch (risk) {
      case 'low': return <CheckCircle className="size-5" />;
      case 'medium': return <AlertTriangle className="size-5" />;
      case 'high': return <AlertTriangle className="size-5" />;
      default: return <Activity className="size-5" />;
    }
  };

  return (
    <AnimatedWrapper>
      <div className="w-full h-full p-6 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">
              Welcome back, {employeeProfile.name}
            </h1>
            <p className="text-gray-300">
              {employeeProfile.role} • {employeeProfile.department}
            </p>
          </div>

          {/* Wellness Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <div className="flex items-center justify-between mb-4">
                <Heart className="size-8 text-red-400" />
                <span className="text-2xl font-bold text-white">
                  {employeeProfile.wellnessMetrics.stressLevel}/10
                </span>
              </div>
              <h3 className="text-white font-semibold mb-1">Stress Level</h3>
              <p className="text-gray-400 text-sm">Current stress rating</p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <div className="flex items-center justify-between mb-4">
                <Activity className="size-8 text-green-400" />
                <span className="text-2xl font-bold text-white">
                  {employeeProfile.wellnessMetrics.energyLevel}/10
                </span>
              </div>
              <h3 className="text-white font-semibold mb-1">Energy Level</h3>
              <p className="text-gray-400 text-sm">Current energy rating</p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <div className="flex items-center justify-between mb-4">
                <Brain className="size-8 text-blue-400" />
                <span className="text-2xl font-bold text-white">
                  {employeeProfile.wellnessMetrics.workLifeBalance}/10
                </span>
              </div>
              <h3 className="text-white font-semibold mb-1">Work-Life Balance</h3>
              <p className="text-gray-400 text-sm">Balance satisfaction</p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <div className="flex items-center justify-between mb-4">
                <div className={getRiskColor(burnoutRisk)}>
                  {getRiskIcon(burnoutRisk)}
                </div>
                <span className={`text-2xl font-bold capitalize ${getRiskColor(burnoutRisk)}`}>
                  {burnoutRisk}
                </span>
              </div>
              <h3 className="text-white font-semibold mb-1">Burnout Risk</h3>
              <p className="text-gray-400 text-sm">Current risk level</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <div className="flex items-center mb-4">
                <BarChart3 className="size-8 text-purple-400 mr-3" />
                <div>
                  <h3 className="text-xl font-semibold text-white">Wellness Assessment</h3>
                  <p className="text-gray-300">Track your current wellness metrics</p>
                </div>
              </div>
              <Button 
                onClick={handleWellnessAssessment}
                className="w-full bg-purple-600 hover:bg-purple-700"
              >
                Take Assessment
              </Button>
            </div>

            <div className="bg-gradient-to-r from-green-600/20 to-teal-600/20 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <div className="flex items-center mb-4">
                <MessageCircle className="size-8 text-green-400 mr-3" />
                <div>
                  <h3 className="text-xl font-semibold text-white">AI Wellness Coach</h3>
                  <p className="text-gray-300">Get personalized wellness guidance</p>
                </div>
              </div>
              <Button 
                onClick={handleAICoach}
                className="w-full bg-green-600 hover:bg-green-700"
              >
                Chat with AI Coach
              </Button>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
              <TrendingUp className="size-6 mr-2" />
              Recent Activity
            </h3>
            <div className="space-y-3">
              {employeeProfile.wellnessMetrics.lastAssessment ? (
                <div className="flex items-center justify-between py-2 border-b border-white/10">
                  <span className="text-gray-300">Last wellness assessment</span>
                  <span className="text-white">
                    {employeeProfile.wellnessMetrics.lastAssessment.toLocaleDateString()}
                  </span>
                </div>
              ) : (
                <div className="text-gray-400 text-center py-4">
                  No recent activity. Take your first wellness assessment!
                </div>
              )}
              <div className="flex items-center justify-between py-2 border-b border-white/10">
                <span className="text-gray-300">Weekly trend</span>
                <span className={`capitalize ${
                  employeeProfile.wellnessMetrics.weeklyTrend === 'improving' ? 'text-green-400' :
                  employeeProfile.wellnessMetrics.weeklyTrend === 'declining' ? 'text-red-400' :
                  'text-yellow-400'
                }`}>
                  {employeeProfile.wellnessMetrics.weeklyTrend}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AnimatedWrapper>
  );
};