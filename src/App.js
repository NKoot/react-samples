import React, { Component } from 'react';
import { connect } from 'react-redux';
import Chat from './components/Chat';
import ChatButton from './components/ButtonWithBage';
import {
    fetchChat,
    chatActivate,
    chatDeactivate
} from './features/Chat';
import {
    isChatDialogOpenedSelector,
    activeChatSelector
} from './features/Chat/selectors';
import {
    unreadMessagesSelector,
    currentUserSelector,
    isAuthSelector,
    loadingSelector
} from './features/Auth/selectors';
import { preFetchAuthState, logout } from './features/Auth';
import Auth from './components/Auth';
import Loader from './components/Loader';
import DropDown from './components/DropDown';

class App extends Component {
    componentDidMount() {
        this.props.preFetchAuthState();
    }

    componentDidUpdate(prevProps) {
        if (Object.keys(prevProps.currentUser).length === 0 && Object.keys(this.props.currentUser).length > 0) {
            this.props.fetchChat();
        }
    }

    chatActivate = () => {
        const { activeChat, currentUser } = this.props;
        if (Object.keys(activeChat).length > 0) {
            this.props.chatActivate(activeChat.id, currentUser.id);
        } else {
            this.props.fetchChat();
        }
    }

    render() {
        const { activeChat, currentUser, unreadMessages } = this.props;
        const dropDownItems = [
            { name: 'My chat', iconName: 'fas fa-comment', onClick: this.chatActivate },
            { name: 'Logout', iconName: 'fas fa-sign-out-alt', onClick: this.props.logout }
        ];


        if (this.props.loading) { return <Loader />; }
        return (
            <>
                {Object.keys(currentUser).length > 0
                    ? <>
                        <header className="">
                            <h2>
                                Components testing
                            </h2>
                            <DropDown
                                title='My account'
                                items={dropDownItems}
                                caret={true}
                                iconName='fas fa-user-circle'
                            />
                        </header>
                        {this.props.isChatDialogOpened
                            ? <Chat
                                chat={activeChat}
                                currentUser={currentUser}
                                onClose={() => this.props.chatDeactivate(activeChat.id, currentUser.id)}
                            />
                            : <ChatButton
                                badgeData={unreadMessages[activeChat.id]}
                                condition={unreadMessages[activeChat.id] > 0}
                                title="Contact with support"
                                onClick={this.chatActivate}
                            />
                        }
                    </>
                    : <Auth />
                }
            </>
        );
    }
}

export default connect(
    (state) => ({
        currentUser: currentUserSelector(state),
        activeChat: activeChatSelector(state),
        isChatDialogOpened: isChatDialogOpenedSelector(state),
        isAuth: isAuthSelector(state),
        unreadMessages: unreadMessagesSelector(state),
        loading: loadingSelector(state)
    }), {
        preFetchAuthState,
        fetchChat,
        chatActivate,
        chatDeactivate,
        logout
    }
)(App);
