import nodeSchedule from 'node-schedule';
import app from './app'
import { port } from './config';
import { connectServices } from './utils/connectService';

async function listening (): Promise<void> {
  await connectServices();
  const startMinute = new Date().getMinutes();
  const rule = new nodeSchedule.RecurrenceRule();
  rule.minute = startMinute - 1;
  const batchJob = nodeSchedule.scheduleJob(rule, async () => {
    await connectServices();
  })

  app().listen(port, () => {
    console.log(`server is listening on ${port} port`);
  })
}

listening();
