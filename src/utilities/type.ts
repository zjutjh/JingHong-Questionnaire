export interface BaseConfig {
  dayLimit: number;
  endTime: string;
  startTime: string;
  verify: boolean;
  [property: string]: any;
}
