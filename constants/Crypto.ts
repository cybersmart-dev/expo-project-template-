import * as Crypto from 'expo-crypto';
import { AESEncryptionKey } from 'expo-crypto';

const storageSecretKey = "MjU1LDE5MiwyMDUsMjMzLDM0LDMxLDIzMiwyMTgsMjQwLDc2LDE5LDIxOSwxMTUsMTc2LDE5OSwyMTU="
const storageIV = "OTYsMTk2LDE5MSwxLDE5NCwxNSwxMTgsMTEwLDgxLDI0OSwxNTMsMjEwLDIxOSw4OCwyMzEsMTM1"


export const encrypt = async (data:any, key: string) => {
    const iv = Crypto.getRandomBytes(16);
    const encryptedData = await Crypto.digestStringAsync(
        Crypto.CryptoDigestAlgorithm.SHA256,
        key + iv.toString()
    );
    return {
        data: encryptedData,
        iv: iv.toString()
    }
}