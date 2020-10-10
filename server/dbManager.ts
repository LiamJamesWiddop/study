import { Connection, QueryRunner, createConnection } from "typeorm";
const fs = require("fs");

export default new class dbManager{

    connection:Connection;
    queryRunner:QueryRunner;
    // apiInstances:any[];

    async connect(id:string,entities:string[]){
        // typeorm createConnection
        console.log(entities);
        
        return await createConnection({
            type:"sqlite",
            database: `./db/${id}.db`,
            entities:entities,
            synchronize: true
        }).then(async (connection:Connection) => {
            console.log("Database connection established");
            this.connection = connection;
            await this.connection.query('PRAGMA foreign_keys=OFF');
            await this.connection.synchronize();
            await this.connection.query('PRAGMA foreign_keys=ON');
            this.createQueryRunner();
            return this.connection;
        }).catch((error:Error) => {console.log(error)});
    }

    createQueryRunner(){
        this.queryRunner = this.connection.createQueryRunner();
    }


    // getTables(){
    //     fs.readdir(this.tablesPath, async (err,files) => {
    //         for(let file of files){
    //             console.log("PATH",this.tablesPath+file);
    //             let table = await import(this.tablesPath+file)
    //             let apiInstance = new table.default();
    //             this.apiInstances[apiInstance.constructor.name] = apiInstance;
    //             console.log(this.apiInstances);
    //         }
    //     });
    // }

    async request(req:string,data:Object,cb:Function){
        // cb(function return value, error)
        // split the request of form: Table/Request
        // functions are within entities for ease of use
        // let reqSplit:string[] = req.split("/");
        // if(this.apiInstances[reqSplit[0]]){
        //     if(this.apiInstances[reqSplit[0]][reqSplit[1]]){
        //         // if the apiInstance and function exist, call it and pass through data
        //         let val  = await this.apiInstances[reqSplit[0]][reqSplit[1]](data);
        //         console.log("VAL", val);
        //     }else{
        //         let err = new Error(`No API function within ${[reqSplit[0]]} with name ${[reqSplit[1]]}`);
        //         cb(null,err);
        //     }
        // }else{
        //     let err = new Error(`No API instance with name ${[reqSplit[0]]}`);
        //     cb(null,err);
        // }
    }
}