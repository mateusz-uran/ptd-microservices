import { AuthConfig } from "angular-oauth2-oidc";

export const authConfig: AuthConfig = {
    issuer: "http://localhost:8181/auth/realms/ptd-auth",
    redirectUri: window.location.origin,
    clientId: 'angular-user-ui-client',
    responseType: 'code',
    scope: 'openid profile email offline_access message_read message_write',
}