const axios = require('axios')

async function post(body){
    let res = await  axios.post('http://localhost:3000/',body)
    console.log(res.data)
}

async function put(body){
    let res  = await axios.put('http://localhost:3000/product/60d45b5e59da1a92572d01ff',body)
    console.log(res.data)
}

async function deleteById(){
    let res = await axios.delete("http://localhost:3000/product/60d67e25f3ee8b366b033b65")
    console.log(res.data)
}

async function get(){
    let res = await axios.get("http://localhost:3000/cari?query=rempelo")
    console.log(res.data.data[0]['1ons'])
}

// get()

// put({
//     Name:"Rempelo",
//     '1ons':"2.600"
// })
// post({
//     "1ons":"5.000",
//     Name:"test"
// })

// deleteById()