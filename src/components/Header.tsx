import { memo } from "react";
import { Button } from "./ui/button";
import { Settings, Check, BarChart3, Home } from "lucide-react";
import { useAtom } from "jotai";
import { screenAtom } from "@/store/screens";
import { conversationAtom } from "@/store/conversation";
import { settingsSavedAtom } from "@/store/settings";
import { employeeProfileAtom } from "@/store/wellness";

export const Header = memo(() => {
  const [, setScreenState] = useAtom(screenAtom);
  const [conversation] = useAtom(conversationAtom);
  const [settingsSaved] = useAtom(settingsSavedAtom);
  const [employeeProfile] = useAtom(employeeProfileAtom);

  const handleSettings = () => {
    if (!conversation) {
      setScreenState({ currentScreen: "settings" });
    }
  };

  const handleDashboard = () => {
    if (!conversation && employeeProfile) {
      setScreenState({ currentScreen: "dashboard" });
    }
  };

  return (
    <header className="flex w-full items-start justify-between" style={{ fontFamily: 'Inter, sans-serif' }}>
      <div className="flex items-center gap-4">
        <div className="text-white font-bold text-xl">WellnessAI</div>
        {employeeProfile && (
          <Button
            variant="outline"
            size="icon"
            onClick={handleDashboard}
            className="relative size-10 sm:size-14 border-0 bg-transparent hover:bg-zinc-800"
          >
            <Home className="size-4 sm:size-6" />
          </Button>
        )}
      </div>
      
      <div className="flex items-center gap-2">
        <div className="relative">
          {settingsSaved && (
            <div className="absolute -top-2 -right-2 z-20 rounded-full bg-green-500 p-1 animate-fade-in">
              <Check className="size-3" />
            </div>
          )}
          <Button
            variant="outline"
            size="icon"
            onClick={handleSettings}
            className="relative size-10 sm:size-14 border-0 bg-transparent hover:bg-zinc-800"
          >
            <Settings className="size-4 sm:size-6" />
          </Button>
        </div>
      </div>
    </header>
  );
});