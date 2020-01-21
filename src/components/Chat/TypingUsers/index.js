import React from 'react';
import _ from 'lodash';
import styles from '../chat.module.scss';

const TypingUsers = (props) => (
    <div>
        {_.map(_.get(props.chat, 'typing', {}), (status, uid) => {
            const user = props.users[uid] || {};
            if (uid === props.currentUser.id) { return null; }
            return (
                user.info
                && <span className={styles.chat_typing} key={uid}>
                    {user.info.name || 'Admin'} is typing...
                </span>
            );
        })}
    </div>
);

export default TypingUsers;
