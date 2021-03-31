const initialState ={
    title:'',
    id:''
}
const Track = (state=initialState,action)=>{
    switch(action.type){
        case 'SET_TRACK':
            return{
                token:action.token
            }
        default : 
            return state
    }
}

export default Track