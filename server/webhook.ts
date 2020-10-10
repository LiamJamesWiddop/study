import API from "./api"

export default new class Webhook{
    mounted(){
        this.getBest();        
    }

    async getBest(){
        let ignore = 0;
        return await API.getBest(null,ignore);
    }
}
