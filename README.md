
[![Follow Twitter](https://img.shields.io/twitter/follow/RhubarbLipSync.svg?style=social&label=Follow)](https://twitter.com/RhubarbLipSync)
[![Build status](https://github.com/DanielSWolf/rhubarb-lip-sync/actions/workflows/ci.yml/badge.svg)](https://github.com/DanielSWolf/rhubarb-lip-sync/actions/workflows/ci.yml)

![Logo](https://github.com/DanielSWolf/rhubarb-lip-sync/raw/master/img/logo.png)

Rhubarb Lip Sync to NodeJs allows you to quickly create 2D mouth animation from voice recordings. It analyzes your audio files, recognizes what is being said, then automatically generates lip sync information. You can use it for animating speech in computer games, animated cartoons, or any similar project.

Rhubarb Lip Sync integrates with the following applications:

- **Adobe After Effects** (see [afterEffects](#afterEffects))
- **Moho** and **OpenToonz** (see [moho](#moho))
- **Spine** by Esoteric Software (see [spine](#spine))
- **Vegas Pro** by Magix (see [vegas](#vegas))
- **Visionaire Studio** ([external link](https://www.visionaire-studio.net/forum/thread/mouth-animation-using-rhubarb-lip-sync))

In addition, you can use Rhubarb Lip Sync's command line interface (*CLI*) to generate files in various [output formats](#outputFormats) (TSV/XML/JSON).

## How to run Rhubarb Lip Sync

### General usage

Rhubarb Lip Sync to Nodejs
 
- Call `rhubarb`, passing it an audio file as argument and telling it where to create the output file. In its simplest form, this might look like this: 

```js
import { runCommands } from 'rhubarb-lip-sync';
const lipSyncJson = await runCommands(bufferAudio)     
```
 
 There are additional [options](#options) you can specify in order to get better results.
- Rhubarb Lip Sync will analyze the sound file, animate it, and create an output file containing the animation. If an error occurs, Rhubarb Lip Sync will instead print an error message to `stderr` and exit with a non-zero exit code.
 
 
## Recognizers

The first step in processing an audio file is determining what is being said. More specifically, Rhubarb Lip Sync uses speech recognition to figure out what sound is being said at what point in time. You can choose between two recognizers:

### PocketSphinx

PocketSphinx is an open-source speech recognition library that generally gives good results. This is the default recognizer. The downside is that PocketSphinx only recognizes English dialog. So if your recordings are in a language other than English, this is not a good choice.

### Phonetic

Rhubarb Lip Sync also comes with a phonetic recognizer. Phonetic means that this recognizer won't try to understand entire (English) words and phrases. Instead, it will recognize individual sounds and syllables. The results are usually less precise than those from the PocketSphinx recognizer. The advantage is that this recognizer is language-independent. Use it if your recordings are not in English.

## Output formats

The output of Rhubarb Lip Sync is a file that tells you which mouth shape to display at what time within the recording. You can choose between three file formats -- TSV, XML, and JSON. The following paragraphs show you what each of these formats looks like.

### Tab-separated values (TSV)

TSV is the simplest and most compact export format supported by Rhubarb Lip Sync. Each line starts with a timestamp (in seconds), followed by a tab, followed by the name of the mouth shape. The following is the output for a recording of a person saying 'Hi.'
 

[source]
----
0.00	X
0.05	D
0.27	C
0.31	B
0.43	X
0.47	X
----

Here's how to read it:

* At the beginning of the recording (0.00s), the mouth is closed (shape {X}). The very first output will always have the timestamp 0.00s.
* 0.05s into the recording, the mouth opens wide (shape {D}) for the "`HH`" sound, anticipating the "`AY`" sound that will follow.
* The second half of the "`AY`" diphtong (0.31s into the recording) requires clenched teeth (shape {B}). Before that, shape {C} is inserted as an in-between at 0.27s. This allows for a smoother animation from {D} to {B}.
* 0.43s into the recording, the dialog is finished and the mouth closes again (shape {X}).
* The last output line in TSV format is special: Its timestamp is always the very end of the recording (truncated to a multiple of 0.01s) and its value is always a closed mouth (shape {X} or {A}, depending on your <<extendedShapes,`extendedShapes`>> settings).
 
 
[Find out more here](https://github.com/DanielSWolf/rhubarb-lip-sync)