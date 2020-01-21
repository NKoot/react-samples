import React from 'react';
import styles from './closebutton.module.scss';

const CloseButton = ({ visible = true, ...props }) => (
    <>
        { visible
            ? <span onClick={props.onClick} className={styles.button}>x</span>
            : null
        }
    </>
);

export default CloseButton;
