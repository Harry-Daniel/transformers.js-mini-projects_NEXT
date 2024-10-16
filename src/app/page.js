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

  const [filter, setFilter] = useState("");

  const filteredComments =
    filter === ""
      ? comments
      : comments.filter((comment) => comment.label === filter);

  // console.log("filter", filter);
  // console.log("filtered Comments", filteredComments);

  const onSubmitHandler = (e) => {
    e.preventDefault();
    setSetAnalysis(!startAnalysis);
  };

  // console.log(result);
  // Analyse based on positive/ negative
  // useEffect(() => {
  //   async function initializeModel() {
  //     let sentimentAnalysis = await pipeline("sentiment-analysis");
  //     let result = await sentimentAnalysis(text);
  //     // console.log(result);
  //     let readableResult = JSON.stringify(result, null, 2);
  //     setResult(readableResult);
  //     setComment({ text: text, label: readableResult.substring(20, 28) });
  //   }
  //   setText("");
  //   initializeModel();
  // }, [startAnalysis]);

  // Analyse based off of Stars
  useEffect(() => {
    async function initializeModel() {
      let reviewAnalysis = await pipeline(
        "sentiment-analysis",
        "Xenova/bert-base-multilingual-uncased-sentiment"
      );
      let result = await reviewAnalysis(text);
      let readableResult = JSON.stringify(result, null, 2);
      // console.log(readableResult.substring(20,27));
      setResult(readableResult);
      readableResult.substring(20, 27) !== '1 star"'
        ? setComment({ text: text, label: readableResult.substring(20, 27) })
        : setComment({ text: text, label: readableResult.substring(20, 26) });
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
        <div
          onClick={() => setFilter("5 stars")}
          className="bg-blue-500 hover:bg-blue-600 cursor-pointer text-white w-[150px] text-center h-auto px-[20px] py-[10px]"
        >
          5 STARS
        </div>
        <div
          onClick={() => setFilter("4 stars")}
          className="bg-blue-500 hover:bg-blue-600 cursor-pointer text-white w-[150px] text-center h-auto px-[20px] py-[10px]"
        >
          4 STARS
        </div>
        <div
          onClick={() => setFilter("3 stars")}
          className="bg-blue-500 hover:bg-blue-600 cursor-pointer text-white w-[150px] text-center h-auto px-[20px] py-[10px]"
        >
          3 STARS
        </div>
        <div
          onClick={() => setFilter("2 stars")}
          className="bg-blue-500 hover:bg-blue-600 cursor-pointer text-white w-[150px] text-center h-auto px-[20px] py-[10px]"
        >
          2 STARS
        </div>
        <div
          onClick={() => setFilter("1 star")}
          className="bg-blue-500 hover:bg-blue-600 cursor-pointer text-white w-[150px] text-center h-auto px-[20px] py-[10px]"
        >
          1 STAR
        </div>
        <div
          onClick={() => setFilter("")}
          className="bg-blue-500 hover:bg-blue-600 cursor-pointer text-white w-[150px] text-center h-auto px-[20px] py-[10px]"
        >
          ALL
        </div>
      </div>
      {/* Output Section */}
      <div className="w-full flex flex-col gap-4">
        {filteredComments &&
          filteredComments.map((comment) => (
            <div key={comment.text} className="border-[1px] border-gray-400 px-[20px] py-[10px] w-full  flex flex-row gap-4 items-center justify-between">
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
