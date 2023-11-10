import {axiosPrivate} from '../api/axios';
import useRefresh from "./useRefresh";
import useAuth from "./useAuth";
import { useEffect } from "react";

export default function useAxiosPrivate(){

    const refresh = useRefresh()
    const {auth} = useAuth()

    useEffect(()=>{

        const requestIntercept = axiosPrivate.interceptors.request.use(
            config=>{
                if(!config.headers['Authorization']){
                    config.headers['Authorization'] = `Bearer ${auth?.accessToken}`
                }
                return config
            },(error)=> Promise.reject(error)
        )

        const responseIntercept = axiosPrivate.interceptors.response.use(
            response => response,
            async(error)=>{
                const prevRequest = error?.config
                console.log(error)
                //(error?.response?.status === 403) on if statment 
                if(error && !prevRequest?.sent){
                    prevRequest.sent = true
                    const {accessToken:newAccessToken} = await refresh()
                    prevRequest.headers['Authorization'] = `Bearer ${newAccessToken}`
                    return axiosPrivate(prevRequest)
                }
                return Promise.reject(error)
            }
        )
        return ()=>{
            axiosPrivate.interceptors.request.eject(requestIntercept)
            axiosPrivate.interceptors.response.eject(responseIntercept)
        }
    },[auth, refresh])

    return axiosPrivate
}