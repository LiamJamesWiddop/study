export default new class API{

    ENTITIES:any[] = [];

    async createQuestions(store,data:{
        table: string,
        entry_id: number,
        fields:string[]
    }){
        // 1. find previous questions
        let newQuestions = [];        
        let previousQuestions = await this.ENTITIES[`question`].target.find({entry_id:data.entry_id});
        
        // 2. create questions for fields where there otherwise arent any
        // One lot that asks upwards, another that asks downwards
        for(let field of data.fields){
            // if there is no question set with this field name
            let q = previousQuestions.find(q => {
                if(q.field == field) return q;
            })
            if(!q && field !== "name"){
                // create questions
                // Asking down 
                let down = await this.createEntity(`question`,{
                    table:data.table,
                    entry_id:data.entry_id,
                    field
                })
                newQuestions.push(down)

                // Asking up
                let up = await this.createEntity(`question`,{
                    table:data.table,
                    entry_id:data.entry_id,
                    field,
                    direction:false,
                })
                newQuestions.push(up)
            }else{
                newQuestions.push(q);
            }
        }

        // look through each previous question 
        // to see whether a field still exists for it
        // if not, delete it
        for(let oldQuestion of previousQuestions){
            if(!data.fields.includes(oldQuestion.field)){
                oldQuestion.remove();
            }
        }

        return newQuestions;
        // TODO: CONSIDER REMOVING QUESTIONS FOR FIELDS THAT NO LONGER EXIST
    }

    async createEntity(store,data){
        let entityFunction = this.ENTITIES[store].target;
        let entity = await entityFunction.create();
        for(let [key,value] of Object.entries(data)){
            entity[key] = value;
        }
        
        return await entity.save();
    }


    async getBest(store,id:number){   
        // WE USE "TERM" as to allow a user to be quizzed on all fields
        // based on something they have requested
        
        let entries = await this.ENTITIES[`question`].target.whereNot(id);
        
        // Now we sort by nextAttemptDelta -> ASC
        // nextAttemptDelta is an extrapolation from confidence
        // when you answer a question, it is set based on your (correct/incorrect ratio) * number of attempts
        entries = entries.sort((a,b) => this.sortByAttempt(a,b));

        // now retrieve the listings for the first two
        let questions:{
            question_id?:number,
            entry_id?:number,
            entry_table?:string,
            nextAttemptDelta?:number,
            body?:{
                question?:string,
                body?:string,
                answer?:string
            }
        }[] = []
        for(let i=0; i<1;i++){
            let question = entries[i];
            let data = await this.ENTITIES[question.table].target.findOne({id:question.entry_id});

            // asking down
            if(question.direction){
                questions.push({
                    question_id:question.id,
                    entry_id:data.id,
                    entry_table:question.table,
                    nextAttemptDelta:question.nextAttemptDelta,
                    body:{
                        question:`What is the ${question.field} of the following ${question.table}:`,
                        body:`${data.name}`,
                        answer:`${data[question.field]}`
                    }
                })
            }
            // asking up
            else{
                questions.push({
                    question_id:question.id,
                    entry_id:data.id,
                    entry_table:question.table,
                    nextAttemptDelta:question.nextAttemptDelta,
                    body:{
                        question:`What ${question.table} does the following ${question.field} pertain to?`,
                        body: `${data[question.field]}`,
                        answer:`${data.name}`
                    }
                })
            }
        }

        // Now we send back questions in groups of two -> i.e. current question & next question (for speedy demons)
        return questions;
    }

    sortByAttempt(a,b){
        let aVal = a['lastAttempt'] + a['nextAttemptDelta'];
        let bVal = b['lastAttempt'] + b['nextAttemptDelta'];
        if ( aVal < bVal ){
            return -1;
        }
        if ( aVal > bVal ){
            return 1;
        }
        return 0;
    }


    async questionAttempt(store,data:{
        question_id,
        correct:boolean,
        nextAttemptDelta?
    }){

        let attemptTime = new Date().getTime();
        // 1. create a new question attempt.
        let attempt = await this.createEntity(`attempt`,{
            time: attemptTime,
            correct:data.correct,
        })

        // 2. save attempt
        // refetch the question with attempts array (limit annoying bs bugs)
        let question = await this.ENTITIES[`question`].target.findOne({id:data.question_id})

        if(question.attempt){
            question.attempt.push(attempt);
        }else{
            question.attempt = [attempt]
        }

        if(question.nextAttemptDelta){
            if(data.correct) question.nextAttemptDelta * 2; // next attempts double for each successive correct answer
            else Math.max(question.nextAttemptDelta / 2,60000) ; // and half for each wrong answer
        }else{
            question.nextAttemptDelta = 150000; // next attempts start at 2.5 mins
        }

        let correctRatio = 0;
        for(let attempt of question.attempt){
            correctRatio += attempt.correct;
        }
        question.correctRatio = correctRatio/(question.attempt.length);
        question.lastAttempt = attemptTime;
        return await this.ENTITIES[`question`].target.save(question);
    }
}