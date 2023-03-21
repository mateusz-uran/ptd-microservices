import { AuthConfig } from "angular-oauth2-oidc";

export const authConfig: AuthConfig = {
    //**keycloak hostname only for docker environment */
    issuer: "http://keycloak:8080/auth/realms/ptd-auth",
    requireHttps: false,
    redirectUri: window.location.origin,
    clientId: 'angular-user-ui-client',
    responseType: 'code',
    scope: 'openid profile email offline_access',
    showDebugInformation: true,
    clearHashAfterLogin: true,
}