import React from 'react';

const styles = {
    button: {
        width: 'auto',
        display: 'inline-block',
        borderRadius: '10px',
        background: '#F6C254',
        padding: '10px',
        margin: '10px',
        cursor: 'pointer',
        position: 'relative',
        textTransform: 'uppercase',
        fontFamily: 'arial',
        fontSize: '0.9em'
    },
    badge: {
        position: 'absolute',
        left: '96%',
        right: 'auto',
        bottom: 'auto',
        top: '-10px',
        padding: '5px',
        margin: 0,
        zIndex: 10,
        background: 'rgb(233, 62, 20)',
        color: '#fff',
        lineHeight: 1,
        borderRadius: '20px'
    }
};

const Button = (props) => (
    <div style={styles.button} onClick={props.onClick} >
        <span>{props.title}</span>
        {props.condition
            && <span style={styles.badge}>
                {props.badgeData}
            </span>
        }
    </div>
);

export default Button;
