import RSA from "./index"
init()
function init() {
    const Rsa = new RSA()

    const key=Rsa.generate(1000)//Generate all keys

    //Object to save 
    //Time is mandatory and it is the time that the token lasts
    const oggetto = {
        id: 18439232,
        permission: "nobody",
        time: Date.now() + 86400000// 1g
    }

    let startTime = Date.now()

    //crypted the message to make it immutable
    const cryMsg = Rsa.encrypt(oggetto, key.n, key.e)
    console.log(cryMsg)
    
    let endTime = Date.now()
    console.log(`Time: ${endTime - startTime} milliseconds`)

    startTime = Date.now()

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

    endTime = Date.now()
    console.log(`Time: ${endTime - startTime} milliseconds`)
    //933088695656893303437385411577631256708916967536269778755160102340669976703n
}
