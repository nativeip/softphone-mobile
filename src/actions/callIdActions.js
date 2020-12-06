export const setCallId = id => ({
  type: 'SET_CALL_ID',
  payload: id,
});

export const clearCallId = () => ({
  type: 'CLEAR_CALL_ID',
  payload: '',
});
