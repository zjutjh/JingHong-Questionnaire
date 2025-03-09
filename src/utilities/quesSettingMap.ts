import { QuesItemType } from "@/utilities/constMap.ts";

const defaultSetting = {
  required: true,
  unique: false
};

const quesSettingMap = {
  [QuesItemType.RADIO]: {
    ...defaultSetting,
    questionType: QuesItemType.RADIO,
    otherOption: false
  },
  [QuesItemType.CHECKBOX]: {
    questionType: QuesItemType.CHECKBOX,
    ...defaultSetting,
    otherOption: false,
    maximumOption: 0,
    minimumOption: 0
  },
  [QuesItemType.INPUT]: {
    questionType: QuesItemType.INPUT,
    ...defaultSetting,
    reg: ""
  },
  [QuesItemType.TEXTAREA]: {
    questionType: QuesItemType.TEXTAREA,
    ...defaultSetting,
    reg: ""
  },
  [QuesItemType.PHOTO]: {
    questionType: QuesItemType.PHOTO,
    ...defaultSetting
  },
  [QuesItemType.VOTE]: {
    questionType: QuesItemType.VOTE,
    ...defaultSetting,
    maximumOption: 0,
    minimumOption: 0
  }
};

export {
  quesSettingMap
};