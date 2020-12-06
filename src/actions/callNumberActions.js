export const setCallNumber = number => ({
  type: 'SET_CALL_NUMBER',
  payload: number,
});

export const clearCallNumber = () => ({
  type: 'CLEAR_CALL_NUMBER',
  payload: '',
});
