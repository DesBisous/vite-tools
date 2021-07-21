import JSEncrypt from 'jsencrypt';

let cryptor: JSEncrypt | null = null;
const publicKey =
  '-----BEGIN PUBLIC KEY-----MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC1QQRl0HlrVv6kGqhgonD6A9SU6ZJpnEN+Q0blT/ue6Ndt97WRfxtSAs0QoquTreaDtfC4RRX4o+CU6BTuHLUm+eSvxZS9TzbwoYZq7ObbQAZAY+SYDgAA5PHf1wNN20dGMFFgVS/y0ZWvv1UNa2laEz0I8Vmr5ZlzIn88GkmSiQIDAQAB-----END PUBLIC KEY-----';
const privateKey =
  '-----BEGIN RSA PRIVATE KEY-----MIICXAIBAAKBgQC1QQRl0HlrVv6kGqhgonD6A9SU6ZJpnEN+Q0blT/ue6Ndt97WRfxtSAs0QoquTreaDtfC4RRX4o+CU6BTuHLUm+eSvxZS9TzbwoYZq7ObbQAZAY+SYDgAA5PHf1wNN20dGMFFgVS/y0ZWvv1UNa2laEz0I8Vmr5ZlzIn88GkmSiQIDAQABAoGBAKYDKP4AFlXkVlMEP5hS8FtuSrUhwgKNJ5xsDnFV8sc3yKlmKp1a6DETc7N66t/Wdb3JVPPSAy+7GaYJc7IsBRZgVqhrjiYiTO3ZvJv3nwAT5snCoZrDqlFzNhR8zvUiyAfGD1pExBKLZKNH826dpfoKD2fYlBVOjz6i6dTKBvCJAkEA/GtL6q1JgGhGLOUenFveqOHJKUydBAk/3jLZksQqIaVxoB+jRQNOZjeSO9er0fxgI2kh0NnfXEvH+v326WxjBwJBALfTRar040v71GJq1m8eFxADIiPDNh5JD2yb71FtYzH9J5/d8SUHI/CUFoROOhxr3DpagmrnTn28H0088vubKe8CQDKMOhOwx/tS5lqvN0YQj7I6JNKEaR0ZzRRuEmv1pIpAW1S5gTScyOJnVn1tXxcZ9xagQwlT2ArfkhiNKxjrf5kCQAwBSDN5+r4jnCMxRv/Kv0bUbY5YWVhw/QjixiZTNn81QTk3jWAVr0su4KmTUkg44xEMiCfjI0Ui3Ah3SocUAxECQAmHCjy8WPjhJN8y0MXSX05OyPTtysrdFzm1pwZNm/tWnhW7GvYQpvE/iAcNrNNb5k17fCImJLH5gbdvJJmCWRk=-----END RSA PRIVATE KEY-----';

function createCryptor() {
  if (!cryptor) {
    cryptor = new JSEncrypt({}); // 创建加密对象实例
  }
  return cryptor;
}

/**
 * 使用 JSEncrypt 加密
 * @param content - 加密内容
 * @param key - 公钥
 * @returns - 加密结果
 * @public
 */
export function encrypt(content: string, key: string = publicKey): string | false {
  if (typeof key !== 'string' || typeof content !== 'string') return content;
  const cryptor = createCryptor();
  cryptor.setPublicKey(key); //设置公钥
  return cryptor.encrypt(content); // 对内容进行加密
}

/**
 * 使用 JSEncrypt 解密
 * @param content - 解密内容
 * @param key - 私钥
 * @returns - 解密结果
 * @public
 */
export function decrypt(content: string, key: string = privateKey): string | false {
  if (typeof key !== 'string' || typeof content !== 'string') return content;
  const cryptor = createCryptor();
  cryptor.setPrivateKey(key); //设置秘钥
  return cryptor.decrypt(content); //解密之前拿公钥加密的内容
}
