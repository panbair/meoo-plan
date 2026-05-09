declare module '../page2/animationOptions' {
  export const animationOptions: Array<{
    label: string;
    options: Array<{
      value: string;
      label: string;
    }>;
  }>;
}

declare module '../page2/animation/config' {
  import { TweenVars } from 'gsap';

  export const config: Record<string, {
    type: 'timeline' | 'fromTo' | 'to';
    animations: TweenVars[];
  }>;
}
