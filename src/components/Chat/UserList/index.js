import React from 'react';
import _ from 'lodash';
import cn from 'classnames';
import userStyles from './userlist.module.scss';

const UserList = (props) => (
    <ul className={userStyles.chatUserList}>
        {_.map(props.users, (user, uid) => {
            return (
                <li key={uid}>
                    <span className={cn(userStyles.status, {
                        [userStyles.online]: user.info.online,
                        [userStyles.offline]: !user.info.online
                    })}>
                    &bull;
                    </span>
                    {user.info.name || 'Admin'}
                </li>
            );
        })}
    </ul>
);

export default UserList;
