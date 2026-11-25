import { generate } from 'selfsigned';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

export interface SslCertificatePair {
  key: string;
  cert: string;
  certPath: string;
  keyPath: string;
}

export class CertificateManager {
  private certsDir: string;
  private certPath: string;
  private keyPath: string;

  constructor(userDataPath: string) {
    this.certsDir = join(userDataPath, 'certs');
    this.certPath = join(this.certsDir, 'localhost.cert.pem');
    this.keyPath = join(this.certsDir, 'localhost.key.pem');

    if (!existsSync(this.certsDir)) {
      mkdirSync(this.certsDir, { recursive: true });
    }
  }

  /**
   * Obtém o par de certificado e chave privada.
   * Se não existir em disco, gera um certificado TLS com SANs para localhost, 127.0.0.1 e ::1.
   */
  async getOrCreateCertificate(): Promise<SslCertificatePair> {
    if (existsSync(this.certPath) && existsSync(this.keyPath)) {
      try {
        const cert = readFileSync(this.certPath, 'utf8');
        const key = readFileSync(this.keyPath, 'utf8');
        if (cert && key) {
          return { cert, key, certPath: this.certPath, keyPath: this.keyPath };
        }
      } catch {
        // Se houver erro ao ler, regenera
      }
    }

    return await this.generateCertificate();
  }

  private async generateCertificate(): Promise<SslCertificatePair> {
    const attrs = [
      { name: 'commonName', value: 'localhost' },
      { name: 'organizationName', value: 'Hooksmith Local Dev' },
      { shortName: 'OU', value: 'Local Webhook Forge' },
    ];

    const notBefore = new Date();
    const notAfter = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000); // 1 ano

    const pems = await generate(attrs, {
      notBeforeDate: notBefore,
      notAfterDate: notAfter,
      keySize: 2048,
      algorithm: 'sha256',
      extensions: [
        {
          name: 'basicConstraints',
          cA: true,
        },
        {
          name: 'keyUsage',
          keyCertSign: true,
          digitalSignature: true,
          keyEncipherment: true,
        },
        {
          name: 'extKeyUsage',
          serverAuth: true,
          clientAuth: true,
        },
        {
          name: 'subjectAltName',
          altNames: [
            { type: 2, value: 'localhost' },
            { type: 7, ip: '127.0.0.1' },
            { type: 7, ip: '::1' },
          ],
        },
      ],
    });

    writeFileSync(this.certPath, pems.cert, 'utf8');
    writeFileSync(this.keyPath, pems.private, 'utf8');

    return {
      cert: pems.cert,
      key: pems.private,
      certPath: this.certPath,
      keyPath: this.keyPath,
    };
  }

  getCertsDir(): string {
    return this.certsDir;
  }
}
