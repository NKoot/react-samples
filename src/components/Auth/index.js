import React, { Component } from 'react';
import { connect } from 'react-redux';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import { firebase, firebaseAuth } from '../../helpers/Firebase';
import { isAuthSelector, isAuthErrorSelector } from '../../features/Auth/selectors';
import styles from './auth.module.scss';

const uiConfig = {
    // Popup signin flow rather than redirect flow.
    signInFlow: 'popup',
    // We will display Google and Facebook as auth providers.
    signInOptions: [
        {
            provider: firebase.auth.PhoneAuthProvider.PROVIDER_ID,
            recaptchaParameters: {
                type: 'image',
                size: 'invisible',
                badge: 'bottomleft'
            },
            defaultCountry: 'US'
        }
    ],
    callbacks: {
        // Avoid redirects after sign-in.
        signInSuccessWithAuthResult: (authResult) => false
    }
};
class Auth extends Component {
    render() {
        const { error } = this.props;
        return (
            <div className={styles.auth}>
                <h2 className={styles.auth__header}>Verify your identity for your safety and the safety of information.</h2>
                <div className={styles.auth__block}>
                    <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={firebaseAuth} />
                    {error
                        && <div className={styles.error__block}>
                            <div className="form__msg--error">
                                <i className="form__msg-icon material-icons">error</i>
                                <div className="form__msg-text">{error}</div>
                            </div>
                        </div>
                    }
                </div>
            </div>
        );
    }
}

export default connect(
    (state) => ({
        isServer: false,
        isAuth: isAuthSelector(state),
        error: isAuthErrorSelector(state)
    })
)(Auth);
