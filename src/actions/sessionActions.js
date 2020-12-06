export const setSession = session => ({
  type: 'SET_SESSION',
  payload: session,
});

export const clearSession = () => ({
  type: 'CLEAR_SESSION',
  payload: null,
});
