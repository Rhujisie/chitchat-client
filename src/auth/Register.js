import {useEffect, useState} from 'react'
import axios from '../api/axios'
import useAuth from '../hook/useAuth'
import { useNavigate, Link } from 'react-router-dom'
import {motion} from 'framer-motion'
import Spinner from '../spinner/Spinner'

export default function Register(){
    
    const [registerData, setRegisterData] = useState({
        username: '', password: ''
    })
    const [login, setLogin] = useState(false)
    const [errMsg, setErrMsg] = useState('')
    const {setAuth} = useAuth()
    const navigate = useNavigate()

    //clear error
    useEffect(()=>{
        setErrMsg('')
    },[registerData])

    const handleSubmit = async(e)=>{
        e.preventDefault()
        try{
            setLogin(true)
            const {data} = await axios.post('/auth/register', registerData)
            setAuth(data)
            navigate('/', {replace: true})
        }catch(err){
            console.log(err)
            setLogin(false)
            setErrMsg(err.response.data.msg)
        }
    }

    const handleChange = (e)=>{
        setRegisterData(prev=> ({...prev, [e.target.name]: e.target.value}))
    }
    return(
        <div className='auth-container'>
            <div className='heading chat-heading'>
                <div className='chit-chat'>ChitChat</div>
                <div>
                    <img src={require('../icons/chat.gif')} alt='logo' className='logo'/>
                </div>
            </div>
            <h2 className='auth-heading'>Register</h2>
            <div>
                <p className={errMsg? 'error-container': 'offscrean'}>
                    {errMsg}
                </p>
                <form onSubmit={handleSubmit} className='auth-form'> 
                    <input type='text' value={registerData.username} name='username'
                        onChange={handleChange}
                        placeholder='username'/>
                    <input type='password' value={registerData.password} name='password'
                        onChange={handleChange}
                        placeholder='password'/>
                    <motion.button whileHover={{scale: 1.1}} whileTap={{scale: .9}}
                    transition={{type:'spring', stiffness: 100, damping: 10}}>
                        {login? <Spinner/>: 'Register'}</motion.button>
                </form>
                <div className='redirect-button'>
                    <Link to='/login'>Already have an account?</Link>
                </div>
            </div>
        </div>
    )
}