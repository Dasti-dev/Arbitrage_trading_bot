const request = require('request')
const crypto = require('crypto')

const baseurl = "https://api.coindcx.com";

const key = ""
const secret = ""

export const createOrder = (side: "buy" | "sell" , market: string, price: number, quantity: number, clientOrderId) => {

    return new Promise<void>((resolve) => {
        const body = {
            side , 
            "order_type": "limit_order", 
            market, 
            "price_per_unit": price, 
            "total_quantity": quantity, 
            "timestamp": Math.floor(new Date().getTime()),
            "client_order_id": clientOrderId //Replace this with the client order id you want
        }
        
        const payload = new Buffer(JSON.stringify(body)).toString();
        const signature = crypto.createHmac('sha256', secret).update(payload).digest('hex')
        
        const options = {
            url: baseurl + "/exchange/v1/orders/create",
            headers: {
                'X-AUTH-APIKEY': key,
                'X-AUTH-SIGNATURE': signature
            },
            json: true,
            body: body
        }
        
        request.post(options, function(error, response, body) {
            if(error) {
                console.log("error while cancelling orders ",error)  
            } else {
                console.log("placed order");
                console.log(body); 
            }
            resolve();
        })

    })

}

export const cancelOrder = (market: string) => {

    return new Promise<void>((resolve) => {
        const   body = {
            "side": "buy", //Toggle between 'buy' or 'sell'. Not compulsory
            market, //Replace 'SNTBTC' with your desired market pair.
            timestamp: Math.floor(new Date().getTime()),
        }
    
        const payload = new Buffer(JSON.stringify(body)).toString();
        const signature = crypto.createHmac('sha256', secret).update(payload).digest('hex')
    
        const options = {
            url: baseurl + "/exchange/v1/orders/cancel_all",
            headers: {
                'X-AUTH-APIKEY': key,
                'X-AUTH-SIGNATURE': signature
            },
            json: true,
            body: body
        }
    
        request.post(options, function(error, response, body) {
            if(error) {
                console.log("error while cancelling orders ",error)  
            } else {
                console.log("cancelled all orders");
                console.log(body); 
            }
            resolve();
        })
    })

}