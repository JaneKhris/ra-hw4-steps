export interface IForm {
    date: string;
    km: string;
  }
  
export interface IStep {
    date: Date;
    km: number;
  }
  
export type TStepsArray = IStep[];
  