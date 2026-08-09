import {
    GoogleSignin,
    isErrorWithCode,
    isSuccessResponse,
    statusCodes,
} from '@react-native-google-signin/google-signin';
import { useState } from 'react';
import { Alert } from 'react-native';
import GoogleLogin from './GoogleLogin';


export default function GoogleLoginContainer() {
    const [isSigningIn, setIsSigningIn] = useState(false);

    const handleContinueWithGoogle = async () => {
        try {
            setIsSigningIn(true);

            await GoogleSignin.hasPlayServices({
                showPlayServicesUpdateDialog: true,
            });

            const response = await GoogleSignin.signIn();

            if (!isSuccessResponse(response)) {
                return; // User cancelled
            }

            const { user } = response.data;

            router.replace('/home');

        } catch (error) {
            if (isErrorWithCode(error)) {
                if (error.code === statusCodes.IN_PROGRESS) {
                    return;
                }

                if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
                    Alert.alert('Google Play Services are unavailable');
                    return;
                }
            }

            console.error(error);
            Alert.alert('Sign-in failed', 'Unable to sign in with Google.');
        } finally {
            setIsSigningIn(false);
        }
    }

    return <GoogleLogin
        disabled={isSigningIn}
        onContinueWithGoogle={handleContinueWithGoogle}
    />;
}