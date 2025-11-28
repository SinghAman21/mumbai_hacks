import React from "react";

type SpeechRecognitionType = {
  onFinal?: (text: string) => void;
  start: () => void;
  stop: () => void;
};

export function useSpeechToText() {
  const [isListening, setIsListening] = React.useState(false);
  const recognitionRef = React.useRef<SpeechRecognitionType | null>(null);

  React.useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.error("Speech recognition not supported");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-IN";
    recognition.interimResults = false;
    recognition.continuous = false;

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      recognitionRef.current?.onFinal?.(transcript);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;

    return () => {
      recognition.stop?.();
    };
  }, []);

  const startListening = (onFinal: (text: string) => void) => {
    if (!recognitionRef.current || isListening) return;

    recognitionRef.current.onFinal = onFinal;
    setIsListening(true);
    recognitionRef.current.start();
  };

  return { isListening, startListening };
}
