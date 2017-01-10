const Speaker = require('speaker');

const channels = 2;
const bitDepth = 16;
const sampleRate = 44100;

const duration = 1;

const speaker = new Speaker({
  channels,
  bitDepth,
  sampleRate,
});

const sampleSize = bitDepth / 8;
const length = sampleRate * duration * channels;
const pcmData = Buffer.alloc(length * sampleSize);

const getSample = t => Math.sin(t * 440 * 2 * Math.PI);

for (let sample = 0; sample < sampleRate * duration; sample += 1) {
  const t = (sample % sampleRate) / sampleRate;
  for (let channel = 0; channel < channels; channel += 1) {
    const amplitude = Math.round(
      getSample(t, channel) * ((2 ** (bitDepth - 1)) - 8)
    );
    pcmData[`writeInt${bitDepth}LE`](
      amplitude,
      (((sample * channels) + channel) * sampleSize)
    );
  }
}

speaker.write(pcmData);
