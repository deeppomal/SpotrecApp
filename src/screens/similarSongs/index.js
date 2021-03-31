import React, { Component } from "react";
import { 
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    FlatList,
    ActivityIndicator,
    Image,
    ScrollView,
    Button,
    ToastAndroid,
    StatusBar, 
    AsyncStorage,
    ActivityIndicatorBase,
    ImageBackground,
    Linking
    
} from "react-native";
import {connect} from 'react-redux';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import dark_theme from '../../constants/color';
import Modal from 'react-native-modal';
import ToggleSwitch from 'toggle-switch-react-native'
import { DarkTheme } from "@react-navigation/native";
import Snackbar from 'react-native-snackbar';
function mapStateToProps(state){
    return{
      token:state.token
    }
  }

class SimilarSongs extends Component {

    constructor(props){
        super(props)
        this.state={
            songList:[],
            isSongLoading:false,
            tracks:[],
            id:null,
            playlistID:null,
            trackIdList:'',
            isModalVisible:false,
            pName:'',
            isPublic:false,
            token:null,
            isPlaylistCreating:false,
            isPlaylistAdded:false,
           

        }
    }
    componentDidMount(){

        this.setState({isSongLoading:true})
        setTimeout(() => {
            
            
            this.getSongs(this.props?.route?.params?.genre,this.props?.route?.params?.track,10);
        }, 1000)
        this.getUserDetails();
     

        
    }

    setModalVisible=(val)=>{
        this.setState({isModalVisible:val})
    }

    async getLoginStatus() {
        try {
          let userData = await AsyncStorage.getItem("loginData");
          let data = JSON.parse(userData);
          console.log('loginCheck',data)
          if(data =='false'|| data==null){
              this.props.navigation.navigate('Login')
          }
          else
            this.getToken()
        } catch (error) {
          console.log("Something went wrong", error);
        }
      }
    async getToken() {
        try {
          let userData = await AsyncStorage.getItem("userData");
          let data = JSON.parse(userData);
         
          this.setState({token:data})
          
          console.log('Token Check',data)

          this.setState({isSongLoading:true})
            setTimeout(() => {
                
                
                this.getSongs(this.props?.route?.params?.genre,this.props?.route?.params?.track,10);
            }, 1000)
            this.getUserDetails();
        } catch (error) {
          console.log("Something went wrong", error);
        }
      }
    getUserDetails=()=> {
      
        return fetch('https://api.spotify.com/v1/me', {method: 'GET',
          headers: {
                    'Content-Type'    : 'application/json',
                    'Accept'          : 'application/json',
                    'Authorization'   : 'Bearer '+this.props.token
                }})
            .then((response) => response.json())
            .then((responseJson) => {
               
                this.setState({id:responseJson.id})
                
            })
            .catch((error) => {
                console.error(error);
            });
     
    }

