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
          availableVoices.find(
            (voice) => voice.lang === "pt-BR" || voice.lang.startsWith("pt-")
          ) || null;

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
  }, [synth]);

  const speak = useCallback(
    (text: string, attempt = 1) => {
      if (!isVoiceReady || !synth || !voice) {
        if (attempt <= 3) {
          setTimeout(() => speak(text, attempt + 1), 500);
        } else {
          console.error(
            "Falha após 3 tentativas, navegador não suporta o leitor de voz."
          );
        }
        return;
      }

      try {
        synth.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.voice = voice;
        utterance.rate = 1;
        utterance.pitch = 1;
        utterance.volume = Math.min(1, (config?.voiceVolume ?? 100) / 100);

        synth.speak(utterance);
      } catch (error) {
        console.error("Erro ao falar:", error);
      }
    },
    [isVoiceReady, synth, voice, config]
  );

  return { speak };
};
