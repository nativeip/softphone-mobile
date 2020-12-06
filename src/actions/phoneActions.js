export const register = ({ dispatch }) => ({
  type: 'REGISTER_PHONE',
  payload: dispatch,
});

export const unregister = () => ({
  type: 'UNREGISTER_PHONE',
});

export const makeCall = number => ({
  type: 'MAKE_CALL',
  payload: number,
});

export const answerCall = uuid => ({
  type: 'ANSWER_CALL',
  payload: uuid,
});

export const newCalll = session => ({
  type: 'NEW_CALL',
  payload: session,
});
