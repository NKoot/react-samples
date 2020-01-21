import React, { Component } from 'react';
import { created } from '../../../helpers/Firebase';
import Attachment from './Attachment';
import styles from '../chat.module.scss';

class SendMessageForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            message: {
                text: '',
                file: null
            }
        };
    }

    handleChange = (event) => {
        this.setState({
            message: {
                ...this.state.message,
                text: event.target.value
            }
        });
        this.props.startTyping();
    }

    keyDown = (event) => {
        if (event.keyCode === 13) {
            event.preventDefault();
            this.saveMessage({ text: event.target.value });
        }
    }

    onSubmit = (event) => {
        event.preventDefault();
        this.saveMessage({ text: this.state.message.text });
    }

    saveMessage(message, type, additionals) {
        const newMessage = {
            ...message,
            sender: this.props.currentUser.id,
            created,
            type: type || 'stm'
        };
        if (additionals) {
            this.props.postFileMessage(newMessage);
        } else {
            this.props.postTextMessage(newMessage);
        }
        this.setState({
            message: {
                ...this.state.message,
                text: ''
            }
        });
    }

    render() {
        return (
            <div className={styles.chat_send_message}>
                <Attachment onSave={(message) => this.saveMessage(message, 'aim', true)} />
                <textarea
                    placeholder="Enter message"
                    name="input_text"
                    type="text"
                    className={styles.input_text}
                    onKeyDown={this.keyDown}
                    onChange={this.handleChange}
                    value={this.state.message.text}
                ></textarea>
                <button
                    type="submit"
                    className={styles.send_message}
                    aria-label="send message"
                    onClick={this.onSubmit}
                    disabled={this.state.message.text === ''}
                ><i className="material-icons">send</i></button>
            </div>
        );
    }
}

export default SendMessageForm;
