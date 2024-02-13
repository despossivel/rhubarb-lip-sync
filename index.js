import { spawnSync } from 'child_process';
import { EventEmitter } from 'events';
import fs from 'fs';
import path from 'path';
 
class CommandExecutor extends EventEmitter {
  execute(command) {
    const result = spawnSync(command, { shell: true });

    if (result.error) {
      throw new Error(result.error.message);
    }

    return result.stdout.toString();
  }
}

export async function runCommands(audioBuffer) {
  const currentDirectory = process.cwd();
  const commandExecutor = new CommandExecutor();
  const outputDirectory = `${currentDirectory}/node_modules/rhubarb-lip-sync/.tools/`;
  const tempFilePath = path.join(outputDirectory, 'output.wav');
  const outputPath = path.join(outputDirectory, 'output_file.wav');
  const outputPathJSON = path.join(outputDirectory, 'output.json');

  try {
    console.log("INCIANDO PROCESSOS....");
    console.time();

    // Write audioBuffer to a temporary file
    await fs.promises.writeFile(tempFilePath, audioBuffer);

    // FFmpeg command to convert the temporary file to WAV format
    const ffmpegCommand = `ffmpeg -i ${tempFilePath} -acodec pcm_s16le -ar 44100 -ac 2 ${outputPath}`;

    // Execute FFmpeg command
    await commandExecutor.execute(ffmpegCommand);

    // Execute Rhubarb command
    const rhubarbCommand = `${outputDirectory}rhubarb-Lip-Sync-1.13.0-Linux/rhubarb -r phonetic -f json ${outputPath} -o ${outputPathJSON}`;
 

    await commandExecutor.execute(rhubarbCommand);
 
    // Read the contents of the output JSON file
    const outputJSONContent = await fs.promises.readFile(outputPathJSON, 'utf-8');
    console.timeEnd();

    return outputJSONContent;
  } catch (error) {
    console.error('Erro ao executar o comando:', error.message);
  } finally {
    // Cleanup: Remove temporary and output files
    try {
      await fs.promises.unlink(tempFilePath);
    } catch (error) {
      console.error('Erro ao remover o arquivo temporário:', error.message);
    }
    try {
      await fs.promises.unlink(outputPath);
    } catch (error) {
      console.error('Erro ao remover o arquivo de saída:', error.message);
    }
    try {
      await fs.promises.unlink(outputPathJSON);
    } catch (error) {
      console.error('Erro ao remover o arquivo JSON de saída:', error.message);
    }
  }
}
export default CommandExecutor
