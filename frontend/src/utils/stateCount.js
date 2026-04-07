export const getMembersCountByState = (members = []) => {
  if (!Array.isArray(members)) return {};

  return members.reduce((stateMap, member) => {
    const state = member?.state_name?.trim() || "Unknown";

    return {
      ...stateMap,
      [state]: (stateMap[state] || 0) + 1,
    };
  }, {});
};