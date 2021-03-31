import React, { Component } from 'react';
import {
  View, Button,StyleSheet, TouchableOpacity,Text,StatusBar,AsyncStorage,Image,Linking
} from 'react-native';
import {connect} from 'react-redux';

import authHandler from "../../utils/authenticationHandler";
import dark_theme from '../../constants/color'

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
class LoginScreen extends Component {

    constructor(props){
      super(props);
      this.state = { 
        accessTok:null

     };
     this.setToken = this.setToken.bind(this);

    }
   

    setToken = (text,refTok) => {
     
      this.setState({ accessTok: text });
     
      this.props.dispatch({
        type:'SET_TOKEN',
        token:text})
      
     
      this.storeRefToken(refTok)
      this.storeLoginStatus('true')

      this.props.navigation.navigate('HomeScreen')
      
    
    }

     onPressLogin = async () => {
      const authenticationObject = await authHandler.onLogin();
      
      this.setToken(authenticationObject.accessToken,authenticationObject.refreshToken)
      
  
    };
    
    async storeRefToken(tok) {
      try {
         await AsyncStorage.setItem("reftok", JSON.stringify(tok));
      } catch (error) {
        console.log("Something went wrong", error);
      }
    }
    async storeLoginStatus(user) {
      try {
         await AsyncStorage.setItem("loginData", JSON.stringify(user));
      } catch (error) {
        console.log("Something went wrong", error);
      }
    }
    render() {
        
        return (
            <View style={styles.container}>
              <StatusBar barStyle = "light-content" hidden = {false} backgroundColor = "#000" translucent = {false}/>
                <Image 
                  source={require('../../constants/images/bg2.jpg')}
                  style={{
                    width:'100%',
                    height:'50%',
                    resizeMode:'contain',
                    
                  }}
                />
                <Text style={{
                  color:'#fff',
                  fontFamily:'SFUIText-Bold',
                  fontSize:50,
                  alignSelf:'center',
                  marginTop:-50
                }}> 
                  Spotrec
                </Text>
               
                <Text style={{
                  color:'lightgray',
                  fontFamily:'SFUIText-Semibold',
                  fontSize:16,
                  alignSelf:'center',
                  marginTop:10,
                
                  
                  
                  
                }}> 
                  The smarter way to discover
                </Text>
                <Text style={{
                  color:'lightgray',
                  fontFamily:'SFUIText-Semibold',
                  fontSize:16,
                  alignSelf:'center',
                
                
                  
                  
                  
                }}> 
                  similar songs to your taste
                </Text>
                <TouchableOpacity 
                 style={{
                  borderRadius:5,
                  backgroundColor:dark_theme.green,
                  width:'90%',
                  height:50,
                  flexDirection:'row',
                  justifyContent:'center',
                  alignItems:'center',
                  marginTop:50 ,
                  alignSelf:'center',
                  position:'absolute',
                  bottom:40,
                  flexDirection:'row',
                  alignItems:'center'
              }}
              onPress={this.onPressLogin}>
                 <MaterialCommunityIcons name="spotify" color='white'
                                size={28} 
                                style={{marginHorizontal:10}}
                               
                            />
                <Text style={{
                            fontSize:20,
                            color:'white',
                            textAlign:'center',
                            fontFamily:'SFUIText-Bold'
                        }}>
                          Login with Spotify
                </Text> 
                </TouchableOpacity>
                <Text onPress={()=>{
                  Linking.canOpenURL('https://deeppomal98.medium.com/spotrec-privacy-97f7320481d8').then(supported => {
                    if (supported) {
                      Linking.openURL("https://deeppomal98.medium.com/spotrec-privacy-97f7320481d8");
                    } else {
                      console.log("Don't know how to open URI: " + "https://deeppomal98.medium.com/spotrec-privacy-97f7320481d8");
                    }
                  });
                }}
                style={{
                  color:'lightgray',
                  textAlign:'center',
                  fontSize:12,
                  position:'absolute',
                  bottom:10,
                  alignSelf:'center'
                }}>
                  Privacy Policy
                </Text>
           
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#000',
     
    },
  });
export default connect(mapStateToProps)(LoginScreen);

function mapStateToProps(state){
  return{
    token:state.token
  }
}
