import React from 'react';
import UserList from '../UserList';
import styles from '../chat.module.scss';
import CloseButton from '../../CloseButton';

const ChatHeader = (props) => (
    <div className={styles.chat_header}>
        <CloseButton onClick={props.onClose} />
        <UserList users={props.users} />
    </div>
);

export default ChatHeader;
