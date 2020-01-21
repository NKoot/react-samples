import React, { Component } from 'react';
import moment from 'moment';
import _ from 'lodash';
import cn from 'classnames';
import styles from '../chat.module.scss';

const avatarPlaceholder = require('../user.png');

class ChatMessages extends Component {
    scrollToBottom() {
        //sroll to the last message
        const { scrollHeight } = this.messageList;
        const height = this.messageList.clientHeight;
        const maxScrollTop = scrollHeight - height;
        this.messageList.scrollTop = maxScrollTop > 0 ? maxScrollTop : 0;
    }

    componentDidMount() {
        this.scrollToBottom();
    }

    componentDidUpdate(prevProps) {
        if (_.get(prevProps.messages, 'length') < _.get(this.props.messages, 'length')) {
            this.scrollToBottom();
        }
    }

    render() {
        const { users, currentUser, messages } = this.props;
        this.messageList = _.map(messages, (message, mid) => {
            const sender = message.sender === currentUser.id ? currentUser : users[message.sender];
            if (sender) {
                return (
                    <li key={message.id}>
                        <div className={cn(styles.message_block, {
                            [styles.my_message]: message.sender === currentUser.id
                        })}>
                            <img src={_.get(sender, 'info.photo', avatarPlaceholder)}
                                className={styles.avatar} alt="avatar"
                            />
                            <div className={styles.message_info}>
                                <div className={styles.message_data}>
                                    <span className={styles.sender_name}>
                                        <span className={cn(styles.status, {
                                            online: _.get(sender, 'info.online'),
                                            offline: !_.get(sender, 'info.online')
                                        })}>
                                        &bull;
                                        </span>
                                        {_.get(sender, 'info.name')}
                                    </span>
                                    <span className={styles.message_time}>{moment(message.created).fromNow()}</span>
                                </div>
                                <div className={styles.message_text}>
                                    {message.type === 'stm' ? message.text : null}
                                    {message.type === 'aim' ? <img src={message.image} alt="message_image" /> : null}
                                </div>
                            </div>
                        </div>
                    </li>
                );
            }
            return null;
        });

        return (
            <div className={styles.chat_messages} ref={(div) => {
                this.messageList = div;
            }}>
                <ul>
                    {this.messageList}
                </ul>
            </div>
        );
    }
}

export default ChatMessages;
