import { useState, useEffect, useCallback } from "react";

interface SpeechOptions {
  pitch?: number;
  rate?: number;
  volume?: number;
}

export const useTextToSpeech = () => {
  const [voice, setVoice] = useState<SpeechSynthesisVoice | null>(null);

  const synth = window.speechSynthesis;

  useEffect(() => {
    if ("speechSynthesis" in window) {
      const loadVoices = () => {
        const availableVoices = synth.getVoices();
        const selectedVoice =
          availableVoices.find((voice) => voice.lang === "pt-BR") || null;
        setVoice(selectedVoice || availableVoices[0]);
      };

      if (synth.getVoices().length > 0) {
        loadVoices();
      } else {
        synth.addEventListener("voiceschanged", loadVoices);
      }

      return () => {
        synth.removeEventListener("voiceschanged", loadVoices);
      };
    }
  }, [synth, voice]);

  const speak = useCallback(
    (text: string, options: SpeechOptions = {}) => {
      // console ta acusando erro aqui
      if (!synth || !voice) {
        console.error("Text-to-speech não suportado neste navegador");
        return;
      }

      synth.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.voice = voice;
      utterance.pitch = options.pitch || 1;
      utterance.rate = options.rate || 1;
      utterance.volume = options.volume || 1;

      synth.speak(utterance);
    },
    [synth, voice]
  );

  return { speak };
};
