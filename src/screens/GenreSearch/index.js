import React, { Component } from "react";
import { 
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    StatusBar,
    ToastAndroid,
    AsyncStorage,
    Dimensions
} from "react-native";
import {connect} from 'react-redux';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import dark_theme from '../../constants/color';
import Snackbar from 'react-native-snackbar';


var randomColor  = require('randomcolor');

function mapStateToProps(state){
    return{
      token:state.token
    }
  }

class GenreSearch extends Component {

    constructor(props){
        super(props)
        this.state={
            genreList:[],
            isGenreLoading:false,
            newGenreList:[],
            selectedGenreList:[],
            token:null

        }
    }
    componentDidMount(){

        
        this.getGenres();
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
          {
            this.getToken()
            
          }
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

          this.getGenres();
        } catch (error) {
          console.log("Something went wrong", error);
        }
      }
    getGenres=()=> {

     
        this.setState({isGenreLoading:true})
        return fetch('https://api.spotify.com/v1/recommendations/available-genre-seeds', {method: 'GET',
          headers: {
                    'Content-Type'    : 'application/json',
                    'Accept'          : 'application/json',
                    'Authorization'   : 'Bearer '+this.props.token
                }})
            .then((response) => response.json())
            .then(async (responseJson) => {
             
               console.log('GENRES',responseJson)
                var cList = randomColor({
                    count: responseJson.genres.length,
                    hue: 'green',
                    luminosity: 'light',
                 });
                
                this.setState({
                    colorList:cList,
                    isGenreLoading:false
                })
               
                await this.setGenreItem(responseJson.genres)
            })
            .catch((error) => {
                console.error(error);
                this.setState({isGenreLoading:false})
            });
       
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
               
                width:Dimensions.get('window').width/2.2,
                height:40,
               
                
                marginVertical:10,
                marginHorizontal:5,
                borderRadius:5,
                justifyContent:'center',
                alignItems:'center',
                backgroundColor:dark_theme.green
            }:
            {
                borderWidth:1,
                width:Dimensions.get('window').width/2.2,
                height:40,
                
                borderColor:'lightgray',
                marginVertical:10,
                marginHorizontal:5,
                borderRadius:5,
                justifyContent:'center',
                alignItems:'center',
                
                


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
                    {this.Capitalize(item[0].title) }
                </Text>
            </TouchableOpacity>
          
        )
    }
    renderGenresLoading=()=>{
        return(
            <View>

            
                <TouchableOpacity style={{
                    backgroundColor:'rgba(105,105,105, 0.8)',
                    width:Dimensions.get('window').width/2.2,
                    height:40,
                    marginVertical:10,
                    marginHorizontal:5,
                    borderRadius:5,
                   

                }}>

                </TouchableOpacity>
            </View>
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
        if(list.length>0){
            var str=list[0].id;
            for (let i=1;i<list.length;i++){
                str = str.concat("%2C" , list[i].id);
               
            }
        }
        else{
            var str ='';
        }
       
        return str;
    }

    Capitalize(str){
        return str.charAt(0).toUpperCase() + str.slice(1);
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
                                style={{position:'absolute',left:10}}
                                onPress={()=>this.props.navigation.goBack()}
                            />
                        <Text style={{
                            fontSize:30,
                            color:'#fff',
                            textAlign:'center',
                           
                            fontFamily:'SFUIText-Bold'
                        }}>
                            Pick Genres
                        </Text>
                    </View>
                   

                

                   

                    
                    {this.state.isGenreLoading ?
                   
                    
                   
                        <FlatList
                            showsVerticalScrollIndicator={false}
                            showsHorizontalScrollIndicator={false}
                            data={[1,2,3,4,5,6,7,8,9,10,1,2,3,4,5,6,7,8,9,10,1,2,3,4,5,6,7,8,9,10]}
                            renderItem={this.renderGenresLoading}
                            keyExtractor={item => item.id}
                            contentContainerStyle={{}}
                            numColumns={2}
                            contentContainerStyle={{alignSelf:'center'}}
                        />
                   
                   
                  :
                        <FlatList
                        showsVerticalScrollIndicator={false}
                        showsHorizontalScrollIndicator={false}
                        data={this.state.newGenreList}
                        renderItem={this.renderGenres}
                        keyExtractor={item => item.ind}
                        numColumns={2}
                        contentContainerStyle={{alignSelf:'center'}}
                        />
                    }
                   
                 
                    <View style={{
                        height:60,width:'100%'
                    }} />
                    <View style={{
                            
                            position:'absolute',
                            bottom:0,
                            height:50,
                            backgroundColor:dark_theme.black,
                            width:'100%',
                            flexDirection:'row',
                            justifyContent:'center',
                            
                            
                        }}>
                            <TouchableOpacity style={{
                                borderRadius:5,
                                
                                width:'45%',
                               
                                flexDirection:'row',
                                justifyContent:'center',
                                alignItems:'center',
                                borderWidth:1,
                                borderColor:dark_theme.green,
                                height:40,
                                marginHorizontal:7
                            }}
                             onPress={()=>{

                             
                                this.props?.route?.params?.tracks ?

                                this.props.navigation.navigate('SimilarSongs',{
                                    
                                    track:this.setTrackString(this.props?.route?.params?.tracks)
                                })
                                :
                                Snackbar.show({
                                    text: 'Pick atleast 1 artist or genre',
                                    duration: Snackbar.LENGTH_LONG,
                                    action: {
                                      text: 'Okay',
                                      textColor: dark_theme.green,
                                      onPress: () => {},
                                    },
                                  });
                            }}
                        
                            >
                                <Text style={{
                                    fontSize:16,
                                    color:dark_theme.green,
                                    textAlign:'center',
                                    fontFamily:'SFUIText-Semibold'
                                }}>
                                   Skip
                                </Text>
                               
                            </TouchableOpacity>
                            <TouchableOpacity style={{
                                        borderRadius:5,
                                        backgroundColor:dark_theme.green,
                                        width:'45%',
                                        
                                        flexDirection:'row',
                                        justifyContent:'center',
                                        alignItems:'center',
                                        height:40,
                                        marginHorizontal:7
                                    
                                    }}
                                    onPress={()=>{

                                        this.state.selectedGenreList.length>0 && this.props?.route?.params?.tracks?

                                            this.props.navigation.navigate('SimilarSongs',{
                                                genre:this.setGenreString(this.state.selectedGenreList),
                                                track:this.setTrackString(this.props?.route?.params?.tracks)
                                            })
                                        :
                                            this.state.selectedGenreList.length>0 ?

                                            this.props.navigation.navigate('SimilarSongs',{
                                                genre:this.setGenreString(this.state.selectedGenreList),
                                                
                                            })

                                        :
                                        Snackbar.show({
                                            text: "Pick at least 1 genre to continue or press 'Skip'",
                                            duration: Snackbar.LENGTH_LONG,
                                            action: {
                                              text: 'Okay',
                                              textColor: dark_theme.green,
                                              onPress: () => {  },
                                            },
                                          });
                                      
                                    }}>
                                        <Text style={{
                                            fontSize:16,
                                            color:'white',
                                            textAlign:'center',
                                            fontFamily:'SFUIText-Semibold'
                                        }}>
                                        Get similar songs
                                        </Text>
                                    
                            </TouchableOpacity>
                    </View>
                    
            </View>
        );
    }
}
export default connect(mapStateToProps)(GenreSearch);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor:dark_theme.black,
        
    }
});