import { useCallback, useEffect, useRef, useState } from 'react';

const useGameAudio = () => {
  const audioContextRef = useRef(null);
  const masterVolumeRef = useRef(0.3);
  const musicVolumeRef = useRef(0.2);
  const isMutedRef = useRef(false);
  const backgroundMusicRef = useRef(null);
  const audioBufferRef = useRef(null);
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);
  const [musicLoaded, setMusicLoaded] = useState(false);
  const [audioInitialized, setAudioInitialized] = useState(false);

  // Initialize audio context properly with user gesture
  const initAudio = useCallback(async () => {
    if (audioContextRef.current) return;

    try {
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();

      // Resume if suspended
      if (audioContextRef.current.state === 'suspended') {
        await audioContextRef.current.resume();
      }

      setAudioInitialized(true);
      console.log('Audio context initialized:', audioContextRef.current.state);
    } catch (error) {
      console.warn('Web Audio API not supported:', error);
    }
  }, []);

  // Load background music file
  const loadBackgroundMusic = useCallback(async () => {
    if (!audioContextRef.current || !audioInitialized) {
      console.log('Audio context not ready for loading music');
      return;
    }

    try {
      console.log('Loading background music...');
      // https://opengameart.org/content/hungry-dino-9-chiptune-tracks-10-sfx
      const response = await fetch('/MainTheme.wav');
      if (!response.ok) {
        throw new Error(`Failed to load audio: ${response.status}`);
      }

      const arrayBuffer = await response.arrayBuffer();
      const audioBuffer = await audioContextRef.current.decodeAudioData(arrayBuffer);

      audioBufferRef.current = audioBuffer;
      setMusicLoaded(true);
      console.log('Background music loaded successfully', {
        duration: audioBuffer.duration,
        sampleRate: audioBuffer.sampleRate,
        channels: audioBuffer.numberOfChannels
      });
    } catch (error) {
      console.error('Failed to load background music:', error);
      setMusicLoaded(false);
    }
  }, [audioInitialized]);

  useEffect(() => {
    // Set up user interaction listeners
    const handleUserInteraction = async () => {
      await initAudio();
      // Remove listeners after first interaction
      document.removeEventListener('click', handleUserInteraction);
      document.removeEventListener('touchstart', handleUserInteraction);
      document.removeEventListener('keydown', handleUserInteraction);
    };

    document.addEventListener('click', handleUserInteraction);
    document.addEventListener('touchstart', handleUserInteraction);
    document.addEventListener('keydown', handleUserInteraction);

    return () => {
      document.removeEventListener('click', handleUserInteraction);
      document.removeEventListener('touchstart', handleUserInteraction);
      document.removeEventListener('keydown', handleUserInteraction);
    };
  }, [initAudio]);

  // Load music when audio is initialized
  useEffect(() => {
    if (audioInitialized) {
      loadBackgroundMusic();
    }
  }, [audioInitialized, loadBackgroundMusic]);

  // Create tone with stereo panning
  const createTone = useCallback((frequency, duration, pan = 0, volume = 1) => {
    if (!audioContextRef.current || isMutedRef.current || audioContextRef.current.state !== 'running') return;

    const ctx = audioContextRef.current;
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    const pannerNode = ctx.createStereoPanner();

    oscillator.type = 'square';
    oscillator.frequency.setValueAtTime(frequency, ctx.currentTime);

    const finalVolume = masterVolumeRef.current * volume;
    gainNode.gain.setValueAtTime(finalVolume, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

    pannerNode.pan.setValueAtTime(pan, ctx.currentTime);

    oscillator.connect(gainNode);
    gainNode.connect(pannerNode);
    pannerNode.connect(ctx.destination);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + duration);

    return oscillator;
  }, []);

  // Create background music from audio file
  const createBackgroundMusic = useCallback(async () => {
    if (!audioContextRef.current || !audioBufferRef.current) {
      console.log('Cannot create background music: missing audio context or buffer');
      return null;
    }

    // Ensure audio context is running
    if (audioContextRef.current.state === 'suspended') {
      try {
        await audioContextRef.current.resume();
        console.log('Audio context resumed');
      } catch (error) {
        console.error('Failed to resume audio context:', error);
        return null;
      }
    }

    const ctx = audioContextRef.current;
    const source = ctx.createBufferSource();
    source.buffer = audioBufferRef.current;
    source.loop = true;

    const gainNode = ctx.createGain();
    const musicVolume = isMutedRef.current ? 0 : (musicVolumeRef.current * masterVolumeRef.current);
    gainNode.gain.setValueAtTime(musicVolume, ctx.currentTime);

    const pannerNode = ctx.createStereoPanner();
    pannerNode.pan.setValueAtTime(0, ctx.currentTime);

    source.connect(gainNode);
    gainNode.connect(pannerNode);
    pannerNode.connect(ctx.destination);

    source.start(ctx.currentTime);
    console.log('Background music started');

    return { source, gainNode, pannerNode };
  }, []);

  // Background music control
  const startBackgroundMusic = useCallback(async () => {
    if (backgroundMusicRef.current) {
      console.log('Background music already playing');
      return;
    }

    if (!audioInitialized || !musicLoaded || !audioBufferRef.current) {
      console.log('Cannot start background music:', {
        audioInitialized,
        musicLoaded,
        audioBuffer: !!audioBufferRef.current
      });
      return;
    }

    const music = await createBackgroundMusic();
    if (!music) return;

    backgroundMusicRef.current = music;
    setIsPlayingMusic(true);

    music.source.onended = () => {
      if (backgroundMusicRef.current === music) {
        backgroundMusicRef.current = null;
        setIsPlayingMusic(false);
        console.log('Background music ended');
      }
    };
  }, [createBackgroundMusic, audioInitialized, musicLoaded]);

  const stopBackgroundMusic = useCallback(() => {
    if (backgroundMusicRef.current) {
      try {
        backgroundMusicRef.current.source.stop();
        console.log('Background music stopped');
      } catch (error) {
        console.warn('Error stopping background music:', error);
      }
      backgroundMusicRef.current = null;
      setIsPlayingMusic(false);
    }
  }, []);

  const toggleBackgroundMusic = useCallback(() => {
    if (isPlayingMusic) {
      stopBackgroundMusic();
    } else {
      startBackgroundMusic();
    }
  }, [isPlayingMusic, startBackgroundMusic, stopBackgroundMusic]);

  // Update music volume in real-time
  const updateMusicVolume = useCallback(() => {
    if (backgroundMusicRef.current && backgroundMusicRef.current.gainNode) {
      const musicVolume = isMutedRef.current ? 0 : (musicVolumeRef.current * masterVolumeRef.current);
      backgroundMusicRef.current.gainNode.gain.setValueAtTime(
        musicVolume,
        audioContextRef.current.currentTime
      );
    }
  }, []);

  // Sound effects
  const playMoveSound = useCallback(() => {
    createTone(150, 0.1, Math.random() * 0.4 - 0.2, 0.3);
  }, [createTone]);

  const playEatSound = useCallback(() => {
    createTone(400, 0.1, -0.5, 0.6);
    setTimeout(() => createTone(600, 0.1, 0.5, 0.6), 50);
    setTimeout(() => createTone(800, 0.15, 0, 0.4), 100);
  }, [createTone]);

  const playGameOverSound = useCallback(() => {
    createTone(400, 0.3, -0.8, 0.8);
    setTimeout(() => createTone(350, 0.3, -0.4, 0.7), 100);
    setTimeout(() => createTone(300, 0.3, 0, 0.6), 200);
    setTimeout(() => createTone(250, 0.3, 0.4, 0.5), 300);
    setTimeout(() => createTone(200, 0.5, 0.8, 0.4), 400);
  }, [createTone]);

  const playPauseSound = useCallback(() => {
    createTone(300, 0.2, 0, 0.5);
    setTimeout(() => createTone(200, 0.2, 0, 0.3), 100);
  }, [createTone]);

  const playStartSound = useCallback(() => {
    createTone(200, 0.15, -0.3, 0.6);
    setTimeout(() => createTone(300, 0.15, 0.3, 0.6), 100);
    setTimeout(() => createTone(400, 0.2, 0, 0.8), 200);
  }, [createTone]);

  const playHighScoreSound = useCallback(() => {
    const notes = [261, 329, 392, 523];
    const pans = [-0.6, -0.2, 0.2, 0.6];

    notes.forEach((freq, index) => {
      setTimeout(() => {
        createTone(freq, 0.3, pans[index], 0.7);
      }, index * 150);
    });
  }, [createTone]);

  // Volume controls
  const setMasterVolume = useCallback((volume) => {
    masterVolumeRef.current = Math.max(0, Math.min(1, volume));
    updateMusicVolume();
  }, [updateMusicVolume]);

  const setMusicVolume = useCallback((volume) => {
    musicVolumeRef.current = Math.max(0, Math.min(1, volume));
    updateMusicVolume();
  }, [updateMusicVolume]);

  const toggleMute = useCallback(() => {
    isMutedRef.current = !isMutedRef.current;
    updateMusicVolume();
    console.log('Audio muted:', isMutedRef.current);
    return isMutedRef.current;
  }, [updateMusicVolume]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopBackgroundMusic();
    };
  }, [stopBackgroundMusic]);

  return {
    // Sound effects
    playMoveSound,
    playEatSound,
    playGameOverSound,
    playPauseSound,
    playStartSound,
    playHighScoreSound,

    // Background music
    startBackgroundMusic,
    stopBackgroundMusic,
    toggleBackgroundMusic,
    isPlayingMusic,
    musicLoaded,
    audioInitialized,

    // Volume controls
    setMasterVolume,
    setMusicVolume,
    toggleMute,
    isMuted: isMutedRef.current,
    masterVolume: masterVolumeRef.current,
    musicVolume: musicVolumeRef.current
  };
};

export default useGameAudio;