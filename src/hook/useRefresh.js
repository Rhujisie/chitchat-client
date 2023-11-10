import axios from "../api/axios";
import useAuth from './useAuth'

export default function useRefresh(){

    const {setAuth} = useAuth()

    const refresh = async()=>{
        try{
            const {data} = await axios.get('/refresh')
            
        setAuth(prev=> ({...prev, ...data}))
        return data
        }catch(err){
            console.log(err)
        }
    }
    return(refresh)
}