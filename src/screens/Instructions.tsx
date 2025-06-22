import { createConversation } from "@/api";
import {
  DialogWrapper,
  AnimatedTextBlockWrapper,
} from "@/components/DialogWrapper";
import { screenAtom } from "@/store/screens";
import { conversationAtom } from "@/store/conversation";
import React, { useCallback, useMemo, useState } from "react";
import { useAtom, useAtomValue } from "jotai";
import { AlertTriangle, Mic, Video, Brain } from "lucide-react";
import { useDaily, useDailyEvent, useDevices } from "@daily-co/daily-react";
import { ConversationError } from "./ConversationError";
import zoomSound from "@/assets/sounds/zoom.mp3";
import { Button } from "@/components/ui/button";
import { apiTokenAtom } from "@/store/tokens";
import { employeeProfileAtom } from "@/store/wellness";
import { quantum } from 'ldrs';

// Register the quantum loader
quantum.register();

const useCreateConversationMutation = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [, setScreenState] = useAtom(screenAtom);
  const [, setConversation] = useAtom(conversationAtom);
  const token = useAtomValue(apiTokenAtom);

  const createConversationRequest = async () => {
    try {
      if (!token) {
        throw new Error("Token is required");
      }
      const conversation = await createConversation(token);
      setConversation(conversation);
      setScreenState({ currentScreen: "conversation" });
    } catch (error) {
      setError(error as string);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    error,
    createConversationRequest,
  };
};

