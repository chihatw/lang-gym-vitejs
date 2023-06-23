export interface IRandomWorkout {
  id: string;
  uid: string;
  cues: IRandomWorkoutCue[];
  cueIds: string[];
  title: string;
  beatCount: number;
  targetBpm: number;
  resultBpm: number;
  createdAt: number;
  roundCount: number;
  storagePath: string;
  recordCount: number;
  resultSeconds: number;
}

export interface IRandomWorkoutCue {
  id: string;
  label: string;
  pitchStr: string;
}
