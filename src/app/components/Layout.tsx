"use client";
import { useState } from "react";
import { IoTrashBin } from "react-icons/io5";
import verbs from "../data/verbs.json";

export default function WordChecker() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState(false);
  const [myVerb, setMyVerb] = useState(false);
  const [myWords, setMyWords] = useState<string[]>([]); // เก็บคำทั้งหมดที่พิมพ์

  const checkDuplicate = (words: string[]) => {
    const wordSet = new Set(words);
    if (wordSet.size !== words.length) {
      setResult(true);
    } else {
      setResult(false);
    }
  };

  const checkIsVerb = (words: string[]) => {
    const isVerb = words.some((w) => verbs.includes(w));
    console.log(isVerb)
    if (words[0].includes("การ")){
      setMyVerb(!isVerb)
    }
    else {
      setMyVerb(isVerb);
    }
  };


  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();

      const typedWords = input
        .toLowerCase()
        .split(" ")
        .filter((word) => word !== "");

      if (typedWords.length === 0) return;
      const newWords = [...myWords, ...typedWords];
      checkIsVerb(newWords);
      setMyWords(newWords);
      checkDuplicate(newWords);
      setInput("");
    }
  };

  const deleteWord = (index: number) => {
    const updatedWords = myWords.filter((w, i) => i !== index);
    console.log(updatedWords);
    setMyWords(updatedWords);
    checkDuplicate(updatedWords);
  };

  const borderSameWord = (word: string) => {
    const isDuplicate = myWords.filter((w) => w === word).length > 1;
    return isDuplicate ? "border border-red-300" : "border-0";
  };


  return (
    <div className="flex justify-center content-center bg-[#FEFEFE] min-h-screen p-4">
      <div className="w-150  h-auto p-4  border-1 border-gray-200 rounded-sm  bg-[#FFF]">
        <h1 className="text-center">Connected Word For Director</h1>
        {result && (
          <p className="text-center font-bold text-white p-3 bg-red-500 rounded-sm my-2">
            SAME WORD DETECT!!
          </p>
        )}
        {myVerb && (
          <p className="text-center font-bold text-white p-3 bg-red-500 rounded-sm my-2">
            IS A VERB!!
          </p>
        )}
        <div className="flex gap-4">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="border  border-gray-200 p-2 rounded-sm w-full"
            placeholder="Type A Word And Enter e.g. การ วิ่ง "
          />
          <button
            onClick={() => {
              setMyWords([]);
              setResult(false);
              setMyVerb(false);
              setInput("");
            }}
            className="rounded-sm text-sm p-4 bg-black hover:bg-gray-800 text-white font-bold cursor-pointer"
          >
            Reset
          </button>
        </div>

        <div className="mt-2 space-y-1">
          {myWords.map((word, index) => (
            <div key={index} className={`flex place-content-between ${borderSameWord(word)} bg-[#F9FAFB] h-15 p-3 rounded-sm `}>
              <p className="p-2" key={index}>
                {word}
              </p>
              <button
                onClick={() => deleteWord(index)}
                className="p-2 rounded-sm cursor-pointer hover:bg-gray-200"
              >
                <IoTrashBin />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
