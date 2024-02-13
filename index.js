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
  const currentDirectory = process.cwd(),
    commandExecutor = new CommandExecutor(),
    outputDirectory = `${currentDirectory}/.tools/`,
    tempFilePath = path.join(outputDirectory, 'output.wav'),
    outputPath = path.join(outputDirectory, 'output_file.wav'),
    outputPathJSON = path.join(outputDirectory, 'output.json');

  try {
    await fs.promises.writeFile(tempFilePath, audioBuffer);

    const ffmpegCommand = `ffmpeg -i ${tempFilePath} -acodec pcm_s16le -ar 44100 -ac 2 ${outputPath}`;

    await commandExecutor.execute(ffmpegCommand);

    const rhubarbCommand = `${currentDirectory}/.tools/rhubarb/rhubarb -r phonetic -f json ${outputPath} -o ${outputPathJSON}`;
    await commandExecutor.execute(rhubarbCommand);

    const outputJSONContent = await fs.promises.readFile(outputPathJSON, 'utf-8');
 
    return outputJSONContent;
  } catch (error) {
    console.error('Erro ao executar o comando:', error.message);
  } finally {
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

