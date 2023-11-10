
export default function Message({messagesArray, auth, selectedImage}){
    const messages = [...messagesArray]
    let messageElem = messages.map((message, index)=>
    <div className={`message ${message.mine || 
        message.sender === auth? 'right': 'left'} `} key={index}>
        <div className='message-main'>
        {message.file? 
            <>
                {selectedImage?<img src={selectedImage} 
                        alt='car' className='display-image'/>
                :<img src={`https://ch-y5v4.onrender.com/uploads/${message.file}`} 
                        alt='car' className='display-image'/>}
                <div className='img-text'>{message.text}</div>
            </>: message.text}
        </div>
    </div>)
    return(
        <>
            {messageElem}
        </>
    )
}