import { create } from 'zustand';

const DEFAULT_MODEL = 'deepseek:deepseek-chat';

type ModelStore = {
  model: string;
  setModel: (model: string) => void;
};

export const useModelSelector = create<ModelStore>((set) => ({
  model: DEFAULT_MODEL,
  setModel: (model) => set({ model }),
}));
