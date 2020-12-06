export const setCaller = data => ({
  type: 'SET_CALLER',
  payload: { ...data },
});

export const clearCaller = () => ({
  type: 'SET_CALLER',
  payload: { number: '', name: '' },
});
