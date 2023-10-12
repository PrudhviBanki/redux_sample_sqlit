import React, { useEffect, useState, useRef } from 'react';
import { View, Text, Button, TextInput, FlatList, Alert,StyleSheet, TouchableOpacity } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { listUsers } from './actions/userActions';
import { getUsers, addUser, deleteUser,updateUser } from './db/database'; // Import the database functions
import RBSheet from "react-native-raw-bottom-sheet";

const UsersList = () => {
  const dispatch = useDispatch();
  const users = useSelector((state) => state.users.users);
  const refRBSheet = useRef();
  const [userName, setUserName] = useState('');
  const [emailId, setEmailId] = useState('');
  const [isValid, setIsValid] = useState(true);
  const [isupdate, setUpdate] = useState(false);

  useEffect(() => {
    // Fetch users from the database and update the Redux store (initial load)
    getUsers()
      .then((data) => {
        dispatch(listUsers(data));
      })
      .catch((error) => {
        console.log('Error fetching users:', error);
      });
  }, [dispatch]);

  const addUserAndHandle = async () => {
    refRBSheet.current.close();
    if(userName==""){
      Alert.alert(
        'Error',
        'Please enter name',
        [
          { text: 'OK', onPress: () => console.log('OK Pressed') },
        ]
      );
    }else if(emailId==""){
      Alert.alert(
        'Error',
        'Please enter email Id',
        [
          { text: 'OK', onPress: () => console.log('OK Pressed') },
        ]
      );
    }
    else if (!isValid) {
      Alert.alert(
        'Error',
        'Please enter valid email Id',
        [
          { text: 'OK', onPress: () => console.log('OK Pressed') },
        ]
      );
    }else{
      try {
        await addUser(userName, emailId, dispatch);
        setUserName('');
        setEmailId('')
      } catch (error) {
        console.error('Error adding user:', error);
      }
    }
   
  };

  const onRowClick=(item)=>{
    setEmailId(item.email)
    setUserName(item.name)
    setUpdate(true)
    refRBSheet.current.open()
  }
  const updateAndHandle = async () => {
    refRBSheet.current.close();
    if(userName==""){
      Alert.alert(
        'Error',
        'Please enter name',
        [
          { text: 'OK', onPress: () => console.log('OK Pressed') },
        ]
      );
    }else if(emailId==""){
      Alert.alert(
        'Error',
        'Please enter email Id',
        [
          { text: 'OK', onPress: () => console.log('OK Pressed') },
        ]
      );
    }
    else if (!isValid) {
      Alert.alert(
        'Error',
        'Please enter valid email Id',
        [
          { text: 'OK', onPress: () => console.log('OK Pressed') },
        ]
      );
    }else{
      try {
        await updateUser(id,userName, emailId);
        setUserName('');
        setEmailId('')
      } catch (error) {
        console.error('Error adding user:', error);
      }
    }
   
  };

  const handleDeleteUser = async (id) => {
    try {
      // Call the deleteUser function to remove the user from the database
      await deleteUser(id);

      // After successful deletion, fetch the updated user list and dispatch the action to update the Redux store
      const updatedUsers = await getUsers();
      dispatch(listUsers(updatedUsers));
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };
  const validateEmail = (email) => {
    const emailPattern = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
    return emailPattern.test(email);
  };
  const handleNameChange = (text) => {
    setUserName(text);
  };
  const handleEmailChange = (text) => {
    setEmailId(text);
    setIsValid(validateEmail(text));
  };
  const resetState = () => {
    setUserName('');
    setEmailId('');
    setUpdate(false);
  };
  return (
    <View style={{ flex: 1 }}>
       <Text style={{fontSize :20,fontWeight :'bold',padding :10,textAlign :'center',backgroundColor :'#00AFCC',color:'white'}}>User List</Text>
      <FlatList
        data={users}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <View key={item.id} style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 10 }}>
            <TouchableOpacity onPress={()=>onRowClick(item)}>
            <View  >
              <Text style={{ fontSize: 16, fontStyle: 'normal', fontWeight: 'bold' }}>{item.name}</Text>
              <Text>Email Id: {item.email}</Text>
            </View>
            </TouchableOpacity>
           
            <Text style={{ fontSize: 14, fontStyle: 'normal', fontWeight: 'bold', color: 'red' }} onPress={() => handleDeleteUser(item.id)} >Delete</Text>
          </View>
        )}
      />
      <View style={{ padding: 10 }}>
        <Button title="Add User" onPress={() => { setUpdate(false),refRBSheet.current.open()}} style={styles.button}/>
      </View>
      <RBSheet
        ref={refRBSheet}
        closeOnDragDown={true}
        closeOnPressMask={true}
        onClose={resetState} 
        customStyles={{
          wrapper: {
            backgroundColor: "gray"
          },
          draggableIcon: {
            backgroundColor: "#000"
          }
        }}>
        <View style={styles.container}>
          <Text style={{fontSize :18,fontWeight :'bold',margin :10}}>{isupdate ?"Update user":"Add user"}</Text>
          <TextInput
           style={styles.input}
            placeholder="Enter Name"
            value={userName}
            onChangeText={handleNameChange}
          />

          <TextInput
           style={styles.input}
            placeholder="Enter Email Id"
            value={emailId}
            onChangeText={handleEmailChange}
          />  

          <Button title={isupdate ?"Update":"Submit"} onPress={isupdate ? updateAndHandle :addUserAndHandle} style={styles.button}/>
        </View>
      </RBSheet>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    width: '90%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 10, // Set borderRadius for rounded corners
    padding: 10,
    marginEnd:10,
    marginStart:10,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  button: {
    width: '90%',
    color:'red',
    height: 50, // Set the desired height for the button
  },
});

export default UsersList;
