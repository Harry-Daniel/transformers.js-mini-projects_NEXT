"use client";
import React, { useState, useEffect } from "react";
import { FaMicrophone, FaStop, FaFileAlt } from "react-icons/fa";
import { pipeline, env } from "@xenova/transformers";

const AudioRecorder = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState(null);
  const [recorder, setRecorder] = useState(null);
  const [transcribedText, setTranscribedText] = useState('');
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [transcriptionLoading, setTranscriptionLoading] = useState(false);
  const [summarizedText, setSummarizedText] = useState('');
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [summarizationLoading, setSummarizationLoading] = useState(false);

  // Handle MediaRecorder initialization
  useEffect(() => {
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

  // Start recording
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
      setTranscriptionLoading(true);
      let transcriber = await pipeline(
        "automatic-speech-recognition",
        "Xenova/whisper-tiny.en"
      );

      let result = await transcriber(audioURL);
      const readableResult = JSON.stringify(result, null, 2);
      setTranscriptionLoading(false);
      const resultLength = readableResult.length;
      const resultTextBegins = 13;
      const resultTextEnds = resultLength - 3;
      setTranscribedText(
        readableResult.substring(resultTextBegins, resultTextEnds)
      );
      console.log(readableResult.substring(resultTextBegins, resultTextEnds));
    }

    if (isTranscribing && audioURL) {
      transcribeEnglishLocal();
      setIsTranscribing(false);
    }
  }, [isTranscribing, audioURL]);

  // Summarization logic
  useEffect(() => {
    async function summarize() {
      if (!transcribedText) return;
      setSummarizationLoading(true);
      let summarizer = await pipeline(
        "summarization",
        "Xenova/distilbart-cnn-6-6"
      );

      let result = await summarizer(transcribedText,{ max_new_tokens: 100 });
      const readableResult = JSON.stringify(result, null, 2);
      setSummarizationLoading(false);
      const resultLength = readableResult.length;
      const resultTextBegins = 27;
      const resultTextEnds = resultLength - 7;
      setSummarizedText(
        readableResult.substring(resultTextBegins, resultTextEnds)
      );
      console.log(readableResult);
    }

    if (isSummarizing && transcribedText) {
      summarize();
      setIsSummarizing(false);
    }
  }, [isSummarizing, transcribedText]);

  const transcribeHandler = () => {
    setIsTranscribing(true);
  };
  const summarizeHandler = () => {
    setIsSummarizing(true);
  };

  return (
    <>
      <div className="w-[100vw] h-[100vh] flex flex-col justify-center items-center gap-4 ">
        {/* results */}
        <div className="flex flex-col max-w-[600px] gap-4 justify-center items-center">
          {/* Text Results */}
          <div className="flex lg:flex-row flex-col max-w-full gap-4 justify-center items-center">
            {/* Transcription */}
            {transcriptionLoading && <p>Transcription Loading...</p>}
            {transcribedText && (
              <div className="flex flex-col gap-4  max-w-[300px] shadow-md p-5 justify-center items-center">
                <span className="text-base font-bold">Transcribed Text</span>
                <p className="">{transcribedText}</p>
              </div>
            )}

            {/* Summarization */}
            {summarizationLoading && <p>Summarization Loading...</p>}
            {summarizedText && (
              <div className="flex flex-col gap-4  max-w-[300px] shadow-md p-5 justify-center items-center">
                <span className="text-base font-bold">Summarized Text</span>
                <p className="">{summarizedText}</p>
              </div>
            )}
          </div>
          {/* Audio Preview */}
          {audioURL && (
            <div>
              {/* <h2>Audio Preview:</h2> */}
              <audio src={audioURL} controls />
              <a href={audioURL} download="recording.wav">
                {/* Download .wav */}
              </a>
            </div>
          )}
        </div>

        {/* controls */}
        <div className="flex flex-row gap-4">
          {/* Transcribe button */}
          {audioURL && (
            <div
              className="flex flex-col items-center justify-center gap-2"
              onClick={transcribeHandler}
            >
              <div className="w-20 h-20 bg-green-600 flex justify-center items-center rounded-full cursor-pointer">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-12 h-12 text-white"
                  viewBox="0 0 32 32"
                >
                  <path
                    fill="currentColor"
                    d="M19.431 1.648a1.122 1.122 0 0 0-1.53.416l-.001.002l-3.972 6.88l-.48-.209a5.418 5.418 0 0 0-6.752 2.05l-.007.011l-.007.012l-.002-.001l-5.2 8.68l-.005.007v.008h-.002a3.506 3.506 0 0 0 1.279 4.78a3.442 3.442 0 0 0 2.05.464l-.058.102l-.001.001a2.796 2.796 0 0 0-.366 1.162l-.38 3.443v.008c-.063.813.848 1.326 1.511.87l.01-.006l2.752-2.082c.286-.202.535-.46.725-.754v.01a3.5 3.5 0 0 0 6.322 2.07c.127.12.262.234.405.34c1.04.768 2.399 1.09 3.783 1.09h9.24a2.24 2.24 0 0 0 2.226-1.99h.024V27.06h.002V18.2a2.815 2.815 0 0 0-1.704-2.585l-10.75-4.666l3.685-6.387l.002-.003a1.122 1.122 0 0 0-.416-1.53l-.003-.001l-2.375-1.378l-.005-.002Zm-6.508 9.037l-2.656 4.6a2.851 2.851 0 0 0-1.246 1.169l-3.208 5.552a1.521 1.521 0 0 1-1.308.757a1.448 1.448 0 0 1-.742-.2l-.004-.002A1.5 1.5 0 0 1 3.2 20.5l5.18-8.646a3.417 3.417 0 0 1 4.261-1.289h.004l.278.12Zm2.173 6.24l2.443-4.235L28.5 17.45l-.003-.004a.814.814 0 0 1 .5.753v.794h-.002v8.02h-5.81c-.255 0-.504-.02-.748-.056l-.643-.141a4.571 4.571 0 0 1-2.421-1.693c-.8-1.094-2.27-1.37-3.414-.735l-.001.001c-.69.385-1.506.84-2.148 1.2l-1.113.62l-.011.007a2.005 2.005 0 0 1-2.735-.734a2.006 2.006 0 0 1 .736-2.735l4.225-2.44a1 1 0 0 0 .663-.857a4.292 4.292 0 0 0-.479-2.526Zm-9.567 8.579l2.585 1.506a1.81 1.81 0 0 1-.427.424l-.007.005l-1.515 1.146l-1.001-.583l.208-1.884v-.011c.02-.214.073-.418.157-.603ZM19.392 7.477l-2.6-1.492l.976-1.692l2.595 1.5l-.971 1.684Z"
                  />
                </svg>
              </div>
              <p>Transcribe</p>
            </div>
          )}

          {/* Start Recording Button */}
          {!isRecording && (
            <div className="flex flex-col items-center justify-center gap-2">
              <div
                className="w-20 h-20 bg-blue-600 flex justify-center items-center rounded-full cursor-pointer"
                onClick={startRecording}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-12 h-12 text-white"
                  viewBox="0 0 24 24"
                >
                  <g
                    fill="none"
                    stroke="currentColor"
                    stroke-linejoin="round"
                    stroke-width="2"
                  >
                    <rect width="6" height="11" x="9" y="3" rx="3" />
                    <path
                      stroke-linecap="round"
                      d="M5 11a7 7 0 1 0 14 0m-7 10v-2"
                    />
                  </g>
                </svg>
              </div>
              <p>Record</p>
            </div>
          )}
          {/* Pause Button */}
          {isRecording && (
            <div className="flex flex-col items-center justify-center gap-2">
              <div
                className="w-20 h-20 bg-red-600 flex justify-center items-center rounded-full cursor-pointer "
                onClick={stopRecording}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-12 h-12 text-white"
                  viewBox="0 0 256 384"
                >
                  <path
                    fill="currentColor"
                    d="M0 341V43h85v298H0zM171 43h85v298h-85V43z"
                  />
                </svg>
              </div>
              <p>End Recording</p>
            </div>
          )}

          {/* Summarize button */}
          {transcribedText && (
            <div
              className="flex flex-col items-center justify-center gap-2"
              onClick={summarizeHandler}
            >
              <div className="w-20 h-20 bg-black flex justify-center items-center rounded-full cursor-pointer">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-12 h-12 text-white"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="currentColor"
                    d="M5 21q-.825 0-1.413-.588T3 19V5q0-.825.588-1.413T5 3h11l5 5v11q0 .825-.588 1.413T19 21H5Zm3-4q.425 0 .713-.288T9 16q0-.425-.288-.713T8 15q-.425 0-.713.288T7 16q0 .425.288.713T8 17Zm0-4q.425 0 .713-.288T9 12q0-.425-.288-.713T8 11q-.425 0-.713.288T7 12q0 .425.288.713T8 13Zm0-4q.425 0 .713-.288T9 8q0-.425-.288-.713T8 7q-.425 0-.713.288T7 8q0 .425.288.713T8 9Zm7 0h4l-4-4v4Z"
                  />
                </svg>
              </div>
              <p>Summarize</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default AudioRecorder;
