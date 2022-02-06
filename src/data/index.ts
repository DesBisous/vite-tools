export enum PluginKey {
  EXIF = 'EXIF',
  WECHAT = 'wx',
  JSEncrypt = 'JSEncrypt',
}

// 插件链接
export const PluginUrl = {
  EXIF: 'https://r.hstong.com/v2/plugins/exif-js/2.3.0/exif.js',
  JSEncrypt: 'https://r.hstong.com/v2/plugins/jsencrypt/3.0.0-rc.1/jsencrypt.min.js',
  WECHAT: 'https://res2.wx.qq.com/open/js/jweixin-1.6.0.js',
};

export enum LogModule {
  WeChat = 'WeChat',
  Encrypt = 'Encrypt',
  Validate = 'Validate',
  Lang = 'Lang',
  JSBridge = 'JSBridge',
  ImgCompress = 'ImgCompress',
  Detector = 'Detector',
  Url = 'Url',
}

export const EncryptKey = {
  publicKey:
    '-----BEGIN PUBLIC KEY-----MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC1QQRl0HlrVv6kGqhgonD6A9SU6ZJpnEN+Q0blT/ue6Ndt97WRfxtSAs0QoquTreaDtfC4RRX4o+CU6BTuHLUm+eSvxZS9TzbwoYZq7ObbQAZAY+SYDgAA5PHf1wNN20dGMFFgVS/y0ZWvv1UNa2laEz0I8Vmr5ZlzIn88GkmSiQIDAQAB-----END PUBLIC KEY-----',
  privateKey:
    '-----BEGIN RSA PRIVATE KEY-----MIICXAIBAAKBgQC1QQRl0HlrVv6kGqhgonD6A9SU6ZJpnEN+Q0blT/ue6Ndt97WRfxtSAs0QoquTreaDtfC4RRX4o+CU6BTuHLUm+eSvxZS9TzbwoYZq7ObbQAZAY+SYDgAA5PHf1wNN20dGMFFgVS/y0ZWvv1UNa2laEz0I8Vmr5ZlzIn88GkmSiQIDAQABAoGBAKYDKP4AFlXkVlMEP5hS8FtuSrUhwgKNJ5xsDnFV8sc3yKlmKp1a6DETc7N66t/Wdb3JVPPSAy+7GaYJc7IsBRZgVqhrjiYiTO3ZvJv3nwAT5snCoZrDqlFzNhR8zvUiyAfGD1pExBKLZKNH826dpfoKD2fYlBVOjz6i6dTKBvCJAkEA/GtL6q1JgGhGLOUenFveqOHJKUydBAk/3jLZksQqIaVxoB+jRQNOZjeSO9er0fxgI2kh0NnfXEvH+v326WxjBwJBALfTRar040v71GJq1m8eFxADIiPDNh5JD2yb71FtYzH9J5/d8SUHI/CUFoROOhxr3DpagmrnTn28H0088vubKe8CQDKMOhOwx/tS5lqvN0YQj7I6JNKEaR0ZzRRuEmv1pIpAW1S5gTScyOJnVn1tXxcZ9xagQwlT2ArfkhiNKxjrf5kCQAwBSDN5+r4jnCMxRv/Kv0bUbY5YWVhw/QjixiZTNn81QTk3jWAVr0su4KmTUkg44xEMiCfjI0Ui3Ah3SocUAxECQAmHCjy8WPjhJN8y0MXSX05OyPTtysrdFzm1pwZNm/tWnhW7GvYQpvE/iAcNrNNb5k17fCImJLH5gbdvJJmCWRk=-----END RSA PRIVATE KEY-----',
};

export const isAndroidRegx = /Android/i;
export const isIOSRegx = /iPad|iPhone|iPod/i;
export const isMACRegx = /macintosh|mac os x/i;
export const isWINRegx = /w(i|o)(w|n)(32|64)/i;
export const isWeiBoRegx = /WeiBo/i;
export const isMobileRegx = /mobile/i;
export const isWechatRegx = /micromessenger/i;
export const isTHSHexinGphoneRegx = /Hexin_Gphone/i; // 判断同花顺;
export const isTHSIHexinRegx = /IHexin/i; // 判断同花顺;

/**
 * App类型，通过UA判断
 */
export enum appType {
  SinaFinanceAndroid = 15,
  SinaFinanceIOS = 30,
}
