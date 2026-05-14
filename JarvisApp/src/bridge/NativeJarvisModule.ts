import type {TurboModule} from 'react-native';
import {TurboModuleRegistry} from 'react-native';

export interface Spec extends TurboModule {
  generateResponse(prompt: string): Promise<string>;
  initializeModel(modelPath: string): Promise<boolean>;
}

export default TurboModuleRegistry.getEnforced<Spec>('JarvisModule');
