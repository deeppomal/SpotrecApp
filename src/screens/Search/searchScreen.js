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
    ScrollView

} from "react-native";
import {connect} from 'react-redux';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import light_theme from '../../constants/color';

function mapStateToProps(state){
    return{
      token:state.token,
      id:state.id
    }
  }
  
class SearchScreen extends Component {

    constructor(props){
        super(props)
            this.state={
                searchQ:'',
                trackData:[],
                dataLoading:false,
                selectedTracks:[]
            }
    }

    componentDidMount(){
        this.textInputRef.focus()
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
                    data.push(responseJson.tracks.items[i])
                   
                }
                
                this.setState({
                    trackData:data
                })
            })
            .catch((error) => {
                console.error(error);
            });
        }
        else{
            console.log('query length 0')
        }
    }

    renderArtist=(item,index)=>{
        return(
            <TouchableOpacity style={{
                marginVertical:10,}}
                onPress={()=> {
                    
                    var selected =
                        {
                            artist:item.artists[0].name,
                            id:item.id,
                            title:item.name,
                            albumArt:item.album.images[1].url

                        }
                   
                    this.props.navigation.navigate('HomeScreen',{selectedSearch:selected})
                }}>
               <View style={{flexDirection:'row',alignItems:'center'}}>
                    <Image style={{
                        height:40,
                        width:40,
                        borderRadius:10,
                        }} source={{uri:item.album.images[1].url}} />

                    <View style={{marginHorizontal:10}}>
                        <Text>{item.name}</Text>
                        <Text>{item.artists[0].name}</Text>
                    </View>
                    
               </View>
                
                <View style={{
                    width:'95%',
                    height:1,
                    marginVertical:10,
                    backgroundColor:light_theme.light_gray
                }} />
            </TouchableOpacity>
        )
    }

   

    render() {

        
      
        return (
            <View style={styles.container}>
                
                <View style={{
                        backgroundColor:light_theme.light_gray,
                        width:'100%',
                        padding:5,
                        borderRadius:5,
                        flexDirection:'row',
                        justifyContent:'space-between',
                        alignItems:'center'
                    }}>
                    <TextInput placeholder='Search songs...'
                         maxLength={40} 
                         value={this.state.searchQ}
                         ref={ref => this.textInputRef = ref}
                         onChangeText={(value)=>
                            {
                                this.setState({searchQ:value})
                                this.getSearchResults()
                            }}
                         style={{width:'80%'}}
                         onSubmitEditing={this.getSearchResults}
                         autoFocus={true}/>
                    <MaterialCommunityIcons name="magnify" 
                            size={30} 
                            onPress={this.getSearchResults}
                    />
                </View>
              
                <View>
                    <FlatList
                    
                        showsVerticalScrollIndicator={false}
                        data={this.state.trackData}
                        renderItem={({ item, index }) =>
                            this.renderArtist(item, index)
                            }
                        keyExtractor={item => item.id}
                    />
                </View>
            </View>
        );
    }
}
export default connect(mapStateToProps)(SearchScreen);


  
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor:'white',padding:16
    }
});