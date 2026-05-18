import { NativeModules } from 'react-native';

interface JarvisModuleSpec {
  generateResponse(prompt: string): Promise<string>;
  initializeModel(modelPath: string): Promise<boolean>;
}

const JarvisModule: JarvisModuleSpec | null = NativeModules.JarvisModule || null;

export default JarvisModule;
