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
      this.whisperContext = await initWhisper(modelPath);
      console.log('Whisper initialized');
    } catch (error) {
      console.error('STT Initialization failed:', error);
    }
  }

  static async startListening(): Promise<string> {
    if (!this.whisperContext) throw new Error('STT not initialized');
    
    const options = {
      realtime: true,
      language: 'en',
    };
    
    const { stop, promise } = this.whisperContext.transcribe(options);
    
    // In a real app, we'd handle the stop signal. 
    // For this boilerplate, we return the transcription promise.
    const result = await promise;
    return result.text;
  }

  static async speak(text: string) {
    console.log('J.A.R.V.I.S. speaking:', text);
    // Here we would run the ONNX model for Piper TTS
    // For now, we'll log it. Full native implementation requires specific model files.
  }
}