export const Instructions: React.FC = () => {
  const daily = useDaily();
  const { currentMic, setMicrophone, setSpeaker } = useDevices();
  const { createConversationRequest } = useCreateConversationMutation();
  const [getUserMediaError, setGetUserMediaError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingConversation, setIsLoadingConversation] = useState(false);
  const [error, setError] = useState(false);
  const [employeeProfile] = useAtom(employeeProfileAtom);
  const audio = useMemo(() => {
    const audioObj = new Audio(zoomSound);
    audioObj.volume = 0.7;
    return audioObj;
  }, []);
  const [isPlayingSound, setIsPlayingSound] = useState(false);

  useDailyEvent(
    "camera-error",
    useCallback(() => {
      setGetUserMediaError(true);
    }, []),
  );

  const handleClick = async () => {
    try {
      setIsLoading(true);
      setIsPlayingSound(true);
      
      audio.currentTime = 0;
      await audio.play();
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setIsPlayingSound(false);
      setIsLoadingConversation(true);
      
      let micDeviceId = currentMic?.device?.deviceId;
      if (!micDeviceId) {
        const res = await daily?.startCamera({
          startVideoOff: false,
          startAudioOff: false,
          audioSource: "default",
        });
        // @ts-expect-error deviceId exists in the MediaDeviceInfo
        const isDefaultMic = res?.mic?.deviceId === "default";
        // @ts-expect-error deviceId exists in the MediaDeviceInfo
        const isDefaultSpeaker = res?.speaker?.deviceId === "default";
        // @ts-expect-error deviceId exists in the MediaDeviceInfo
        micDeviceId = res?.mic?.deviceId;

        if (isDefaultMic) {
          if (!isDefaultMic) {
            setMicrophone("default");
          }
          if (!isDefaultSpeaker) {
            setSpeaker("default");
          }
        }
      }
      if (micDeviceId) {
        await createConversationRequest();
      } else {
        setGetUserMediaError(true);
      }
    } catch (error) {
      console.error(error);
      setError(true);
    } finally {
      setIsLoading(false);
      setIsLoadingConversation(false);
    }
  };

  if (isPlayingSound || isLoadingConversation) {
    return (
      <DialogWrapper>
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/80 via-purple-900/80 to-indigo-900/80" />
        <AnimatedTextBlockWrapper>
          <div className="flex flex-col items-center justify-center gap-4">
            <l-quantum
              size="45"
              speed="1.75"
              color="white"
            ></l-quantum>
            <p className="text-white text-lg">Connecting to your AI Wellness Coach...</p>
          </div>
        </AnimatedTextBlockWrapper>
      </DialogWrapper>
    );
  }

  if (error) {
    return <ConversationError onClick={handleClick} />;
  }

  const getBurnoutRiskMessage = () => {
    if (!employeeProfile) return "";
    
    const risk = employeeProfile.wellnessMetrics.burnoutRisk;
    switch (risk) {
      case 'high':
        return "Your recent assessment shows high burnout risk. Let's work together to address this.";
      case 'medium':
        return "Your wellness metrics show some areas for improvement. I'm here to help!";
      case 'low':
        return "Great job maintaining your wellness! Let's keep building on your success.";
      default:
        return "";
    }
  };

  return (
    <DialogWrapper>
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/80 via-purple-900/80 to-indigo-900/80" />
      <AnimatedTextBlockWrapper>
        <div className="max-w-2xl text-center">
          <Brain className="size-16 text-blue-400 mx-auto mb-6" />
          
          <h1 className="mb-4 pt-1 text-center text-3xl sm:text-4xl lg:text-5xl font-semibold text-white">
            Meet Your AI Wellness Coach
          </h1>
          
          <p className="max-w-[650px] text-center text-base sm:text-lg text-gray-300 mb-6">
            Have a personalized conversation with your AI wellness coach. Get support for stress management, 
            productivity tips, and burnout prevention strategies tailored to your needs.
          </p>

          {employeeProfile && (
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 mb-8 border border-white/20">
              <p className="text-white font-medium mb-2">
                Hello, {employeeProfile.name}!
              </p>
              <p className="text-gray-300 text-sm">
                {getBurnoutRiskMessage()}
              </p>
            </div>
          )}

          <Button
            onClick={handleClick}
            className="relative z-20 flex items-center justify-center gap-2 rounded-3xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-8 py-3 text-white font-semibold transition-all duration-200 mb-8 disabled:opacity-50"
            disabled={isLoading}
          >
            <Video className="size-5" />
            Start Wellness Session
            {getUserMediaError && (
              <div className="absolute -top-1 left-0 right-0 flex items-center gap-1 text-wrap rounded-lg border bg-red-500 p-2 text-white backdrop-blur-sm">
                <AlertTriangle className="text-red size-4" />
                <p>
                  To chat with your wellness coach, please allow microphone and camera access.
                </p>
              </div>
            )}
          </Button>

          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:gap-8 text-gray-300 justify-center">
            <div className="flex items-center gap-3 bg-white/10 px-4 py-2 rounded-full">
              <Mic className="size-5 text-blue-400" />
              Microphone required
            </div>
            <div className="flex items-center gap-3 bg-white/10 px-4 py-2 rounded-full">
              <Video className="size-5 text-blue-400" />
              Camera recommended
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="bg-white/5 rounded-lg p-4">
              <h3 className="text-white font-semibold mb-2">Stress Management</h3>
              <p className="text-gray-400">Learn techniques to manage workplace stress effectively</p>
            </div>
            <div className="bg-white/5 rounded-lg p-4">
              <h3 className="text-white font-semibold mb-2">Productivity Tips</h3>
              <p className="text-gray-400">Get personalized advice to boost your work efficiency</p>
            </div>
            <div className="bg-white/5 rounded-lg p-4">
              <h3 className="text-white font-semibold mb-2">Burnout Prevention</h3>
              <p className="text-gray-400">Identify early signs and prevent workplace burnout</p>
            </div>
          </div>

          <span className="absolute bottom-6 px-4 text-sm text-gray-500 sm:bottom-8 sm:px-8 text-center">
            Your wellness conversations are confidential and designed to support your professional growth.
          </span>
        </div>
      </AnimatedTextBlockWrapper>
    </DialogWrapper>
  );
};