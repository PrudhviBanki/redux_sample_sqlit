export const ADD_USER = 'ADD_USER';
export const DELETE_USER = 'DELETE_USER';
export const UPDATE_USER = 'UPDATE_USER';
export const LIST_USERS = 'LIST_USERS';

export const addUser = (name, email) => ({
  type: ADD_USER,
  payload: { name, email },
});

export const deleteUser = (id) => ({
  type: DELETE_USER,
  payload: { id },
});

export const updateUser = (id, name, email) => ({
  type: UPDATE_USER,
  payload: { id, name, email },
});

export const listUsers = (users) => {
  console.log('listUsers action called',users); // Add this line
  return {
    type: LIST_USERS,
    payload: users,
  };
};
