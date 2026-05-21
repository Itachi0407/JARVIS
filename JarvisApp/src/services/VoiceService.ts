// Lazy-load whisper to prevent crash if native module isn't available
let initWhisper: any = null;
try {
  initWhisper = require('react-native-whisper').initWhisper;
} catch (e) {
  console.warn('react-native-whisper not available, STT disabled');
}

export class VoiceService {
  private static whisperContext: any = null;

  static async init(modelPath: string) {
    if (this.whisperContext) return;
    if (!initWhisper) {
      console.warn('Whisper not available');
      return;
    }
    try {
      this.whisperContext = await initWhisper({
        filePath: modelPath,
      });
      console.log('Whisper initialized');
    } catch (error) {
      console.error('STT Initialization failed:', error);
    }
  }

  private static currentStop: (() => void) | null = null;

  static async startListening(): Promise<string> {
    if (!this.whisperContext) throw new Error('STT not initialized');
    
    const options = {
      realtime: false, // Changed to false for simpler one-shot transcription
      language: 'en',
    };
    
    const { stop, promise } = this.whisperContext.transcribe(options);
    this.currentStop = stop;

    try {
      const result = await promise;
      return result.text;
    } finally {
      this.currentStop = null;
    }
  }

  static stopListening() {
    if (this.currentStop) {
      this.currentStop();
      this.currentStop = null;
    }
  }

  static async speak(text: string) {
    console.log('J.A.R.V.I.S. speaking:', text);
    // Here we would run the ONNX model for Piper TTS
    // For now, we'll log it. Full native implementation requires specific model files.
  }
}
