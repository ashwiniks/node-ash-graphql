const app = require('express')();
const graphqlHttp = require('express-graphql');
const graphqlSchema = require('./graphql/schema');
const graphqlResolver = require('./graphql/resolvers');
const mongoose = require('mongoose');


app.use('/graphql',graphqlHttp(
{
    schema : graphqlSchema,
    rootValue : graphqlResolver,
    graphiql : true,
    formatError(err){
        if(!err.originalError)
            {
                return err;
            }
        const data = err.originalError.data;
        const message = err.message;
        const status = err.originalError.code;
        return {message : message,data : data,status: status}
    }
}
))



mongoose
  .connect(
    'mongodb+srv://ashwini:g9OoD8SzgbS6XS0K@cluster0-9uklp.mongodb.net/test?retryWrites=true&w=majority'
  )
  .then(result => {
    app.listen(8080);
  })
  .catch(err => console.log(err));