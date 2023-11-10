import { Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import useRefresh from "../hook/useRefresh";
import useAuth from "../hook/useAuth";


export default function PersistLogin(){
    const [isLoading, setIsLoading] = useState(true)
    //const [loggedIn, setLoggedIn] = useState(localStorage.getItem('loggedIn') || false)
    const refresh = useRefresh()
    const {auth} = useAuth()

    useEffect(()=>{
        let isMounted = true
        const verifyRefreshToken = async()=>{
            try{
                await refresh()
            }catch(err){
                console.log(err)
            }
            //this will run irregardless(may cause memory leak)
            finally{
                isMounted && setIsLoading(false)
            }
        }

           (!auth?.accessToken)? verifyRefreshToken(): setIsLoading(false)

        //cleaning memory leak(state is changed when component is not mounted)
        return ()=>{
            isMounted = false
        }
    },[])
    return(
        <>
            {isLoading? 
                <p>Loading...</p>:
                <Outlet/>}
        </>
    )
}