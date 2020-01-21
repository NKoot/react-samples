import React, { Component } from 'react';
import '@fortawesome/fontawesome-free/css/all.min.css';
import styles from './dropdown.module.scss';
import DropDownButton from './dropdown.button';
import DropDownList from './dropdown.list';

class DropDown extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isDropdownVisible: false
        };
    }

    handleKeyPress = (e) => {
        if (this.dropBlock.contains(e.target)) {
            // click inside dropdown menu
            return;
        }
        // click outside dropdown menu
        this.setDropVisible(false);
    };

    componentDidMount() {
        document.addEventListener('mousedown', this.handleKeyPress);
    }

    componentWillUnmount() {
        document.removeEventListener('mousedown', this.handleKeyPress);
    }

    setDropVisible = (state) => {
        this.setState({
            isDropdownVisible: state
        });
    }

    render() {
        return (
            <div className={styles.dropdown__wrapper} ref={(c) => { this.dropBlock = c; }} >
                <DropDownButton
                    {...this.props}
                    onClick={() => this.setDropVisible(!this.state.isDropdownVisible)}
                    isDropdownVisible={this.state.isDropdownVisible}
                />
                {this.state.isDropdownVisible
                    && <DropDownList
                        items={this.props.items}
                        setDropVisible={() => this.setDropVisible(false)}
                    />
                }
            </div>
        );
    }
}

export default DropDown;
