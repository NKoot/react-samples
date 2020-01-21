import React, { Component } from 'react';
import Dropzone from 'react-dropzone';
import styles from '../../chat.module.scss';

class Attachment extends Component {
    onDrop() {
        return (files) => {
            const newMessage = {
                image: files[0]
            };
            this.props.onSave(newMessage);
        };
    }

    render() {
        return (
            <div className={styles.attachment}>
                <Dropzone
                    onDrop={this.onDrop()}
                    className="dropzone"
                    accept="image/jpeg, image/png, image/gif"
                >
                    {({ getRootProps, getInputProps }) => (
                        <div className={styles.link}
                            {...getRootProps()}
                        >
                            <input {...getInputProps()} />
                            <i className="material-icons">attach_file</i>
                        </div>
                    )}
                </Dropzone>
            </div>
        );
    }
}

export default Attachment;
