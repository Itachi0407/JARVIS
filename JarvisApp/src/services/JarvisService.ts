import JarvisModule from '../bridge/NativeJarvisModule';
import { MemoryService } from './MemoryService';

const SYSTEM_PROMPT = `
You are J.A.R.V.I.S., a highly sophisticated AI assistant.
Your responses should be polite, efficient, and slightly formal (British English).
You have the ability to control device functions.
If the user asks for a device action, append a JSON payload at the end of your response in the format:
[ACTION: {"type": "DEVICE_CONTROL", "target": "FLASHLIGHT", "state": "ON"}]

Available actions:
- FLASHLIGHT: ON/OFF
- VOLUME: 0-100
- CALENDAR: ADD_EVENT

Always stay in character.
`;

export class JarvisService {
  private static isInitialized = false;

  static async initialize(modelPath: string) {
    if (this.isInitialized) return;
    try {
      // For testing, we check if JarvisModule is available
      if (JarvisModule) {
        await JarvisModule.initializeModel(modelPath);
      }
      await MemoryService.init();
      this.isInitialized = true;
    } catch (error) {
      console.error('Failed to initialize J.A.R.V.I.S. engine:', error);
      // We don't throw here to allow UI testing even if native module is missing
    }
  }

  static async ask(prompt: string): Promise<{text: string; action?: any}> {
    const history = await MemoryService.getRecentContext(5);
    const contextString = history.map((m: any) => `${m.role === 'user' ? 'User' : 'J.A.R.V.I.S.'}: ${m.content}`).join('\n');
    
    const fullPrompt = `${SYSTEM_PROMPT}\n${contextString}\nUser: ${prompt}\nJ.A.R.V.I.S.:`;
    
    let response = "I am operating in simulation mode, sir.";
    if (JarvisModule) {
      response = await JarvisModule.generateResponse(fullPrompt);
    }
    
    await MemoryService.logMessage('user', prompt);
    const parsed = this.parseResponse(response);
    await MemoryService.logMessage('jarvis', parsed.text);
    
    return parsed;
  }

  private static parseResponse(response: string) {
    const actionRegex = /\[ACTION:\s*({.*?})\]/;
    const match = response.match(actionRegex);
    
    let text = response.replace(actionRegex, '').trim();
    let action = null;

    if (match) {
      try {
        action = JSON.parse(match[1]);
      } catch (e) {
        console.error('Failed to parse action JSON:', e);
      }
    }

    return {text, action};
  }
}