    createPlaylist=(nameP,publicCheck)=>{
     

            this.setState({isPlaylistCreating:true})
            return fetch('https://api.spotify.com/v1/users/'+this.state.id+'/playlists', {
            method: 'POST',
            headers: {
                    'Content-Type'    : 'application/json',
                    'Accept'          : 'application/json',
                    'Authorization'   : 'Bearer '+this.props.token
                },
            body:   JSON.stringify({
                        name: nameP,
                        description: 'Created using SpotRec',
                        public:publicCheck
                })
            })
            .then((response) => response.json())
            .then((responseJson) => {
                console.log(JSON.stringify(responseJson))
                    this.setState({playlistID:responseJson.id,})
                    this.addSongsToPlaylist();
            })
            .catch((error) => {
                console.error(error);
                this.setState({isPlaylistCreating:false})
            });
       
    }
    addSongsToPlaylist=()=>{

     

            return fetch('https://api.spotify.com/v1/playlists/'+this.state.playlistID+'/tracks?uris='+
            this.state.trackIdList, {
            method: 'POST',
            headers: {
                    'Content-Type'    : 'application/json',
                    'Accept'          : 'application/json',
                    'Authorization'   : 'Bearer '+this.props.token
                },
         
            })
            .then((response) => response.json())
            .then((responseJson) => {
                console.log('Playlist added')
                console.log(JSON.stringify(responseJson))
                this.setState({isPlaylistCreating:false,isPlaylistAdded:true})
              
               
            })
            .catch((error) => {
                console.error(error);
                this.setState({isPlaylistCreating:false})
            });
        
    }
    getSongs=(genres,tracks,limit)=> {

      
        
            this.setState({isSongLoading:true})
            if(this.props?.route?.params?.genre && this.props?.route?.params?.track)
                var url = 'https://api.spotify.com/v1/recommendations?limit='+limit+'&market=ES&seed_genres='+genres+
                '&seed_artists='+tracks

            else if(this.props?.route?.params?.genre && !this.props?.route?.params?.track)
                var url = 'https://api.spotify.com/v1/recommendations?limit='+limit+'&market=ES&seed_genres='+genres

            else if(!this.props?.route?.params?.genre && this.props?.route?.params?.track)
                var url = 'https://api.spotify.com/v1/recommendations?limit='+limit+'&market=ES&seed_artists='+tracks

            return fetch(url,
            {method: 'GET',
            headers: {
                        'Content-Type'    : 'application/json',
                        'Accept'          : 'application/json',
                        'Authorization'   : 'Bearer '+this.props.token
                    }})
                .then((response) => response.json())
                .then(async (responseJson) => {
                
                
                
                    await this.setSongItem(responseJson.tracks)
                  
                
                    this.setState({isSongLoading:false})
                   
                })
                .catch((error) => {
                    console.error(error);
                    this.setState({isSongLoading:false})
                });
        
    }

    setSongItem=(data)=>{
       
        if(data && data.length>0){

        
        var songs1=[]
         for (let i = 0; i < data.length; i++) 
         {
             
             var songs2 =
                 {
                     title:data[i].name,
                     isLocked:false,
                     image:data[i].album.images[1].url,
                     artist:data[i].artists[0].name,
                     id:data[i].id,
                     ind:i
                 }
             
             songs1.push(songs2);
 
         }
         this.setState({
             tracks: [...this.state.tracks,...songs1]
         })
         this.songEdit(this.state.tracks)
       
        }
        else{
            console.log('KHATAM')
        }
     }




