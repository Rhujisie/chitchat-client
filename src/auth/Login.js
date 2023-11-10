import {useState, useEffect} from 'react'
import axios from '../api/axios'
import {useNavigate, Link} from 'react-router-dom'
import useAuth from '../hook/useAuth'
import {motion} from 'framer-motion'

export default function Login(){
    const [loginData, setLoginData] = useState({
        username:'', password: ''
    })
    const [errMsg, setErrMsg] = useState('')
    const {auth, setAuth} = useAuth()
    const navigate = useNavigate()

    //clear error
    useEffect(()=>{
        setErrMsg('')
    },[loginData])

    const handleSubmit = async(e) =>{
        e.preventDefault()
        try{
            const {data} = await axios.post('/auth/login', loginData)
            console.log(data)
            setAuth(data)
            navigate('/', {replace: true})
        }catch(err){
            console.log(err)
            setErrMsg(err.response.data.msg)
        }
    }
    const handleChange =(e)=>{
        setLoginData(prev=> ({...prev, [e.target.name]: e.target.value}))
    }

    console.log(auth)

    return(
        <div className='auth-container'>
            <div className='heading chat-heading'>
                <div className='chit-chat'>ChitChat</div>
                <div>
                    <img src={require('../icons/chat.gif')} alt='logo' className='logo'/>
                </div>
            </div>
            <h2 className='auth-heading'>Login</h2>
            <div>
                <p className={errMsg? 'error-container': 'offscrean'}>
                    {errMsg}
                </p>
                <form onSubmit={handleSubmit} className='auth-form'>
                    <input type='text' value={loginData.username} name='username'
                        onChange={handleChange}
                        placeholder='username'/>
                    <input type='password' value={loginData.password} name='password'
                        onChange={handleChange}
                        placeholder='password'/>
                    <motion.button whileHover={{scale: 1.1}} whileTap={{scale: .9}}
                    transition={{type:'spring', stiffness: 100, damping: 10}}
                    >login</motion.button>
                </form>
                <div className='redirect-button'>
                    <Link to='/register'>create a <span className='span'>ChitChat</span> account?</Link>
                </div>
            </div>
        </div>
    )
}