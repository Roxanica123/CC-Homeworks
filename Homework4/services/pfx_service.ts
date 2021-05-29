import pem from "pem";
import fs from "fs";

export class PfxService {
    private publicCert: any;
    private privateKey: any;
    private finished: Promise<void> | undefined;
    private read: boolean = false;

    constructor() {
        try {
            const certificate = fs.readFileSync(`${process.env.WEBSITE_PRIVATE_CERTS_PATH}/${process.env.CERT_NAME}`);

            this.finished = new Promise((resolve, reject) => {
                pem.readPkcs12(certificate, (err: any, cert: any) => {
                    this.publicCert = cert.cert;
                    this.privateKey = cert.key;
                    this.read = true;
                    resolve();
                });
            });
            this.finished.then(() => {});
        }
        catch(e) {
            console.log(e);
        }
    }

    public async key(): Promise<string> {
        if (!this.read) {
            await this.finished;
        }
        return this.privateKey;
    }

    public async cert(): Promise<string> {
        if (!this.read) {
            await this.finished;
        }
        return this.publicCert;
    }

}