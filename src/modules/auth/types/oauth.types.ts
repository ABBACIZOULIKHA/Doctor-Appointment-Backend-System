// src/modules/auth/types/oauth.types.ts
export interface GoogleProfile {
    id: string;
    displayName: string;
    name: { familyName: string; givenName: string };
    emails: Array<{ value: string; verified: boolean }>;
    photos: Array<{ value: string }>;
    provider: 'google';
  }
  

  
  export type OAuthProfile = GoogleProfile ;
  
  export interface OAuthUserData {
    email: string;
    firstName: string;
    lastName: string;
    picture: string;
    provider: string;
    providerId: string;
  }