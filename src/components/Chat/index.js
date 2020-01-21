import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import styles from './chat.module.scss';
import ChatMessages from './ChatMessageList';
import SendMessageForm from './SendMessageForm';
import ChatHeader from './ChatHeader';
import TypingUsers from './TypingUsers';
import {
    setUserActiveAfterDisconnect,
    setTypingState,
    postTextMessage,
    postFileMessage
} from '../../features/Chat';
import {
    isChatLoadingSelector,
    usersSelector,
    isChatDialogOpenedSelector
} from '../../features/Chat/selectors';
import {
    unreadMessagesSelector
} from '../../features/Auth/selectors';


class Chat extends Component {
    constructor(props) {
        super(props);
        this.state = {
            timer: null
        };

        this.startTyping = _.throttle(() => {
            const {
                chat, currentUser
            } = this.props;
            if (!_.isObject(chat.active) || _.find(chat.active, currentUser.id) === 'underfined') {
                this.props.setUserActiveAfterDisconnect(chat, currentUser);
            }
            if (this.state.timer) {
                clearTimeout(this.state.timer);
            }
            const timer = setTimeout(() => {
                //STOP_TYPING
                this.props.setTypingState(chat, currentUser);
            }, 3000);
            this.setState({
                timer
            });
            //START_TYPING
            this.props.setTypingState(chat, currentUser, true);
        }, 2000);
    }

    render() {
        const { chat, currentUser, users } = this.props;
        return (
            <div className={styles.chat_dialog}>
                <div className={styles.chat_content}>
                    <ChatHeader
                        chat={chat}
                        users={users}
                        onClose={this.props.onClose}/>
                    <ChatMessages
                        chat={chat}
                        currentUser={currentUser}
                        users={users}
                        messages={_.get(chat, '$messages')}
                    />
                    <TypingUsers
                        chat={chat}
                        users={users}
                        currentUser={currentUser}
                    />
                    <SendMessageForm
                        startTyping={this.startTyping}
                        currentUser={currentUser}
                        postFileMessage={(newMessage) => this.props.postFileMessage(this.props.chat, newMessage)}
                        postTextMessage={(newMessage) => this.props.postTextMessage(this.props.chat, newMessage)}
                    />
                </div>
            </div>
        );
    }
}

export default connect(
    (state) => ({
        loading: isChatLoadingSelector(state),
        users: usersSelector(state),
        isChatDialogOpened: isChatDialogOpenedSelector(state),
        unreadMessages: unreadMessagesSelector(state)
    }), {
        setUserActiveAfterDisconnect,
        setTypingState,
        postTextMessage,
        postFileMessage
    }
)(Chat);
