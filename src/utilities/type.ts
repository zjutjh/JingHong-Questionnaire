import { QuesItemType } from "@/utilities/constMap.ts";
import { QuesStatus, QuesType } from "../../utilities/constMap";

interface BaseConfig {
  dayLimit: number;
  endTime: string;
  startTime: string;
  verify: boolean;
  [property: string]: any;
}

interface QuesConfig {
  desc: string;
  questionList: Question[];
  title: string;
  [property: string]: any;
}

interface Option {
  serialNum: number;
  content: string;
  description?: string;
  img?: string;
  [property: string]: any;
}

// 基础问题类型
interface BaseQuestion {
  serialNum: number;
  subject: string;
  description?: string;
  img?: string;
  quesSetting: QuesSetting;
}

// 单选题
interface RadioQuestion extends BaseQuestion {
  options: Option[];
}

// 多选题
interface CheckboxQuestion extends BaseQuestion {
  options: Option[];
}

// 题目类型集合
type Question = RadioQuestion | CheckboxQuestion | BaseQuestion;

// 题目设置
interface BaseQuesSetting {
  questionType: QuesItemType;
  required: boolean;
  unique: boolean;
}

interface RadioQuesSetting extends BaseQuesSetting {
  otherOption: boolean
}

interface CheckboxQuesSetting extends BaseQuesSetting {
  otherOption: boolean;
  maximumOption: number;
  minimumOption: number;
}

interface TextQuesSetting extends BaseQuesSetting {
  reg: string;
}

interface VoteQuesSetting extends BaseQuesSetting {
  maximumOption: number;
  minimumOption: number;
}

interface FormData {
  status: QuesStatus
  surveyType: QuesType
  baseConfig: BaseConfig
  quesConfig: {
    desc: string
    title: string
    questionList: any[]
  }
}

type QuesSetting = RadioQuesSetting | CheckboxQuesSetting | TextQuesSetting | VoteQuesSetting | BaseQuesSetting;

export type {
  Option,
  Question,
  QuesSetting,
  QuesConfig,
  BaseConfig,
  RadioQuestion,
  CheckboxQuestion,
  FormData
};
