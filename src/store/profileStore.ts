import { create } from 'zustand';
import type { Profile } from '@/lib/db/profiles';

type ProfileState = {
  current: Profile | null;
  setCurrent: (p: Profile | null) => void;
  updateCurrent: (patch: Partial<Profile>) => void;
};

export const useProfileStore = create<ProfileState>((set) => ({
  current: null,
  setCurrent: (current) => set({ current }),
  updateCurrent: (patch) =>
    set((s) => (s.current ? { current: { ...s.current, ...patch } } : s)),
}));
