import { useState, useEffect, useCallback } from "react";
import { useConfig } from "../provider/useConfig";

export const useTextToSpeech = () => {
  const { config } = useConfig();

  const [voice, setVoice] = useState<SpeechSynthesisVoice | null>(null);
  const [isVoiceReady, setIsVoiceReady] = useState<boolean>(false);

  const synth = window.speechSynthesis;

  useEffect(() => {
    if ("speechSynthesis" in window) {
      const loadVoices = () => {
        const availableVoices = synth.getVoices();
        const selectedVoice =
          availableVoices.find((voice) => voice.lang === "pt-BR") || null;
        setVoice(selectedVoice || availableVoices[0]);
        setIsVoiceReady(true);
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
    (text: string) => {
      if (!isVoiceReady || !synth || !voice) {
        console.error("Text-to-speech não suportado neste navegador");
        return;
      }

      synth.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.voice = voice;
      utterance.pitch = 1;
      utterance.rate = 1;

      utterance.volume = Math.min(
        1,
        Math.max(0, (config?.voiceVolume ?? 100) / 100)
      );

      synth.speak(utterance);
    },
    [isVoiceReady, synth, voice, config]
  );

  return { speak };
};
