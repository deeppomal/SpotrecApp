const initialState ={
    id:null
    
}
const AuthID = (state=initialState,action)=>{
  
    if(action.type){
        switch(action.type){
            case 'SET_ID':
                return{
                    id:action.id
                }
        
            default : 
                return state
        }
    }
}

export default AuthID