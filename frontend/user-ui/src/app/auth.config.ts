import { AuthConfig } from "angular-oauth2-oidc";

export const authConfig: AuthConfig = {
    // issuer: "http://keycloak:8080/auth/realms/ptd-auth",
    issuer: "http://localhost:8080/auth/realms/ptd-auth",
    requireHttps: false,
    redirectUri: window.location.origin,
    clientId: 'angular-user-ui-client',
    strictDiscoveryDocumentValidation: true,
    responseType: 'code',
    scope: 'openid profile email offline_access',
}