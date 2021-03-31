const initialState ={
    token:null
    
}
const AuthToken = (state=initialState,action)=>{
   
    if(action.type){
        switch(action.type){
            case 'SET_TOKEN':
                return{
                    token:action.token
                }
        
            default : 
                return state
        }
    }
    
}

export default AuthToken