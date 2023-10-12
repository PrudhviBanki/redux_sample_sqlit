import React from 'react';
import { Provider } from 'react-redux';
import store from './src/store/store';
import UsersList from './src/usersList';

const App = () => {
  return (
    <Provider store={store}>
      <UsersList />
    </Provider>
  );
};

export default App;
