import { NativeModules, TurboModuleRegistry } from 'react-native';

interface JarvisModuleSpec {
  generateResponse(prompt: string): Promise<string>;
  initializeModel(modelPath: string): Promise<boolean>;
  startSpeechRecognition(): Promise<string>;
  stopSpeechRecognition(): void;
}

// Try both legacy and turbo module paths
const JarvisModule: JarvisModuleSpec | null =
  NativeModules.JarvisModule ||
  TurboModuleRegistry.get<JarvisModuleSpec>('JarvisModule') ||
  null;

export default JarvisModule;
