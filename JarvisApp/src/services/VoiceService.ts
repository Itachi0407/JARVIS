import { initWhisper, WhisperContext } from 'react-native-whisper';

export class VoiceService {
  private static isInitialized: boolean = false;
  private static whisperContext: WhisperContext | null = null;
  private static stopTranscript: (() => void) | null = null;

  static async init(modelPath: string) {
    try {
      console.log('Initializing Whisper with model:', modelPath);
      // We use the absolute internal path we set up
      this.whisperContext = await initWhisper({ filePath: modelPath });
      this.isInitialized = true;
      console.log('J.A.R.V.I.S. Whisper STT ready.');
    } catch (error) {
      console.error('Failed to initialize Whisper:', error);
      this.isInitialized = false;
    }
  }

  static async startListening(): Promise<string> {
    if (!this.whisperContext) {
      throw new Error('Whisper STT is not initialized.');
    }

    try {
      console.log('Starting Whisper transcription...');
      const { stop, promise } = await this.whisperContext.transcribeRealtime({
        language: 'en',
        maxTokenCount: 512,
      });

      this.stopTranscript = stop;
      const result = await promise;
      console.log('Whisper result:', result.result);
      return result.result;
    } catch (error) {
      console.error('Whisper transcription failed:', error);
      throw error;
    }
  }

  static stopListening() {
    if (this.stopTranscript) {
      console.log('Stopping Whisper transcription...');
      this.stopTranscript();
      this.stopTranscript = null;
    }
  }

  static async speak(text: string) {
    console.log('J.A.R.V.I.S. speaking:', text);
  }
}
