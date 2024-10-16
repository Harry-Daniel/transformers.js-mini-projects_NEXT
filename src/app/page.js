"use client";
import { pipeline, env } from "@xenova/transformers";
import { useEffect, useState } from "react";

export default function Home() {
  const [text, setText] = useState("");
  const [result, setResult] = useState(null);
  const [comments, setComments] = useState([
    // {text:'I love this app', label:'POSITIVE'}
  ]);
  const [comment, setComment] = useState({ text: "", label: "" });
  // Random way to trigger use effect
  const [startAnalysis, setSetAnalysis] = useState(false);

  console.log("Comment", comment);

  const onSubmitHandler = (e) => {
    e.preventDefault();
    setSetAnalysis(!startAnalysis);
  };
  console.log("Comments", comments);

  // console.log(result);
  useEffect(() => {
    async function initializeModel() {
      let sentimentAnalysis = await pipeline("sentiment-analysis");
      let result = await sentimentAnalysis(text);
      // console.log(result);
      let readableResult = JSON.stringify(result, null, 2);
      setResult(readableResult);
      setComment({ text: text, label: readableResult.substring(20, 28) });
    }
    setText("");
    initializeModel();
  }, [startAnalysis]);

  useEffect(() => {
    if (comment.text !== "") {
      setComments((comments) => [...comments, comment]);
    }
  }, [comment]);

  return (
    <section className="m-28 flex flex-col items-center justify-center gap-10">
      {/* Header */}
      <h1 className="text-3xl font-semibold ">
        Comment App Based On Sentiment Analysis
      </h1>
      {/* INput Field */}
      <form className="w-full text-center">
        <div className="flex flex-row gap-4 items-center justify-center">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="border-black border-[1px] w-[500px] h-[50px] px-10 text-lg"
            placeholder="We'd love your feedback"
          />
          {text && (
            <button
              className="bg-blue-500 hover:bg-blue-600 text-white w-auto h-auto px-[20px] py-[10px]"
              onClick={onSubmitHandler}
              disabled={text ? false : true}
            >
              {" "}
              Submit{" "}
            </button>
          )}
        </div>
        {/* <p>{result}</p> */}
      </form>

      {/*Filter for comments  */}
      <div className="flex flex-row gap-4">
        <div className="bg-blue-500 hover:bg-blue-600 cursor-pointer text-white w-[150px] text-center h-auto px-[20px] py-[10px]">
          POSITIVE
        </div>
        <div className="bg-blue-500 hover:bg-blue-600 cursor-pointer text-white w-[150px] text-center h-auto px-[20px] py-[10px]">
          NEGATIVE
        </div>
        <div className="bg-blue-500 hover:bg-blue-600 cursor-pointer text-white w-[150px] text-center h-auto px-[20px] py-[10px]">
          ALL
        </div>
      </div>
      {/* Output Section */}
      <div className="w-full flex flex-col gap-4">
        {comments &&
          comments.map((comment) => (
            <div className="border-[1px] border-gray-400 px-[20px] py-[10px] w-full  flex flex-row gap-4 items-center justify-between">
              <p className="text-lg w-[70%]">{comment.text}</p>
              <span className="text-sm bg-blue-500 text-white  w-auto h-auto px-[20px] py-[10px]">
                {comment.label}
              </span>
            </div>
          ))}
      </div>
    </section>
  );
}
