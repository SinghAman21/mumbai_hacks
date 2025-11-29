import React from "react";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";

export function useWhisperGeminiSpeechToText() {
  const { transcript, listening, resetTranscript, browserSupportsSpeechRecognition } = useSpeechRecognition({
    language: "en-IN",
  });

  React.useEffect(() => {
    if (!browserSupportsSpeechRecognition) {
      console.error("Speech recognition not supported");
    }
  }, [browserSupportsSpeechRecognition]);

  const startListening = () => {
    SpeechRecognition.startListening({ continuous: false, language: "en-IN" });
  };

  const stopListening = () => {
    SpeechRecognition.stopListening();
  };

  return { transcript, listening, startListening, stopListening, resetTranscript };
}
