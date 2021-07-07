import Undertaker from 'undertaker';

export interface TaskFunc {
  (cb: Undertaker.TaskCallback): void;
}
