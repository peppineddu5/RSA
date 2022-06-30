# RSA_js
## !! Commercial use is not recommended !!
I was inspired by https://github.com/denysdovhan/rsa-labwork

## How to use?
you can generate pubblic key e d and private N
```ts
const Rsa = new RSA()
const key= Rsa.generate(1000)
/*
{
  e:string,//Pubblic
  d:string,//Pubblic
  n:string,//!Private!
}
*/
```
create a object with all code you want
```ts
const oggetto = {
        id: 18439232,
        permission: "nobody",
        time: Date.now() + 86400000// 1day
    }
```
The object will be converted into a string and it will be necessary to pay attention to the length which will be multiplied by 3 since it must not be greater than the length of the PRIVATE key N.
The `time` parameter is required and will be the duration of the key

This creates the message encrypted and unrecognizable if the private key N is not known
```ts
const cryMsg = Rsa.encrypt(oggetto, key.n, key.e)
```

Finally this is used to decrypt
```ts
const message = Rsa.decrypt(cryMsg,key.d, key.n)

    if (message?.error == "expired") {
        console.log("token scaduto")
        return
    }
    if (message?.error == "invalid msg"){
        console.log("invalid value")
        return
    }

    console.log(message)
```
