import React, {Component} from 'react';

import {Provider} from 'react-redux';
import store from './src/store/';
import { NavigationContainer, } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './src/screens/Login/loginScreen';
import HomeScreen from './src/screens/Home/homeScreen';
import SearchScreen from './src/screens/Search/searchScreen';
import GenreSearch from './src/screens/GenreSearch'
import SimilarSongs from './src/screens/similarSongs';


const Stack = createStackNavigator();

class App extends Component {



  render() {
    
    
    // console.log('LOGINCHKK',data)
    return( 
      <Provider store={store} >
        <NavigationContainer >
        
       
          <Stack.Navigator initialRouteName="HomeScreen"
            screenOptions={{
              headerShown: false
            }}>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="HomeScreen" component={HomeScreen} />
            <Stack.Screen name="SearchScreen" component={SearchScreen} />
            <Stack.Screen name="GenreSearch" component={GenreSearch} />
            <Stack.Screen name="SimilarSongs" component={SimilarSongs} />
          </Stack.Navigator>
       
      
        
        </NavigationContainer>

      </Provider>
    )
    
  }
}
export default App;