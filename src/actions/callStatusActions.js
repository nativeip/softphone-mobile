export const setCallStatus = status => ({
  type: 'SET_CALL_STATUS',
  payload: status,
});

export const clearCallStatus = () => ({
  type: 'CLEAR_CALL_STATUS',
  payload: '',
});