    songEdit=(songlist)=>{
      
        var str='spotify%3Atrack%3A'+songlist[0].id;
        for(let i=1;i<songlist.length;i++){
            str = str.concat("%2Cspotify%3Atrack%3A" , songlist[i].id);
        }
        this.setState({trackIdList:str})
    }
    renderSongs=({item,index})=>{
        
        return(
            <View style={{
                marginVertical:5,}}
                >
               <View style={{flexDirection:'row',alignItems:'center'}}>
                    <Image style={{
                        height:55,
                        width:55,
                        borderRadius:7,
                      
                        }} source={item.image? {uri:item.image}:require('../../constants/images/loading.png')}  />

                    <View style={{marginHorizontal:16,width:'65%'}}>
                        <Text numberOfLines={1} ellipsizeMode='tail' style={{
                            color:'white',
                            fontSize:15,
                            fontFamily:'SFUIText-Medium',
                            marginVertical:2
                        }} >{item.title}</Text>
                        <Text numberOfLines={1} ellipsizeMode='tail'  style={{
                            color:'white',
                            fontSize:13,
                            fontFamily:'SFUIText-Regular',
                            marginVertical:2
                        }}>{item.artist}</Text>
                    </View>
                    
                    {item.isLocked ? 
                    
                    <MaterialCommunityIcons name="lock" color={dark_theme.green}
                                size={22} 
                                style={{position:'absolute',right:0,marginTop:-16}}
                                onPress={()=>{
                                    var list = this.state.tracks
                                    list[index].isLocked=false;
                                    this.setState({tracks:list})
                                    console.log('unlocked')
                                }}
                            />  
                            :
                     <MaterialCommunityIcons name="lock-open-variant" color='lightgray'
                                size={22} 
                                style={{position:'absolute',right:0,marginTop:-16}}
                                onPress={()=>{
                                    var list = this.state.tracks
                                    list[index].isLocked=true;
                                    this.setState({tracks:list})
                                    console.log('locked')
                                }}
                            /> 
                    }
                 
               </View>
            
            {
                index==this.state.tracks.length-1 ?
                <View style={{height:150,width:'100%'}} />

                
                :null
            }
             
            </View>





           
        )
    }
    renderSongsLoading=()=>{
        return(
            <View style={{
                marginVertical:5,}}
                >
               <View style={{flexDirection:'row',alignItems:'center'}}>
                    <View style={{
                        height:55,
                        width:55,
                        borderRadius:7,
                        backgroundColor:'rgba(105,105,105, 0.8)',
                        }}  />

                    <View style={{marginHorizontal:16,width:'65%'}}>
                        <View style={{
                            backgroundColor:'rgba(105,105,105, 0.8)',
                            height:20,
                            width:200,
                            marginVertical:2
                        }} />
                       <View style={{
                            backgroundColor:'rgba(105,105,105, 0.8)',
                            height:20,
                            width:100,
                            marginVertical:2
                        }} />
                    </View>
                    
                   
                 
               </View>
         
             
            </View>
        )
    }
    render() {
        
            return (
                <View style={styles.container}>
                     <StatusBar barStyle = "light-content" hidden = {false} backgroundColor = "#000" translucent = {false}/>

                     <View style={{
                        flexDirection:'row',
                        marginVertical:10,
                        alignItems:'center',
                        justifyContent:'center'
                    }}>
                        <MaterialCommunityIcons name="chevron-left" color='white'
                                size={35} 
                                style={{position:'absolute',left:0,marginTop:10}}
                                onPress={()=>this.props.navigation.goBack()}
                            />
                        <Text style={{
                                fontSize:30,
                                color:'#fff',
                                textAlign:'center',
                                fontFamily:'SFUIText-Bold'
                            }}>
                                Similar Songs
                            </Text>
                    </View>
                    
                    <ScrollView style={{flex:1,overflow:'hidden'}}>
                   
                    <View>

                        {this.state.isSongLoading ?
                           <FlatList
                            
                           showsVerticalScrollIndicator={false}
                           data={[1,2,3,4,5,6,7,8,9,10]}
                           renderItem={this.renderSongsLoading}
                           keyExtractor={item => item.id}

                           />
                        :
                        this.state.tracks.length ==0 ?
                        <View style={{
                            alignSelf:'center',
                            justifyContent:'center',
                            alignItems:'center',
                            marginVertical:20
                        }}>
                            <Image style={{
                                height:200,
                                width:200,
                                resizeMode:'contain',
                                alignSelf:'center',
                            }} 
                            source={require('../../constants/images/notfound.png')}/>
                            <Text style={{
                                fontFamily:'SFUIText-Bold',
                                fontSize:18,
                                color:'#fff',
                                textAlign:'center',
                                marginTop:20
                            }}>
                                Couldn't find similar songs
                            </Text>
                            <Text style={{
                                fontFamily:'SFUIText-Semibold',
                                fontSize:14,
                                color:'lightgray',
                                textAlign:'center',
                                marginVertical:10
                            }}>
                                Oops, it looks like you went too far, please try again with lesser genres picked
                            </Text>
                        </View>
                        :
                        <FlatList
                            
                        showsVerticalScrollIndicator={false}
                        data={this.state.tracks}
                        renderItem={this.renderSongs}
                        keyExtractor={item => item.id}

                        />
                     
                        }
                       
                    
                            
                        </View>
                   
                    {this.state.isSongLoading || this.state.tracks.length ==0 ? 
                    null:
                    
                    <View  style={{
                            
                        position:'absolute',
                        bottom:0,
                        height:55,
                        backgroundColor:dark_theme.black,
                        width:'100%',
                        flexDirection:'row',
                        justifyContent:'center',
                        paddingTop:5,
                        
                    }}>
                         <TouchableOpacity style={{
                                borderRadius:5,
                                borderColor:dark_theme.green,
                                width:'45%',
                                borderWidth:1,
                                height:40,
                                marginHorizontal:7,
                                justifyContent:'center',
                                alignItems:'center'
                            }}
                            onPress={()=>{
                                var count=0;
                                for (var i =0;i<this.state.tracks.length;i++){
                                    if(this.state.tracks[i].isLocked){
                                        count++;
                                    }
                                  
                                }
                                var t =this.state.tracks.filter(itm=>itm.isLocked != false)
                                this.setState({tracks:t,isPlaylistAdded:false})
                                    
                               
                                this.getSongs(this.props?.route?.params?.genre,this.props?.route?.params?.track,10-count);
                            }}
                          >
                                <Text style={{
                                    fontSize:16,
                                    color:dark_theme.green,
                                    textAlign:'center',
                                    fontFamily:'SFUIText-Semibold'
                                }}>
                                    Refresh
                                </Text>
                              
                            </TouchableOpacity>
                            <TouchableOpacity style={{
                                borderRadius:5,
                                backgroundColor:dark_theme.green,
                                width:'45%',
                                height:40,
                                marginHorizontal:7,
                                justifyContent:'center',
                                alignItems:'center'
                               
                            }}
                            onPress={()=>{
                             
                                this.setModalVisible(true)
                            }}
                          >
                                <Text style={{
                                    fontSize:16,
                                    color:'white',
                                    textAlign:'center',
                                    fontFamily:'SFUIText-Semibold'
                                }}>
                                    Save Playlist
                                </Text>
                              
                            </TouchableOpacity>

                    </View>
                    }
                    </ScrollView>

                    <Modal
                        testID={'modal'}
                        isVisible={this.state.isModalVisible}
                        onSwipeComplete={()=>this.setModalVisible(false)}
                        onBackdropPress={() => this.setModalVisible(false)}
                        onBackButtonPress={() => this.setModalVisible(false)}
                        swipeDirection={['up', 'left', 'right', 'down']}
                        style={styles.view}>
                        <View style={styles.content} >
                            <MaterialCommunityIcons name="close" color={'lightgray'}
                                size={25} 
                                style={{position:'absolute',right:0,margin:10}}
                                onPress={() => this.setModalVisible(false)}
                                                        
                            />
                            <TextInput value={this.state.pName} onChangeText={(value)=>this.setState({pName:value})} 
                            placeholder='Enter playlist name' placeholderTextColor={'lightgray'}
                            style={{marginTop:-20,borderBottomColor:dark_theme.green,borderBottomWidth:1,color:'#fff',marginBottom:10,fontFamily:'SFUIText-Medium',
                            fontSize:15,}} />
                            <View style={{
                                flexDirection:'row',
                                alignItems:'center',
                                justifyContent:'space-between'
                            }}>
                                <ToggleSwitch
                                    isOn={this.state.isPublic}
                                    onColor={dark_theme.green}
                                    offColor="gray"
                                    label="Public"
                                    labelStyle={{ color: "white",marginVertical:10}}
                                    size="medium"
                                    onToggle={isOn => this.setState({isPublic:!this.state.isPublic})}
                                    
                                />
                                {this.state.isPlaylistAdded ?
                                <TouchableOpacity style={{
                                    flexDirection:'row',
                                    alignItems:'center'
                                }}
                                    onPress={()=>{
                                        Linking.canOpenURL("spotify://app").then(supported => {
                                            if (supported) {
                                                Linking.openURL("spotify://app");
                                            } else {
                                                Snackbar.show({
                                                    text:   "Some error occurred",
                                                    duration: Snackbar.LENGTH_LONG,
                                                    action: {
                                                      text: 'Okay',
                                                      textColor: dark_theme.green,
                                                      onPress: () => { /* Do something. */ },
                                                    },
                                                  })
                                            }
                                            });
                                    }}>
                                    <MaterialCommunityIcons name="spotify" color={dark_theme.green}
                                        size={25} 
                                        style={{marginHorizontal:4}}
                                        
                                    />
                                    <Text style={{color:'#fff',
                                    fontSize:16,
                                    fontFamily:'SFUIText-Semibold'}}>Open</Text>
                                </TouchableOpacity>
                             :null} 
                            </View>
                            
                            <TouchableOpacity style={[
                                this.state.isPlaylistAdded ?
                                {
                                borderRadius:5,
                                backgroundColor:dark_theme.green,
                                width:'100%',
                                padding:15,
                                height:50,
                                justifyContent:'center',
                                alignItems:'center',
                                marginVertical:16,
                              
                            }
                            :
                            {
                                borderRadius:5,
                                borderWidth:1,
                                borderColor:dark_theme.green,
                                width:'100%',
                                padding:15,
                                height:50,
                                justifyContent:'center',
                                alignItems:'center',
                                marginVertical:16,
                            }]}
                            onPress={()=>{
                                this.state.pName.length == 0  ? 
                            
                               
                                  Snackbar.show({
                                    text:   "Please name your playlist",
                                    duration: Snackbar.LENGTH_LONG,
                                    action: {
                                      text: 'Okay',
                                      textColor: dark_theme.green,
                                      onPress: () => { /* Do something. */ },
                                    },
                                  })
                                  :
                                  this.state.isPlaylistAdded ? 
                                    Snackbar.show({
                                        text:   "Playlist already added",
                                        duration: Snackbar.LENGTH_LONG,
                                        action: {
                                        text: 'Okay',
                                        textColor: dark_theme.green,
                                        onPress: () => { /* Do something. */ },
                                        },
                                    })
                                  : 
                                    this.createPlaylist(this.state.pName,this.state.isPublic)
                            }}>
                                {
                                    this.state.isPlaylistCreating ? 
                                    <ActivityIndicator size={'large'} color={dark_theme.green} style={{alignSelf:'center'}} />
                                    :

                                    this.state.isPlaylistAdded ?

                                    <View style={{
                                        flexDirection:'row',
                                       
                                        alignItems:'center'
                                    }}>

                                    
                                        <Text style={
                                        
                                        {
                                            fontSize:18,
                                            color:'#fff',
                                            fontFamily:'SFUIText-Semibold'
                                        }}>
                                            Playlist Added
                                    
                                        </Text>
                                        <MaterialCommunityIcons name="check-bold" color={'#fff'}
                                            size={25} 
                                            style={{marginHorizontal:10}}
                                            
                                        />
                                     </View>
                                    :
                                    <Text style={
                                    {
                                        fontSize:18,
                                        color:dark_theme.green,
                                        fontFamily:'SFUIText-Semibold'
                                    }}>
                                        Save Playlist
                                    </Text>
                                }
                            </TouchableOpacity>
                           
                        </View>
                    </Modal>
                </View>
            );
       
        
    }
}
export default connect(mapStateToProps)(SimilarSongs);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor:dark_theme.black,
        paddingHorizontal:16
    },
    view: {
        justifyContent: 'flex-end',
        margin: 0,
        
      },
    content: {
        backgroundColor:dark_theme.black,
        padding: 22,
       
        borderRadius: 4,
        borderColor: 'rgba(0, 0, 0, 0.1)',
        paddingVertical:50
      },
    contentTitle: {
        fontSize: 20,
        marginBottom: 12,
      },
});