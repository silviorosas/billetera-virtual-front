export class JwtToken {

    
    responseCode:string;
    responseMessage:string;
    
    constructor(responseCode:string,responseMessage:string) {
        this.responseCode = responseCode;
        this.responseMessage=responseMessage;
    }
}
