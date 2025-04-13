"use client";
import { useState } from "react";
import { IoTrashBin } from "react-icons/io5";
import { FaEdit } from "react-icons/fa";
import { IoSaveSharp } from "react-icons/io5";
import { MdCancel } from "react-icons/md";
import verbs from "../data/verbs.json";

export default function WordChecker() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState(false);
  const [myVerb, setMyVerb] = useState(false);
  const [myWords, setMyWords] = useState<string[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingText, setEditingText] = useState("");

  const checkDuplicate = (words: string[]) => {
    const wordSet = new Set(words);
    setResult(wordSet.size !== words.length);
  };

  const checkIsVerb = (words: string[]) => {
    const isVerb = words.some((w) => verbs.includes(w));
    if (words[0]?.includes("การ")) {
      setMyVerb(!isVerb);
    } else {
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
      setMyWords(newWords);
      checkDuplicate(newWords);
      checkIsVerb(newWords);
      setInput("");
    }
  };

  const deleteWord = (index: number) => {
    const updatedWords = myWords.filter((_, i) => i !== index);
    setMyWords(updatedWords);
    checkDuplicate(updatedWords);
  };

  const editWord = (index: number) => {
    setEditingIndex(index);
    setEditingText(myWords[index]);
  };

  const saveEditedWord = () => {
    if (editingIndex === null) return;
    const updatedWords = [...myWords];
    updatedWords[editingIndex] = editingText.trim().toLowerCase();
    setMyWords(updatedWords);
    checkDuplicate(updatedWords);
    checkIsVerb(updatedWords);
    setEditingIndex(null);
    setEditingText("");
  };

  const borderSameWord = (word: string) => {
    const isDuplicate = myWords.filter((w) => w === word).length > 1;
    return isDuplicate ? "border border-red-300" : "";
  };

  return (
    <div className="flex justify-center bg-[#FEFEFE] min-h-screen p-4">
      <div className="w-150 p-4 border border-gray-200 rounded-sm bg-white">
        <h1 className="text-center md:text-2xl p-4">Connected Word For Director</h1>

        {result && (
          <p className="text-center font-bold text-white p-3 bg-red-500 rounded-sm my-2">
            SAME WORD DETECTED!!
          </p>
        )}
        {myVerb && (
          <p className="text-center font-bold text-white p-3 bg-red-500 rounded-sm my-2">
            VERB DETECTED!!
          </p>
        )}

        <div className="flex gap-4">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="border border-gray-200 p-2 rounded-sm w-full focus-visible:outline-1 focus-visible:outline-gray-800"
            placeholder="Type A Word And Enter e.g. การ วิ่ง"
          />
          <button
            onClick={() => {
              setMyWords([]);
              setResult(false);
              setMyVerb(false);
              setInput("");
              setEditingIndex(null);
              setEditingText("");
            }}
            className="rounded-sm text-sm p-4 bg-black hover:bg-gray-800 text-white font-bold cursor-pointer"
          >
            Reset
          </button>
        </div>

        <div className="mt-4 space-y-2">
          {myWords.map((word, index) => {
            const isEditing = index === editingIndex;
            return (
              <div
                key={index}
                className={`flex items-center justify-between ${borderSameWord(
                  word
                )} bg-[#F9FAFB] p-3 rounded-sm`}
              >
                {isEditing ? (
                  <input
                    type="text"
                    value={editingText}
                    onChange={(e) => setEditingText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") saveEditedWord();
                    }}
                    className="border border-gray-200 p-2 rounded-sm w-full mr-4"
                  />
                ) : (
                  <p>{word}</p>
                )}

                <div className="flex gap-2">
                  {isEditing ? (
                    <div className="flex gap-2">
                    <button
                      onClick={saveEditedWord}
                      className="p-2 bg-green-200 hover:bg-green-300 rounded-sm cursor-pointer"
                    >
                      <IoSaveSharp />
                    </button>

                    <button
                      onClick={() => {
                        setEditingIndex(null);
                        setEditingText("");
                      }}
                      className="p-2 bg-red-200 hover:bg-red-300 rounded-sm cursor-pointer"
                    >
                      <MdCancel />
                    </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => editWord(index)}
                      className="p-2 hover:bg-gray-200 rounded-sm cursor-pointer"
                    >
                      <FaEdit />
                    </button>
                  )}

                  <button
                    onClick={() => deleteWord(index)}
                    className="p-2 hover:bg-gray-200 rounded-sm cursor-pointer"
                  >
                    <IoTrashBin />
                  </button>

                </div>
              </div>
            );
          })}

        </div>
      </div>
    </div>
  );
}
