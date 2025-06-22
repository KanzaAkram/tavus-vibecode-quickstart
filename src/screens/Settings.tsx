import {
  DialogWrapper,
  AnimatedTextBlockWrapper,
} from "@/components/DialogWrapper";
import { cn } from "@/utils";
import { useAtom } from "jotai";
import { settingsAtom, settingsSavedAtom } from "@/store/settings";
import { employeeProfileAtom, EmployeeProfile } from "@/store/wellness";
import { screenAtom } from "@/store/screens";
import { X } from "lucide-react";
import * as React from "react";
import { apiTokenAtom } from "@/store/tokens";

// Button Component
const Button = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: "ghost" | "outline";
    size?: "icon";
  }
>(({ className, variant, size, ...props }, ref) => {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50",
        {
          "border border-input bg-transparent hover:bg-accent": variant === "outline",
          "hover:bg-accent hover:text-accent-foreground": variant === "ghost",
          "size-10": size === "icon",
        },
        className
      )}
      ref={ref}
      {...props}
    />
  );
});
Button.displayName = "Button";

// Input Component
const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => {
  return (
    <input
      className={cn(
        "flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      ref={ref}
      {...props}
    />
  );
});
Input.displayName = "Input";

// Select Component
const Select = React.forwardRef<
  HTMLSelectElement,
  React.SelectHTMLAttributes<HTMLSelectElement>
>(({ className, ...props }, ref) => {
  return (
    <select
      className={cn(
        "flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      ref={ref}
      {...props}
    />
  );
});
Select.displayName = "Select";

// Label Component
const Label = React.forwardRef<
  HTMLLabelElement,
  React.LabelHTMLAttributes<HTMLLabelElement>
>(({ className, ...props }, ref) => {
  return (
    <label
      ref={ref}
      className={cn(
        "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
        className
      )}
      {...props}
    />
  );
});
Label.displayName = "Label";

export const Settings: React.FC = () => {
  const [settings, setSettings] = useAtom(settingsAtom);
  const [employeeProfile, setEmployeeProfile] = useAtom(employeeProfileAtom);
  const [, setScreenState] = useAtom(screenAtom);
  const [token, setToken] = useAtom(apiTokenAtom);
  const [, setSettingsSaved] = useAtom(settingsSavedAtom);

  // Local state for form
  const [formData, setFormData] = React.useState({
    name: employeeProfile?.name || "",
    department: employeeProfile?.department || "",
    role: employeeProfile?.role || "",
    manager: employeeProfile?.manager || "",
    persona: settings.persona || "",
    greeting: settings.greeting || "",
    context: settings.context || "",
  });

  const departments = [
    "Engineering",
    "Marketing",
    "Sales",
    "Human Resources",
    "Finance",
    "Operations",
    "Customer Support",
    "Product Management",
    "Design",
    "Legal"
  ];

  const handleClose = () => {
    if (employeeProfile) {
      setScreenState({ currentScreen: "dashboard" });
    } else {
      setScreenState({ currentScreen: "intro" });
    }
  };

  const handleSave = async () => {
    // Update settings
    const updatedSettings = {
      ...settings,
      persona: formData.persona,
      greeting: formData.greeting,
      context: formData.context,
    };
    
    // Create or update employee profile
    const profileData: EmployeeProfile = {
      id: employeeProfile?.id || `emp_${Date.now()}`,
      name: formData.name,
      department: formData.department,
      role: formData.role,
      manager: formData.manager,
      joinDate: employeeProfile?.joinDate || new Date(),
      wellnessMetrics: employeeProfile?.wellnessMetrics || {
        stressLevel: 5,
        energyLevel: 5,
        workloadSatisfaction: 5,
        workLifeBalance: 5,
        burnoutRisk: 'medium',
        lastAssessment: null,
        weeklyTrend: 'stable',
      },
    };

    // Save to localStorage and atoms
    localStorage.setItem('tavus-settings', JSON.stringify(updatedSettings));
    localStorage.setItem('employee-profile', JSON.stringify(profileData));
    
    setSettings(updatedSettings);
    setEmployeeProfile(profileData);
    setSettingsSaved(true);
    
    // Navigate to dashboard
    setScreenState({ currentScreen: "dashboard" });
  };

  return (
    <DialogWrapper>
      <AnimatedTextBlockWrapper>
        <div className="relative w-full max-w-2xl">
          <div className="sticky top-0 pt-8 pb-6 z-10">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleClose}
              className="absolute right-0 top-8"
            >
              <X className="size-6" />
            </Button>
            
            <h2 className="text-2xl font-bold text-white">
              {employeeProfile ? 'Profile Settings' : 'Setup Your Profile'}
            </h2>
          </div>
          
          <div className="h-[calc(100vh-500px)] overflow-y-auto pr-4 -mr-4">
            <div className="space-y-6">
              {/* Employee Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white border-b border-gray-700 pb-2">
                  Employee Information
                </h3>
                
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter your full name"
                    className="bg-black/20 font-mono"
                    style={{ fontFamily: "'Source Code Pro', monospace" }}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="department">Department *</Label>
                  <Select
                    id="department"
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="bg-black/20 font-mono"
                    style={{ fontFamily: "'Source Code Pro', monospace" }}
                    required
                  >
                    <option value="" className="bg-black text-white">Select Department</option>
                    {departments.map((dept) => (
                      <option 
                        key={dept} 
                        value={dept}
                        className="bg-black text-white font-mono"
                        style={{ fontFamily: "'Source Code Pro', monospace" }}
                      >
                        {dept}
                      </option>
                    ))}
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="role">Job Role *</Label>
                  <Input
                    id="role"
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    placeholder="e.g., Senior Software Engineer"
                    className="bg-black/20 font-mono"
                    style={{ fontFamily: "'Source Code Pro', monospace" }}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="manager">Manager Name</Label>
                  <Input
                    id="manager"
                    value={formData.manager}
                    onChange={(e) => setFormData({ ...formData, manager: e.target.value })}
                    placeholder="Enter your manager's name"
                    className="bg-black/20 font-mono"
                    style={{ fontFamily: "'Source Code Pro', monospace" }}
                  />
                </div>
              </div>

              {/* AI Configuration */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white border-b border-gray-700 pb-2">
                  AI Wellness Coach Configuration
                </h3>

                <div className="space-y-2">
                  <Label htmlFor="persona">Custom Persona ID</Label>
                  <Input
                    id="persona"
                    value={formData.persona}
                    onChange={(e) => setFormData({ ...formData, persona: e.target.value })}
                    placeholder="p2fbd605"
                    className="bg-black/20 font-mono"
                    style={{ fontFamily: "'Source Code Pro', monospace" }}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="greeting">Custom Greeting</Label>
                  <Input
                    id="greeting"
                    value={formData.greeting}
                    onChange={(e) => setFormData({ ...formData, greeting: e.target.value })}
                    placeholder="Hi! I'm your wellness coach..."
                    className="bg-black/20 font-mono"
                    style={{ fontFamily: "'Source Code Pro', monospace" }}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="context">Wellness Context</Label>
                  <textarea
                    id="context"
                    value={formData.context}
                    onChange={(e) => setFormData({ ...formData, context: e.target.value })}
                    placeholder="You are a corporate wellness coach focused on helping employees manage stress, prevent burnout, and improve productivity..."
                    className="min-h-[100px] bg-black/20 font-mono w-full rounded-md border border-input px-3 py-2 text-sm"
                    style={{ fontFamily: "'Source Code Pro', monospace" }}
                  />
                </div>
              </div>

              {/* API Configuration */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white border-b border-gray-700 pb-2">
                  API Configuration
                </h3>

                <div className="space-y-2">
                  <Label htmlFor="apiToken">Tavus API Token *</Label>
                  <Input
                    id="apiToken"
                    type="password"
                    value={token || ""}
                    onChange={(e) => {
                      const newToken = e.target.value;
                      setToken(newToken);
                      localStorage.setItem('tavus-token', newToken);
                    }}
                    placeholder="Enter Tavus API Key"
                    className="bg-black/20 font-mono"
                    style={{ fontFamily: "'Source Code Pro', monospace" }}
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="sticky bottom-0 mt-6 border-t border-gray-700 pt-6 pb-8">
            <button
              onClick={handleSave}
              disabled={!formData.name || !formData.department || !formData.role || !token}
              className="hover:shadow-footer-btn relative flex items-center justify-center gap-2 rounded-3xl border border-[rgba(255,255,255,0.3)] bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-6 py-3 text-sm font-bold text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {employeeProfile ? 'Save Changes' : 'Create Profile'}
            </button>
          </div>
        </div>
      </AnimatedTextBlockWrapper>
    </DialogWrapper>
  );
};