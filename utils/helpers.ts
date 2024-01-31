import { HelperParams } from "../page-objects/HelperParams";
import { promises as fsPromises } from 'fs';
import { join } from 'path';
import axios from "axios";


export async function postRequest(url: string,header: any, data: string): Promise<string> {
    
  try {
    //let tempp = 'client_credentials'  
    const response = await axios.post(url, data, header )
    
    let temp =  JSON.stringify(response.data['show'])
    //temp = temp.substring(1).slice(0,-1)
    
    
    
    //let temp = response.data
    return temp
  } catch (error) {
      console.log(error)
      throw new Error('Cellar Helper Request Failed')
  }
}

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

  