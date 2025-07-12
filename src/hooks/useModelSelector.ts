import { create } from 'zustand';
import { AVAILABLE_MODELS } from '@/lib/models';

type ModelState = {
  model: string;
  setModel: (model: string) => void;
};

export const useModelSelector = create<ModelState>((set) => ({
  model: AVAILABLE_MODELS[0].value, // Default to first model
  setModel: (model: string) => {
    set({ model });
  },
}));
