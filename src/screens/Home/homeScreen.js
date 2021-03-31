import React, { Component } from "react";
import { 
    View,
    Text,
    StyleSheet,
    Button,
    TouchableOpacity,
    StatusBar,
    FlatList,
    Image,
    TextInput,
    ToastAndroid,
    AsyncStorage,
    Linking
} from "react-native";

import {connect} from 'react-redux';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import dark_theme from '../../constants/color'
import Snackbar from 'react-native-snackbar';
import authHandler from "../../utils/authenticationHandler";
var randomColor  = require('randomcolor');


class HomeScreen extends Component {

    constructor(props){
        super(props)
        this.state={
            g:'',
            t:'',
            genreList:[],
            isGenreLoading:false,
            newGenreList:[],
            selectedGenreList:[],
            colorList:[],
            selectedSongList:[],
            searchQ:'',
            trackData:[],
            dataLoading:false,
            selectedTracks:[],
            selectedCheck:false,
            artistRespList:[],
            artistData:[]
            
        }
    }
    componentDidMount(){
        
        
        this.getLoginStatus();
            
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
            this.getToken();
        } catch (error) {
          console.log("Something went wrong1", error);
        }
      }
    async getToken() {
        try {
            let ref = await AsyncStorage.getItem("reftok");
            let data = JSON.parse(ref);
         
            const refCall = await authHandler.refreshLogin(data)
            this.props.dispatch({
            type:'SET_TOKEN',
            token:refCall.accessToken}) 
            this.storeRefToken(refCall.refreshToken)

        } catch (error) {
            Snackbar.show({
                text:  "Please login again",
                duration: Snackbar.LENGTH_LONG,
                action: {
                  text: 'Okay',
                  textColor: dark_theme.green,
                  onPress: () => { /* Do something. */ },
                },
              })
            this.props.navigation.navigate('Login')
            console.log("Something went wrong2", error);
        }
      }
    async storeRefToken(tok) {
        try {
           await AsyncStorage.setItem("reftok", JSON.stringify(tok));
        } catch (error) {
          console.log("Something went wrong", error);
        }
      }
    getGenres=()=> {

        
        return fetch('https://api.spotify.com/v1/recommendations/available-genre-seeds', {method: 'GET',
          headers: {
                    'Content-Type'    : 'application/json',
                    'Accept'          : 'application/json',
                    'Authorization'   : 'Bearer '+this.props.token
                }})
            .then((response) => response.json())
            .then(async (responseJson) => {
             
          
                var cList = randomColor({
                    count: responseJson.genres.length,
                    hue: 'green',
                    luminosity: 'light',
                 });
                
                this.setState({
                    colorList:cList
                })
               
                await this.setGenreItem(responseJson.genres)
            })
            .catch((error) => {
                console.error(error);
            });
    }

    getSearchResults=()=> {

     
            if(this.state.searchQ.length>0){
                return fetch('https://api.spotify.com/v1/search?q='+this.state.searchQ+'&type=track%2Cartist&market=US&limit=10&offset=5', {method: 'GET',
                  headers: {
                            'Content-Type'    : 'application/json',
                            'Accept'          : 'application/json',
                            'Authorization'   : 'Bearer '+this.props.token
                        }})
                    .then((response) => response.json())
                    .then((responseJson) => {
                     

                        var i;
                        var data =[];
                        
                     
                        for( i=0;i<responseJson.tracks.items.length;i++){

                           
                            var t ={
                                name:responseJson.tracks.items[i].artists[0].name,
                                artistId:responseJson.tracks.items[i].artists[0].id,
                                image:responseJson.tracks.items[i].album.images[0].url,
                                ind:i
                            }
                            data.push(t)
                          
                        }
                        this.setState({
                            artistRespList:data
                        })
                       

                        this.setArtistList()
                     
                    })
                    .catch((error) => {
                        console.error(error);
                    });
                }
                else{
                   
                }
        
        
    }

    setArtistList=()=>{
        
        const newArray = [];
        this.state.artistRespList.forEach(obj => {
        if (!newArray.some(o => o.name === obj.name)) {
            newArray.push({ ...obj })
           
        }
    
        });
    
        this.setState({artistData:newArray})
    }

    renderArtist=(item,index)=>{
        return(
            <TouchableOpacity style={{
                marginVertical:5,}}
                onPress={()=> {
                    
                    var selected =
                        {
                            name:item.name,
                            id:item.artistId,
                            albumArt:item.image

                        }
                    
                    this.setState({
                        selectedSongList:[...this.state.selectedSongList,selected],
                        selectedCheck:true,
                        artistData:[],
                        searchQ:''

                    })
                  
                   
                }}>
               <View style={{flexDirection:'row',alignItems:'center'}}>
                    <Image style={{
                        height:55,
                        width:55,
                        borderRadius:7,
                    
                        }} source={item.image ? {  uri:item.image}: require('../../constants/images/loading.png')} />

                    <View style={{marginHorizontal:16,}}>
                        <Text numberOfLines={1} ellipsizeMode='tail' style={{
                            color:'white',
                            fontSize:17,
                            fontFamily:'SFUIText-Medium',
                            marginVertical:2
                        }} >{item.name}</Text>
                     
                    </View>
                    
               </View>
            
            {
                index==this.state.artistData.length-1 ?
                <View style={{height:150,width:'100%'}} />

                
                :null
            }
             
            </TouchableOpacity>
        )
    }

    setGenreItem=(data)=>{
       
        var genres1=[]
         for (let i = 0; i < data.length; i++) 
         {
             
             var genres2 =[
                 {
                     title:data[i],
                     isSelected:false,
                     ind:i
                 }
             ]
             genres1.push(genres2);
 
         }
         this.setState({
             newGenreList: genres1
         })
       
     }

     renderGenres=({item,index})=>{
      
        return(
            <TouchableOpacity 
            key={index}
            style={
                item[0].isSelected ? 
                {
               
                width:'48%',
                height:40,
                paddingHorizontal:5,
                
                marginVertical:10,
                marginHorizontal:5,
                borderRadius:5,
                justifyContent:'center',
                alignItems:'center',
                backgroundColor:'green'
            }:
            {
                borderWidth:1,
                width:'48%',
                height:40,
                
                borderColor:'lightgray',
                marginVertical:10,
                marginHorizontal:5,
                borderRadius:5,
                justifyContent:'center',
                alignItems:'center',
                paddingHorizontal:5,
                


            }}
            onPress={()=>{
               

                var list = this.state.newGenreList

                if(list[index][0].isSelected)
                {
                    list[index][0].isSelected=false

                    var temp = this.state.selectedGenreList.filter(itm => itm.title != item[0].title)

                    console.log('REMOVED',temp)

                    this.setState({
                        newGenreList:list,
                        selectedGenreList:temp
                    })
                }
                    
                else
                {
                    list[index][0].isSelected=true
                    this.setState({
                        newGenreList :  list,
                        selectedGenreList: [...this.state.selectedGenreList,...this.state.newGenreList[index]]
                    })
                }
                    
               
               
                console.log('SELECTED',this.state.selectedGenreList)
            }}>
                <Text style={
                     item[0].isSelected ? {
                    textAlign:'center', 
                    fontSize:16,
                    color:'#fff'
                }:  
                {
                    textAlign:'center',
                    fontSize:16,
                    color:'#fff'
                }}>
                    {item[0].title }
                </Text>
            </TouchableOpacity>
        )
    }


    

    setGenreString=(list)=>{

        console.log('ff',list)
        var str=list[0].title;
        for (let i=1;i<list.length;i++){
             str = str.concat("%2C" , list[i].title);
           
        }
       
        return str;
    }
    setTrackString=(list)=>{

        console.log('ff',list)
        var str=list[0].id;
        for (let i=1;i<list.length;i++){
             str = str.concat("%2C" , list[i].id);
           
        }
    
        return str;
    }
    renderSelectedSongs=({item,index})=>{
        
        return(
            <View style={{
                marginVertical:5,}}
                >
               <View style={{flexDirection:'row',alignItems:'center'}}>
                    <Image style={{
                        height:55,
                        width:55,
                        borderRadius:7,
                      
                        }} source={{uri:item.albumArt}} />

                    <View style={{marginHorizontal:16,width:'65%'}}>
                        <Text numberOfLines={1} ellipsizeMode='tail' style={{
                            color:'white',
                            fontSize:17,
                            fontFamily:'SFUIText-Medium',
                            marginVertical:2,
                         
                        }} >{item.name}</Text>
                    
                    </View>
                    
                    <MaterialCommunityIcons name="close" color='lightgray'
                            size={24} 
                           style={{position:'absolute',right:10}}
                           onPress={()=>
                        {
                            var test= this.state.selectedSongList.filter((itm)=>itm.name !== item.name)
                          
                            this.setState({
                                selectedSongList: test
                            })
                        }}
                    />
                   
               </View>
            
            {
                index==this.state.selectedSongList.length-1 ?
                <View style={{height:150,width:'100%'}} />

                
                :null
            }
             
            </View>
         
        )
    }

   
    render() {
       

     
       
        return (
            <View style={styles.container}>
                 <StatusBar barStyle = "light-content" hidden = {false} backgroundColor = "#000" translucent = {false}/>
                <View>
                    <View style={{
                        flexDirection:'row',
                        marginVertical:0,
                        justifyContent:'center',
                        alignItems:'center'

                    }}>

                   
                        <Text style={{
                            fontSize:35,
                            color:'#fff',
                            textAlign:'center',
                        
                            fontFamily:'SFUIText-Bold'
                        }}>
                            Search
                        </Text>
                        <MaterialCommunityIcons name="logout-variant" color={dark_theme.green}
                                size={25} 
                                style={{position:'absolute',right:10}}
                                onPress={()=>{
                                    try {
                                        AsyncStorage.setItem("loginData", JSON.stringify('false'));
                                        this.props.navigation.navigate('Login')
                                    } catch (error) {
                                    console.log("Something went wrong", error);
                                    }
                                }}
                            />
                     </View>
                    <View style={{
                        borderRadius:5,
                        backgroundColor:'#fff',
                        width:'93%',
                        alignSelf:'center',
                        flexDirection:'row',
                        justifyContent:'center',
                        alignItems:'center',
                        marginTop:16
                    }}
                  
                    >
                        
                        <TextInput placeholder='Search artists...'
                         maxLength={40} 
                         value={this.state.searchQ}
                       
                         onChangeText={(value)=>
                            {
                                this.setState({searchQ:value})
                                this.getSearchResults()
                            }}
                         style={{width:'90%'}}
                        //  onSubmitEditing={this.getSearchResults}
                        />
                        {
                            this.state.searchQ.length>0 ?
                            <MaterialCommunityIcons name="close" color='black'
                            size={25} 
                            style={{marginTop:5,position:'absolute',right:10}}
                            onPress={()=>this.setState({searchQ:''})}
                        />
                        :
                        null
                        }
                        
                    </View>
                </View>
                {
                    this.state.searchQ.length==0 ? 
                    null:
                    <View style={{marginTop:16,marginHorizontal:16}}>
                        <FlatList
                        
                            showsVerticalScrollIndicator={false}
                            data={this.state.artistData}
                            renderItem={({ item, index }) =>
                                this.renderArtist(item, index)
                                }
                            keyExtractor={item => item.ind}
                        />
                    
                    </View>
                } 
                {this.state.searchQ.length==0 && this.state.selectedSongList.length>0 ?
                   
                    
                        <Text style={{
                            color:'#fff',
                            fontFamily:'SFUIText-Bold',
                            fontSize:18,
                            marginHorizontal:16,
                            marginVertical:10
                        }}>
                                Picked artists
                        </Text>
                    :null}
                {this.state.searchQ.length==0 && this.state.selectedSongList.length>0 ?
                        <FlatList
                                showsVerticalScrollIndicator={false}
                                showsHorizontalScrollIndicator={false}
                                data={this.state.selectedSongList}
                                renderItem={this.renderSelectedSongs}
                                keyExtractor={item => item.id}
                                contentContainerStyle={{marginHorizontal:16}}
                                
                            />
                    :null}
                  
                
                    <View style={{
                        height:40,width:'100%',
                       
                    }} />
                    {this.state.searchQ.length==0 ?
                        <View style={{
                            
                            position:'absolute',
                            bottom:0,
                            height:60,
                            backgroundColor:dark_theme.black,
                            width:'100%',
                            flexDirection:'row',
                            justifyContent:'center',
                            paddingTop:10,
                            
                        }}>
                        
                            <TouchableOpacity style={{
                                borderRadius:5,
                                
                                width:'45%',
                                padding:10,
                                flexDirection:'row',
                                justifyContent:'center',
                                alignItems:'center',
                                borderWidth:1,
                                borderColor:dark_theme.green,
                                height:40,
                                marginHorizontal:7
                            
                             
                            }}
                            onPress={()=>{
                                this.props.navigation.navigate('GenreSearch')
                            }}
                         
                            >
                                <Text style={{
                                    fontSize:16,
                                    color:dark_theme.green,
                                    textAlign:'center',
                                    fontFamily:'SFUIText-Bold'
                                }}>
                                    Skip
                                </Text>
                            
                        </TouchableOpacity>
                        <TouchableOpacity style={{
                                borderRadius:5,
                                backgroundColor:dark_theme.green,
                                width:'45%',
                                padding:10,
                                flexDirection:'row',
                                justifyContent:'center',
                                alignItems:'center',
                                height:40,
                                marginHorizontal:7
                              
                            }}
                            onPress={()=>{
                                this.state.selectedSongList.length==0?

                             
                                  Snackbar.show({
                                    text:  "Pick at least 1 artist to continue or press 'Skip'",
                                    duration: Snackbar.LENGTH_LONG,
                                    action: {
                                      text: 'Okay',
                                      textColor: dark_theme.green,
                                      onPress: () => { /* Do something. */ },
                                    },
                                  })
                                  :
                                  this.props.navigation.navigate('GenreSearch',{tracks:this.state.selectedSongList})
                            }}
                         
                            >
                                <Text style={{
                                    fontSize:16,
                                    color:'white',
                                    textAlign:'center',
                                    fontFamily:'SFUIText-Bold'
                                }}>
                                    Pick Genres
                                </Text>
                            
                        </TouchableOpacity>
                    </View>
                :null}
            </View>
        );
    }
}
export default connect(mapStateToProps)(HomeScreen);

function mapStateToProps(state){
  return{
    token:state.token,
    id:state.id
  }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor:dark_theme.black,
        
    }
});