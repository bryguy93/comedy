import { HelperParams } from "../page-objects/HelperParams";
import { promises as fsPromises } from 'fs';
import { join } from 'path';

//print to log files
export async function asyncWriteFile(data: any) {
    let helperParams: HelperParams
    helperParams = new HelperParams()

    try {
      await fsPromises.writeFile(join(__dirname, helperParams.logFilePath), data, {
        flag: 'a+',
      });
  
      const contents = await fsPromises.readFile(
        join(__dirname, helperParams.logFilePath),
        'utf-8',
      );
  
      return contents;
    } catch (err) {
      console.log(err);
      return 'Something went wrong';
    }
  }