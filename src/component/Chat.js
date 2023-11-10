import { useEffect, useRef, useState } from 'react'
import useAuth from '../hook/useAuth'
import { useNavigate, Navigate } from 'react-router-dom'
import useAxiosPrivate from '../hook/useAxiosPrivate'
import {motion} from 'framer-motion'
import Spinner from '../spinner/Spinner'

import Users from './Users'
import Message from './Message'

import Attachment from '../icons/attachment.png'

export default function Chat(){

    const [ws, setWs] = useState(null)
    const [text, setText] = useState('')
    const [selectedUser, setSelectedUser] = useState()
    const [onlineUsers, setOnlineUsers] = useState()
    const [allUsers, setAllUsers] = useState()
    const [messages, setMessages] = useState([])
    const [file, setFile] = useState({})
    const [selectedImage, setSelectedImage] = useState()
    const [logout, setLogout] = useState(false)

    const messageRef = useRef()
    const textRef = useRef()

    const {auth, setAuth} = useAuth()
    const axiosPrivate = useAxiosPrivate()
    const navigate = useNavigate()

    //ws connection
    useEffect(()=>{
        !!auth && connectToWs()
    },[])
    const connectToWs = ()=>{
        if(!auth) return
        // const ws = new WebSocket('ws://localhost:3000')
        const ws = new WebSocket('wss://ch-y5v4.onrender.com');
        setWs(ws)
        //send authentication
        // ws.addEventListener('open', ()=>{
        //     ws.send(JSON.stringify({token: auth.accessToken}))
        // })
        //listening for incoming message
        ws.addEventListener('message', handleRecievedMessage)

        // auto reconnecting
        ws.addEventListener('close', ()=>{
            setTimeout(()=>{
                connectToWs()
            }, 1000)
        })
    }
    //recieve message from ws
    const handleRecievedMessage = (e)=>{
        const messageData = JSON.parse(e.data)
        if('online' in messageData){
            onlineUser(messageData.online.filter(user=> user.userId !== auth.userId))
        }
        if('text' in messageData){
            setMessages(prev=> [...prev, {...messageData, mine: false}])
        }
    }
    //send message
    const sendMessage = async(e)=>{
        e.preventDefault()
        
        if(!Object.keys(file).length && !text) return

        if(Object.keys(file).length){
            console.log(file)
            ws.send(JSON.stringify({
                text: text,
                recipient: selectedUser._id,
                file: file
            }))
            setMessages(prev=>[...prev, {text: text,
                mine: true, _id: Date.now(), file: file.name}])
        }else{
            ws.send(JSON.stringify({
                text: text,
                recipient: selectedUser._id,
                file: null
            }))
            setMessages(prev=> [...prev, {text: text, mine: true, _id: Date.now()}])
        }     
        setText('')
        setFile({})
    }
    //select user
    const selectUser = (user)=>{
        setSelectedUser(user)
    }
    //set online user
    const onlineUser = (users)=>{
        const newUser = {}
        for(let user of users){
            newUser[user.userId] = user.username
        }
        setOnlineUsers(newUser)
    }
    //fetch all user
    useEffect(()=>{
        const getUsers = async()=>{
            try{
                const {data} = await axiosPrivate.get('/people')
                setAllUsers(data)
            }catch(err){
                console.log(err)
            }
        }
        getUsers()
    },[])
    //fetch message
    useEffect(()=>{
        const getMessage = async()=>{
            try{
                const {data} = await axiosPrivate.get(`/message/${selectedUser._id}`)
                setMessages(data)
            }catch(err){
                console.log(err)
            }
        }
        !!selectedUser && getMessage()
    },[selectedUser])

    //auto scroll
    useEffect(()=>{
        const div = messageRef.current
        if(div){
            div.scrollTop = div.scrollHeight
        }
    },[messages])

    //logout
    const handleLogout = async ()=>{
        try{
            setLogout(true)
            await axiosPrivate.get('/logout')
            ws.send(JSON.stringify({
                text: 'terminate'
            }))
            setWs(null)
            setAuth(null)
            navigate('/login', {replace: true})
        }catch(err){
            console.log(err)    
            setLogout(false)
        }
    } 
    //handle file input
    const handleFile =(e)=>{
        const file = e.target.files[0]
        const reader = new FileReader()
        const part  = file.name.split('.')
        const ext = part[part.length - 1]
        let name = Date.now() + '.' + ext
        reader.readAsDataURL(e.target.files[0])
        reader.onload=()=>{
            setFile({data: reader.result, name: name})
        }
        const imageUrl = URL.createObjectURL(file) 
        setSelectedImage(imageUrl)
    }
    //handle text input
    const handleTextInput = (e)=>{
        let newText = e.target.value
        setText(newText)
        if(text.length && text.length % 40 === 0){
            const scrollHeight = textRef.current.scrollHeight;
            const padding = parseInt(getComputedStyle(textRef.current).padding, 10);
            textRef.current.style.height = `${scrollHeight + padding}px`;
        }
        if(newText.length < 40) textRef.current.style.height = '40px'
    }

    return(
        <div className='chat-container'>
            {!auth && <Navigate to='/login' replace={true}/>}
            <div className='user-container'>
                <div className='heading chat-heading'>
                    <div className='chit-chat'>ChitChat</div>
                    <div>
                        <img src={require('../icons/chat.gif')} alt='logo' 
                        className='logo'/>
                    </div>
                </div>
                <Users users={allUsers} selectUser={selectUser} 
                    online= {onlineUsers} selectedUser={selectedUser}/>
                <div className='logout-button'>
                    <div>
                        {auth?.username}
                    </div>
                    <motion.button onClick={handleLogout}
                    whileHover={{scale: 1.1}} whileTap={{scale: .9}}
                    transition={{type:'spring', stiffness: 100, damping: 10}}>
                        {logout? <Spinner/>: 'Logout'}</motion.button>
                </div>
            </div>
            {selectedUser ? <div className={`message-container`}>
                <h4 className='heading message-heading'>
                    {selectedUser.username}
                </h4>
                <div className='messages' ref={messageRef}>
                    <Message messagesArray={messages} auth={auth.userId} 
                        selectedImage={selectedImage}/>
                </div>
                <div className='input-container'>
                    <form onSubmit={sendMessage}>
                        <div className='text-container'>
                            <textarea type='text' value={text} 
                                placeholder='Type here...' ref={textRef}
                                onChange={handleTextInput}
                                className='text-input'/>
                        </div>
                        <div className='file-input'>
                            <motion.label className='file-label'
                            whileHover={{scale: 1.1}} whileTap={{scale: .9}}
                            transition={{type:'spring', stiffness: 100,
                             damping: 10}}>
                                <img src={Attachment} alt='file' 
                                className='file-logo'/>
                                <input type='file'
                                    onChange={handleFile}
                                    name='file' className='file'
                                    multiple
                                />
                            </motion.label>
                        </div>
                        <motion.button className='send-button'
                        whileHover={{scale: 1.1}} whileTap={{scale: .9}}
                        transition={{type:'spring', stiffness: 100, damping: 10}}>
                            Send</motion.button>
                    </form>
                </div> 
            </div>: <div className='start'>Start a conversation.</div> }
        </div>
    )
}