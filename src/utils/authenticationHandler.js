import {authorize, refresh} from 'react-native-app-auth';
class AuthenticationHandler {
  constructor() {

    this.spotifyAuthConfig = {
      clientId: '',
      clientSecret: '',
      redirectUrl: '',
      scopes: [
        'playlist-read-private',
        'playlist-modify-public',
        'playlist-modify-private',
        'user-library-read',
        'user-library-modify',
        'user-top-read',
        'user-read-private',
        'user-read-email'
      ],
      serviceConfiguration: {
        authorizationEndpoint: 'https://accounts.spotify.com/authorize',
        tokenEndpoint: 'https://accounts.spotify.com/api/token',
      },
    }; 
   
  }

  async onLogin() {
    try {
      const result = await authorize(this.spotifyAuthConfig);
      return result;
      
    } catch (error) {
      console.log('error'+error);
    } 
  }

  async refreshLogin(refreshToken) {
    const result = await refresh(this.spotifyAuthConfig, {
      refreshToken: refreshToken,
    });
    return result;
  }

}

const authHandler = new AuthenticationHandler();

export default authHandler;