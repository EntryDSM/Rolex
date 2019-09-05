import nodeSchedule from 'node-schedule';
import App from './app'
import { connectServices } from './utils/connectService';
import StudentController from './students/students.controller';

async function listening (): Promise<void> {
  await connectServices();
  const startMinute = new Date().getMinutes();
  const rule = new nodeSchedule.RecurrenceRule();
  rule.minute = startMinute - 1;
  const batchJob = nodeSchedule.scheduleJob(rule, async () => {
    await connectServices();
  })

  const app = new App(
    [
      new StudentController()
    ]
  );

  app.listen();
}

listening();
