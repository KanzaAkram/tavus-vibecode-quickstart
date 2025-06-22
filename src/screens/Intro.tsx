import { AnimatedWrapper } from "@/components/DialogWrapper";
import React from "react";
import { useAtom } from "jotai";
import { screenAtom } from "@/store/screens";
import { employeeProfileAtom } from "@/store/wellness";
import { Unlock, Heart, Brain, Activity } from "lucide-react";
import AudioButton from "@/components/AudioButton";
import { apiTokenAtom } from "@/store/tokens";
import { Input } from "@/components/ui/input";

export const Intro: React.FC = () => {
  const [, setScreenState] = useAtom(screenAtom);
  const [token, setToken] = useAtom(apiTokenAtom);
  const [employeeProfile] = useAtom(employeeProfileAtom);

  const handleClick = () => {
    if (employeeProfile) {
      setScreenState({ currentScreen: "dashboard" });
    } else {
      setScreenState({ currentScreen: "settings" });
    }
  };

  return (
    <AnimatedWrapper>
      <div className="flex size-full flex-col items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/50 via-purple-900/50 to-indigo-900/50" />
        
        <div className="relative z-10 flex flex-col items-center gap-6 py-8 px-6 rounded-2xl border border-white/20 max-w-md w-full" 
          style={{ 
            fontFamily: 'Inter, sans-serif',
            background: 'rgba(0,0,0,0.4)',
            backdropFilter: 'blur(10px)'
          }}>
          
          {/* Logo and Icons */}
          <div className="flex items-center gap-4 mb-4">
            <Heart className="size-8 text-red-400" />
            <Brain className="size-8 text-blue-400" />
            <Activity className="size-8 text-green-400" />
          </div>

          <h1 className="text-2xl font-bold text-white mb-2 text-center" style={{ fontFamily: 'Source Code Pro, monospace' }}>
            WellnessAI
          </h1>
          
          <p className="text-center text-gray-300 mb-6">
            Your AI-powered corporate wellness companion. Track stress, boost productivity, and prevent burnout.
          </p>

          <div className="flex flex-col gap-4 items-center w-full">
            <Input
              type="password"
              value={token || ""}
              onChange={(e) => {
                const newToken = e.target.value;
                setToken(newToken);
                localStorage.setItem('tavus-token', newToken);
              }}
              placeholder="Enter Tavus API Key"
              className="w-full bg-white/10 text-white rounded-lg border border-white/30 px-4 py-3 text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              style={{ 
                color: 'white', 
                fontFamily: 'Source Code Pro, monospace',
              }}
            />

            <p className="text-sm text-gray-300 text-center">
              Don't have a key?{" "}
              <a
                href="https://platform.tavus.io/api-keys"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-blue-400 transition-colors"
              >
                Create an account
              </a>
            </p>
          </div>

          <AudioButton 
            onClick={handleClick}
            className="w-full flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-6 py-3 text-white font-semibold transition-all duration-200 disabled:opacity-50"
            disabled={!token}
          >
            <Unlock className="size-4" />
            {employeeProfile ? 'Go to Dashboard' : 'Get Started'}
          </AudioButton>

          {/* Features */}
          <div className="grid grid-cols-1 gap-3 w-full mt-6 text-sm">
            <div className="flex items-center gap-3 text-gray-300">
              <Heart className="size-4 text-red-400" />
              <span>Stress & Burnout Monitoring</span>
            </div>
            <div className="flex items-center gap-3 text-gray-300">
              <Brain className="size-4 text-blue-400" />
              <span>AI-Powered Wellness Coaching</span>
            </div>
            <div className="flex items-center gap-3 text-gray-300">
              <Activity className="size-4 text-green-400" />
              <span>Productivity Enhancement</span>
            </div>
          </div>
        </div>
      </div>
    </AnimatedWrapper>
  );
};