import { createRemoteJWKSet, jwtVerify } from 'jose';

export function createAuth0Adapter() {
  const domain = process.env.AUTH0_DOMAIN;
  const audience = process.env.AUTH0_AUDIENCE;
  if (!domain || !audience) return null;

  const issuer = `https://${domain}/`;
  const jwks = createRemoteJWKSet(new globalThis.URL(`${issuer}.well-known/jwks.json`));

  return {
    async verifyToken(token) {
      const { payload } = await jwtVerify(token, jwks, { issuer, audience });
      return {
        uid: payload.sub,
        email: payload.email || payload.sub,
        name: payload.name || payload.nickname || payload.email || payload.sub,
        picture: payload.picture,
      };
    },
  };
}
