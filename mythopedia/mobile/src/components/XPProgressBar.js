import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const XPProgressBar = ({ xp, xpToNextLevel, level = 1 }) => {
  const progress = Math.min(xp / xpToNextLevel, 1);
  const animatedValue = useRef(new Animated.Value(progress)).current;

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: progress,
      duration: 800,
      useNativeDriver: false,
    }).start();
  }, [progress]);

  const widthInterpolate = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={styles.container}>
      <View style={styles.labelRow}>
        <Text style={styles.levelText}>Level {level}</Text>
        <Text style={styles.xpText}>{xp} / {xpToNextLevel} XP</Text>
      </View>
      <View style={styles.barBackground}>
        <Animated.View style={[styles.barFill, { width: widthInterpolate }]}
        >
          <LinearGradient
            colors={["#FFD700", "#FFA500", "#FF6347"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={StyleSheet.absoluteFill}
          />
        </Animated.View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
    paddingHorizontal: 8,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  levelText: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#FFA500',
  },
  xpText: {
    fontSize: 14,
    color: '#555',
  },
  barBackground: {
    height: 18,
    backgroundColor: '#eee',
    borderRadius: 9,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 9,
    overflow: 'hidden',
  },
});

export default XPProgressBar; 