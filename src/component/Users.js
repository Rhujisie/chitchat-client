import {motion} from 'framer-motion'

export default function Chat({users, selectUser, online, selectedUser}){
    const usersElem = users?.map((user, index)=> 
    <motion.div key={index} className={`online-user ${selectedUser?._id === user._id?
        'selected-user':''}`} onClick={()=>selectUser(user)}
        whileHover={{scale: 1.1}} whileTap={{scale: .9}}
        transition={{type:'spring', stiffness: 100, damping: 10}}>
        <div className={`avatar`}>
            {user.username[0].toUpperCase()}
            {online && <div className={`${online[user._id]? 'online': ''}`}></div>}
        </div>
        <div>{user.username}</div>
    </motion.div>)

    return(
        <div className="users">
            {users && usersElem}
        </div>
    )
}