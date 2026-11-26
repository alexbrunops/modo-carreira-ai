const crypto = require('crypto');

// ============================================
// Senhas: scrypt (nativo do Node, sem dependências extras)
// Formato salvo: scrypt$<salt hex>$<hash hex>
// ============================================
const KEY_LENGTH = 64;

function hashPassword(password) {
    const salt = crypto.randomBytes(16).toString('hex');
    const hash = crypto.scryptSync(password, salt, KEY_LENGTH).toString('hex');
    return `scrypt$${salt}$${hash}`;
}

function isHashed(stored) {
    return typeof stored === 'string' && stored.startsWith('scrypt$');
}

function verifyPassword(password, stored) {
    if (!password || !stored) return false;

    if (!isHashed(stored)) {
        // Conta antiga, criada antes do hash: compara em texto puro.
        // A rota de login re-salva a senha com hash quando isso acontece.
        return safeEqual(Buffer.from(password), Buffer.from(stored));
    }

    const [, salt, hash] = stored.split('$');
    const expected = Buffer.from(hash, 'hex');
    const actual = crypto.scryptSync(password, salt, expected.length);
    return safeEqual(actual, expected);
}

function safeEqual(a, b) {
    return a.length === b.length && crypto.timingSafeEqual(a, b);
}

// ============================================
// Token: <payload base64url>.<assinatura HMAC-SHA256>
// ============================================
const TOKEN_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 dias

let secret = process.env.AUTH_SECRET;
if (!secret) {
    secret = crypto.randomBytes(32).toString('hex');
    console.warn('⚠️  AUTH_SECRET não definido no .env: usando um segredo temporário (os logins expiram quando o servidor reinicia).');
}

function sign(data) {
    return crypto.createHmac('sha256', secret).update(data).digest('base64url');
}

function createToken(accountId) {
    const payload = Buffer.from(JSON.stringify({
        sub: accountId,
        exp: Date.now() + TOKEN_TTL_MS
    })).toString('base64url');
    return `${payload}.${sign(payload)}`;
}

function verifyToken(token) {
    if (typeof token !== 'string') return null;
    const [payload, signature] = token.split('.');
    if (!payload || !signature) return null;
    if (!safeEqual(Buffer.from(signature), Buffer.from(sign(payload)))) return null;

    try {
        const data = JSON.parse(Buffer.from(payload, 'base64url').toString());
        if (!data.sub || !data.exp || data.exp < Date.now()) return null;
        return data;
    } catch {
        return null;
    }
}

// Middleware: preenche req.user quando há um token válido no header Authorization.
// Não bloqueia a requisição; cada rota decide se exige login.
function authenticate(req, res, next) {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : null;
    const data = verifyToken(token);
    if (data) {
        req.user = { id: data.sub };
    }
    next();
}

module.exports = {
    hashPassword,
    isHashed,
    verifyPassword,
    createToken,
    verifyToken,
    authenticate
};
