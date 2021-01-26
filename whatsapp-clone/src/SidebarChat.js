import { Avatar } from '@material-ui/core';
import React from 'react'
import "./SidebarChat.css";

function SidebarChat() {
    return (
        <div className="sidebarChat">
            <Avatar />
            <div className="sidebarChat__info">
                <h2>roomname</h2>
                <p>this is last message</p>
            </div>
        </div>
    )
}

export default SidebarChat
