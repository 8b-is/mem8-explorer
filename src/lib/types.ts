// Type definitions for Mem8 Explorer

export interface Concept {
  title: string;
  emoji: string;
  description: string;
  file: string;
  color: string;
}

export interface Memory {
  id: number;
  timestamp: number;
  text: string;
  frequency: number;
  amplitude: number;
  emotion: {
    valence: number;
    arousal: number;
    dominance: number;
  };
  project?: string;
}

export interface Wave {
  frequency: number;
  amplitude: number;
  phase: number;
  color: string;
  label: string;
}

export interface NavigateEvent {
  detail: {
    path: string;
  };
}