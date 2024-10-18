"use client";
import { pipeline, env } from "@xenova/transformers";
import React, { useState, useEffect } from "react";

const AudioRecorder = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState(null);
  const [recorder, setRecorder] = useState(null);
  const [transcribedText, setTranscribedText] = useState(null);
  const [isTranscribing, setIsTranscribing] = useState(false);
  
  // Handle MediaRecorder initialization
  useEffect(() => {
    // Only initialize the MediaRecorder when it hasn't been created
    if (!recorder) {
      navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
        const newRecorder = new MediaRecorder(stream);
        newRecorder.ondataavailable = (e) => {
          const audioBlob = new Blob([e.data], { type: "audio/wav" });
          const audioUrl = URL.createObjectURL(audioBlob);
          setAudioURL(audioUrl);
        };
        setRecorder(newRecorder);
      });
    }
  }, [recorder]);

  // Start recording when the recorder is ready
  const startRecording = () => {
    if (recorder) {
      setIsRecording(true);
      recorder.start();
    }
  };

  // Stop recording
  const stopRecording = () => {
    if (recorder) {
      setIsRecording(false);
      recorder.stop();
    }
  };

  // Transcription logic
  useEffect(() => {
    async function transcribeEnglishLocal() {
      if (!audioURL) return;
      
      let transcriber = await pipeline(
        "automatic-speech-recognition",
        "Xenova/whisper-tiny.en"
      );

      // Transcribe the audio URL
      let result = await transcriber(audioURL);
      const readableResult = JSON.stringify(result, null, 2);
      setTranscribedText(readableResult);
      console.log(readableResult);
    }

    if (isTranscribing && audioURL) {
      transcribeEnglishLocal();
    }
  }, [isTranscribing, audioURL]);

  const transcribeHandler = () => {
    setIsTranscribing(!isTranscribing);
  };

  return (
    <div>
      <h1>Audio Recorder</h1>
      <button onClick={isRecording ? stopRecording : startRecording}>
        {isRecording ? "Stop Recording" : "Start Recording"}
      </button>
      {audioURL && (
        <div>
          <h2>Audio Preview:</h2>
          <audio src={audioURL} controls />
          <a href={audioURL} download="recording.wav">
            Download .wav
          </a>
        </div>
      )}
      <button onClick={transcribeHandler}>Transcribe</button>
      {transcribedText && (
        <div>
          <h3>Transcription:</h3>
          <pre>{transcribedText}</pre>
        </div>
      )}
    </div>
  );
};

export default AudioRecorder;
