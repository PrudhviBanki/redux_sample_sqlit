import SQLite from 'react-native-sqlite-storage';
import {listUsers} from '../actions/userActions'

const db = SQLite.openDatabase({ name: 'userDB.db', location: 'default' });

// Create the user table if it doesn't exist
db.transaction((tx) => {
  tx.executeSql(
    'CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, email TEXT);'
  );
});

export const addUser = async (name, email, dispatch) => {
  try {
    // Add the user to the database
    
    const id = await db.transaction(async (tx) => {
      const [txResult] = await tx.executeSql(
        'INSERT INTO users (name, email) VALUES (?, ?);',
        [name, email]
      );
      return txResult.insertId;
    });

    // Fetch the updated user list from the database
    const updatedUsers = await getUsers();

    // Dispatch the action to update the Redux store
    if (dispatch) {
      dispatch(listUsers(updatedUsers));
    }

   return id
  } catch (error) {
    throw error;
  }
};



export const getUsers = () => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT * FROM users;',
        [],
        (tx, result) => {
          const rows = result.rows;
          const users = [];

          for (let i = 0; i < rows.length; i++) {
            users.push(rows.item(i));
          }

          resolve(users);
        },
        (error) => {
          reject(error);
        }
      );
    });
  });
};



export const updateUser = (id, name, email) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        'UPDATE users SET name = ?, email = ? WHERE id = ?;',
        [name, email, id],
        (tx, results) => {
          resolve(results.rowsAffected);
        },
        (error) => {
          reject(error);
        }
      );
    });
  });
};

export const deleteUser = (id) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        'DELETE FROM users WHERE id = ?;',
        [id],
        (tx, results) => {
          resolve(results.rowsAffected);
        },
        (error) => {
          reject(error);
        }
      );
    });
  });
};
