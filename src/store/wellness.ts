import { atom } from "jotai";

export interface WellnessMetrics {
  stressLevel: number; // 1-10 scale
  energyLevel: number; // 1-10 scale
  workloadSatisfaction: number; // 1-10 scale
  workLifeBalance: number; // 1-10 scale
  burnoutRisk: 'low' | 'medium' | 'high';
  lastAssessment: Date | null;
  weeklyTrend: 'improving' | 'stable' | 'declining';
}

export interface EmployeeProfile {
  id: string;
  name: string;
  department: string;
  role: string;
  joinDate: Date;
  manager: string;
  wellnessMetrics: WellnessMetrics;
}

const initialWellnessMetrics: WellnessMetrics = {
  stressLevel: 5,
  energyLevel: 5,
  workloadSatisfaction: 5,
  workLifeBalance: 5,
  burnoutRisk: 'medium',
  lastAssessment: null,
  weeklyTrend: 'stable',
};

const getInitialProfile = (): EmployeeProfile | null => {
  const savedProfile = localStorage.getItem('employee-profile');
  if (savedProfile) {
    const profile = JSON.parse(savedProfile);
    // Convert date strings back to Date objects
    profile.joinDate = new Date(profile.joinDate);
    if (profile.wellnessMetrics.lastAssessment) {
      profile.wellnessMetrics.lastAssessment = new Date(profile.wellnessMetrics.lastAssessment);
    }
    return profile;
  }
  return null;
};

export const employeeProfileAtom = atom<EmployeeProfile | null>(getInitialProfile());
export const wellnessMetricsAtom = atom<WellnessMetrics>(initialWellnessMetrics);

// Derived atom for burnout risk calculation
export const burnoutRiskAtom = atom((get) => {
  const profile = get(employeeProfileAtom);
  if (!profile) return 'medium';
  
  const { stressLevel, energyLevel, workLifeBalance, workloadSatisfaction } = profile.wellnessMetrics;
  const riskScore = (stressLevel + (10 - energyLevel) + (10 - workLifeBalance) + (10 - workloadSatisfaction)) / 4;
  
  if (riskScore <= 3) return 'low';
  if (riskScore <= 6) return 'medium';
  return 'high';
});

// Action atom to update wellness metrics
export const updateWellnessMetricsAtom = atom(
  null,
  (get, set, newMetrics: Partial<WellnessMetrics>) => {
    const currentProfile = get(employeeProfileAtom);
    if (!currentProfile) return;
    
    const updatedMetrics = {
      ...currentProfile.wellnessMetrics,
      ...newMetrics,
      lastAssessment: new Date(),
    };
    
    const updatedProfile = {
      ...currentProfile,
      wellnessMetrics: updatedMetrics,
    };
    
    set(employeeProfileAtom, updatedProfile);
    localStorage.setItem('employee-profile', JSON.stringify(updatedProfile));
  }
);