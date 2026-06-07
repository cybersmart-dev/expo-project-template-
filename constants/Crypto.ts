import * as Crypto from 'expo-crypto';
import { AESEncryptionKey, aesEncryptAsync, aesDecryptAsync } from 'expo-crypto';
import { parse } from "phoneng"
import * as Haptics from "expo-haptics"


const storageIV = "OTYsMTk2LDE5MSwxLDE5NCwxNSwxMTgsMTEwLDgxLDI0OSwxNTMsMjEwLDIxOSw4OCwyMzEsMTM1"


export const encrypt = async (plaintext: any, key: string) => {

    const plainBase64 = btoa(plaintext)

    const secretKey = await AESEncryptionKey.generate()

    const enc = await aesEncryptAsync(plainBase64, secretKey)

    const dec = await aesDecryptAsync(enc, secretKey)
    

}

encrypt("Hello","")