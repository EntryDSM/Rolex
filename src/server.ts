import dotenv from 'dotenv';
import app from './app'

dotenv.config();

app().then(server => 
  server.listen(3000, () => {
    console.log(`server is listening on 3000 port`);
  })  
)