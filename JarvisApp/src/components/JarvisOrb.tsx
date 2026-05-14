import React, {useEffect} from 'react';
import {View, StyleSheet, Animated, Easing} from 'react-native';

interface Props {
  isListening: boolean;
  isProcessing: boolean;
}

export const JarvisOrb: React.FC<Props> = ({isListening, isProcessing}) => {
  const pulseAnim = new Animated.Value(1);
  const rotateAnim = new Animated.Value(0);

  useEffect(() => {
    if (isListening || isProcessing) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.2,
            duration: 1000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      ).start();

      Animated.loop(
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 3000,
          easing: Easing.linear,
          useNativeDriver: true,
        })
      ).start();
    } else {
      pulseAnim.setValue(1);
      rotateAnim.setValue(0);
    }
  }, [isListening, isProcessing]);

  const rotation = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.orb,
          {
            transform: [{scale: pulseAnim}, {rotate: rotation}],
            borderColor: isListening ? '#00f2ff' : '#ffcc00',
            shadowColor: isListening ? '#00f2ff' : '#ffcc00',
          },
        ]}>
        <View style={styles.innerCore} />
        <View style={[styles.ring, {transform: [{rotate: '45deg'}]}]} />
        <View style={[styles.ring, {transform: [{rotate: '-45deg'}]}]} />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  orb: {
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.8,
    shadowRadius: 20,
    elevation: 20,
  },
  innerCore: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
  ring: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 1,
    borderColor: 'rgba(0, 242, 255, 0.3)',
  },
});
