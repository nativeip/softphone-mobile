export const addNotifications = notifications => ({
  type: 'ADD_NOTIFICATIONS',
  payload: { notifications },
});

export const clearNotifications = () => ({
  type: 'CLEAR_NOTIFICATIONS',
});
