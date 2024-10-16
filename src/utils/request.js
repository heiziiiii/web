import axios from "axios"
import { error } from "console";
import querystring from "querystring"

//upVideo()

const instance = axios.create({
    baseURL:'/api',
    timeout:5000
})


export async function upVideo(){

    const res = await axios({
        url:"http://183.252.181.232:7658/api/resource/upload",
        method:"POST"
    })
}





export default {

};