import React from 'react';
import styles from './dropdown.module.scss';

const DropDownButton = ({
    caret = true, title = '', iconName = '', ...props
}) => (
    <div className={styles.dropdown__link} onClick={props.onClick}>
        <i className={iconName} />
        <span>{title}</span>
        {caret
            && <i className={`fas ${props.isDropdownVisible ? 'fa-caret-up' : 'fa-caret-down'}`} />
        }
    </div>
);

export default DropDownButton;
