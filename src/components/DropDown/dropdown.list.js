import React from 'react';
import styles from './dropdown.module.scss';

const DropDownList = ({ items = [], ...props }) => (
    <ul className={`${styles.nav__dropdown} ${styles.active}`}>
        {items.map((item) => (
            <li
                key={item.name}
                className={styles.nav__dropdown_item}
                onClick={() => {
                    props.setDropVisible();
                    item.onClick();
                }}
            >
                {item.iconName && <i className={item.iconName} />}
                <span>{item.name}</span>
            </li>
        ))}
    </ul>
);

export default DropDownList;
