import type { Grade, Semester } from '@/lib/questions/types';

export type RootStackParamList = {
  Profiles: undefined;
  Home: undefined;
  Semester: { grade: Grade };
  TopicSelect: { grade: Grade; semester: Semester | 'all' };
  Practice: {
    grade: Grade;
    semester: Semester | 'all';
    topics: string[];
    count: number;
  };
  Result: { sessionId: string };
  Wheel: { sessionId: string };
  Rewards: undefined;
  ParentGate: { next: keyof RootStackParamList };
  ParentSettings: undefined;
  ParentProfilesEdit: undefined;
  ParentRewardsEdit: undefined;
  ParentHistory: undefined;
  ParentWheelConfig: undefined;
  ParentPin: undefined;
};
