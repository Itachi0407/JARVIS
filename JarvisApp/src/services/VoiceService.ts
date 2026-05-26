import JarvisModule from '../bridge/NativeJarvisModule';

export class VoiceService {
  private static isInitialized: boolean = false;

  static async init(modelPath: string) {
    this.isInitialized = true;
    console.log('J.A.R.V.I.S. SpeechRecognizer Native Bridge ready.');
  }

  static async startListening(): Promise<string> {
    if (!JarvisModule) {
      throw new Error('JarvisModule Native Bridge is not available.');
    }

    try {
      console.log('Starting native speech recognition...');
      const transcript = await JarvisModule.startSpeechRecognition();
      console.log('Transcription result:', transcript);
      return transcript;
    } catch (error) {
      console.error('Speech recognition failed:', error);
      throw error;
    }
  }

  static stopListening() {
    if (JarvisModule) {
      console.log('Stopping native speech recognition...');
      JarvisModule.stopSpeechRecognition();
    }
  }

  static async speak(text: string) {
    console.log('J.A.R.V.I.S. speaking:', text);
  }
}
