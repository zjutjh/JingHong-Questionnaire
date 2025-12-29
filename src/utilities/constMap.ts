enum QuesStatus {
  DRAFT = 1,
  PUBLISH = 2,
  EXPIRED = 3
}

enum QuesType {
  SURVEY = 0,
  VOTE = 1
}

enum QuesItemType {
  RADIO = 1,
  CHECKBOX = 2,
  INPUT = 3,
  TEXTAREA = 4,
  PHOTO = 5,
  VOTE = 6
}

export {
  QuesStatus,
  QuesType,
  QuesItemType
};
