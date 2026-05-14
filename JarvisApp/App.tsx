import React, {useState, useEffect} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  StatusBar,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {JarvisOrb} from './src/components/JarvisOrb';
import {JarvisService} from './src/services/JarvisService';
import {VoiceService} from './src/services/VoiceService';

const App = () => {
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [response, setResponse] = useState('Awaiting your command, sir.');
  const [history, setHistory] = useState<{role: string; text: string}[]>([]);

  useEffect(() => {
    // Initialize J.A.R.V.I.S.
    JarvisService.initialize('/sdcard/Download/phi-3-mini-4bit.tflite');
  }, []);

  const handlePress = async () => {
    if (isListening) {
      setIsListening(false);
    } else {
      setIsListening(true);
      setTranscript('Listening...');
      
      try {
        // In a real scenario, this would wait for voice end
        // For simulation, we wait 2 seconds then process a dummy command
        setTimeout(async () => {
          setIsListening(false);
          const dummyCommand = "Jarvis, turn on the flashlight.";
          await processCommand(dummyCommand);
        }, 2000);
      } catch (error) {
        console.error(error);
        setIsListening(false);
      }
    }
  };

  const processCommand = async (command: string) => {
    setIsProcessing(true);
    setTranscript(command);
    
    try {
      const result = await JarvisService.ask(command);
      setResponse(result.text);
      setHistory(prev => [...prev, {role: 'user', text: command}, {role: 'jarvis', text: result.text}]);
      
      // Speak the response
      await VoiceService.speak(result.text);
      
      if (result.action) {
        console.log('Executing action:', result.action);
        // Handle device control here
      }
    } catch (error) {
      setResponse("I'm sorry sir, I've encountered an error in my logic circuits.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.header}>
        <Text style={styles.title}>J.A.R.V.I.S.</Text>
        <Text style={styles.subtitle}>MARK I • LOCAL ENGINE</Text>
      </View>

      <View style={styles.orbContainer}>
        <JarvisOrb isListening={isListening} isProcessing={isProcessing} />
      </View>

      <View style={styles.statusContainer}>
        <Text style={styles.transcript}>{transcript || 'Say "Jarvis"...'}</Text>
        <Text style={styles.response}>{response}</Text>
      </View>

      <ScrollView 
        style={styles.historyContainer}
        contentContainerStyle={{paddingBottom: 20}}
      >
        {history.map((item, index) => (
          <View key={index} style={item.role === 'user' ? styles.userMessage : styles.jarvisMessage}>
            <Text style={styles.messageLabel}>{item.role.toUpperCase()}</Text>
            <Text style={styles.messageText}>{item.text}</Text>
          </View>
        ))}
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity 
          style={[styles.micButton, isListening && styles.micButtonActive]} 
          onPress={handlePress}
        >
          <Text style={styles.micIcon}>{isListening ? 'STOP' : 'LISTEN'}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#050a14',
  },
  header: {
    alignItems: 'center',
    paddingTop: 20,
  },
  title: {
    fontSize: 36,
    fontWeight: '100',
    color: '#00f2ff',
    letterSpacing: 8,
  },
  subtitle: {
    fontSize: 10,
    color: 'rgba(0, 242, 255, 0.5)',
    letterSpacing: 3,
    marginTop: 5,
  },
  orbContainer: {
    height: 250,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusContainer: {
    paddingHorizontal: 30,
    alignItems: 'center',
    minHeight: 100,
  },
  transcript: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 14,
    fontStyle: 'italic',
    marginBottom: 5,
  },
  response: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
    lineHeight: 24,
  },
  historyContainer: {
    flex: 1,
    paddingHorizontal: 20,
    marginTop: 10,
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: 'rgba(0, 242, 255, 0.1)',
    padding: 12,
    borderRadius: 15,
    marginBottom: 10,
    maxWidth: '85%',
    borderLeftWidth: 2,
    borderLeftColor: '#00f2ff',
  },
  jarvisMessage: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    padding: 12,
    borderRadius: 15,
    marginBottom: 10,
    maxWidth: '85%',
    borderRightWidth: 2,
    borderRightColor: 'rgba(255, 255, 255, 0.3)',
  },
  messageLabel: {
    fontSize: 8,
    color: 'rgba(255, 255, 255, 0.4)',
    marginBottom: 4,
    letterSpacing: 1,
  },
  messageText: {
    color: '#fff',
    fontSize: 14,
  },
  footer: {
    paddingBottom: 30,
    alignItems: 'center',
  },
  micButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(0, 242, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(0, 242, 255, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#00f2ff',
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 5,
  },
  micButtonActive: {
    backgroundColor: 'rgba(255, 0, 0, 0.1)',
    borderColor: '#ff0000',
    shadowColor: '#ff0000',
  },
  micIcon: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
});

export default App;
