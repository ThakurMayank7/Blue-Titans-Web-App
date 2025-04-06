"use client";

import Spinner from "@/components/Spinner";
import getToken from "@/firebase/auth";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";

interface AnalysisResult {
  genre: string;
  taal: string;
  tonic: string | null;
}

interface SynthesisResult {
  audioURL: string;
}
interface TrainingResult {
  message: string;
}

interface Result {
  resultType: "Analysis" | "Synthesis" | "Training";
  analysisResult?: AnalysisResult;
  synthesisResult?: SynthesisResult;
  trainingResult?: TrainingResult;
}

export default function Home() {
  const router = useRouter();

  const { user, loading } = useAuth();

  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const [uploadedFileURL, setUploadedFileURL] = useState<string | null>(null);

  const [result, setResult] = useState<Result | null>(null);

  const [processing, setProcessing] = useState<
    "analysis" | "synthesis" | "training" | null
  >(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    if (!user && !loading) {
      router.push("/login");
    }
  }, [router, user, loading]);

  useEffect(() => {
    return () => {
      if (uploadedFileURL) {
        URL.revokeObjectURL(uploadedFileURL);
      }
    };
  }, [uploadedFileURL]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setUploadedFile(acceptedFiles[0]);
      console.log("Uploaded file:", acceptedFiles[0]);
      const url = URL.createObjectURL(acceptedFiles[0]);
      setUploadedFileURL(url);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    accept: {
      "audio/mpeg": [],
      "audio/wav": [],
    },
  });

  const synthesiseAudio = async () => {
    if (!uploadedFile) {
      alert("Please upload a file first.");
      return;
    }
    if (processing) {
      return;
    }

    if (!user && !loading) {
      router.push("/login");
    }
    setProcessing("analysis");

    try {
      console.log("Synthesising audio file:", uploadedFile);
      const fileType = uploadedFile.type;
      const fileSize = uploadedFile.size;
      console.log("File type:", fileType);
      console.log("File size:", fileSize);

      const token = await getToken();
      if (!token) {
        throw new Error("Authentication required. Please sign in.");
      }

      const formData = new FormData();
      formData.append("audio", uploadedFile);

      const response = await fetch(`${API_URL}/synthesis`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) throw new Error("Failed to synthesize audio");

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);

      setResult({
        resultType: "Synthesis",
        synthesisResult: {
          audioURL: audioUrl,
        } as SynthesisResult,
      });

      console.log("Synthesis result:", audioUrl);
    } catch (error) {
      console.error("Error synthesizing audio:", error);
      alert("Failed to synthesize audio.");
    } finally {
      setProcessing(null);
    }
  };

  // const training = async () => {
  //   if (!uploadedFile) {
  //     alert("Please upload a file first.");
  //     return;
  //   }
  //   if (processing) {
  //     return;
  //   }

  //   if (!user && !loading) {
  //     router.push("/login");
  //   }
  //   setProcessing("training");

  //   try {
  //     console.log("Training audio file:", uploadedFile);
  //     const fileType = uploadedFile.type;
  //     const fileSize = uploadedFile.size;
  //     console.log("File type:", fileType);
  //     console.log("File size:", fileSize);

  //     const token = await getToken();
  //     if (!token) {
  //       throw new Error("Authentication required. Please sign in.");
  //     }

  //     const formData = new FormData();
  //     formData.append("audio", uploadedFile);

  //     const response = await fetch(`${API_URL}/training`, {
  //       method: "POST",
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //       body: formData,
  //     });

  //     if (!response.ok) throw new Error("Failed to train audio");

  //     const result = await response.json();

  //     setResult({
  //       resultType: "Training",
  //       trainingResult: { message: result.message } as TrainingResult,
  //     } as Result);

  //     console.log("Training result:", result.result as AnalysisResult);
  //   } catch (error) {
  //     console.error("Error training audio:", error);
  //     alert("Failed to train audio.");
  //   } finally {
  //     setProcessing(null);
  //   }
  // };

  const analyzeMusic = async () => {
    if (!uploadedFile) {
      alert("Please upload a file first.");
      return;
    }
    if (processing) {
      return;
    }

    if (!user && !loading) {
      router.push("/login");
    }
    setProcessing("analysis");

    try {
      console.log("Analyzing audio file:", uploadedFile);
      const fileType = uploadedFile.type;
      const fileSize = uploadedFile.size;
      console.log("File type:", fileType);
      console.log("File size:", fileSize);

      const token = await getToken();
      if (!token) {
        throw new Error("Authentication required. Please sign in.");
      }

      const formData = new FormData();
      formData.append("audio", uploadedFile);

      const response = await fetch(`${API_URL}/analyze`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) throw new Error("Failed to analyze audio");

      const result = await response.json();

      setResult({
        resultType: "Analysis",
        analysisResult: result.results as AnalysisResult,
      });
      console.log("Analysis result:", result);
    } catch (error) {
      console.error("Error analyzing audio:", error);
      alert("Failed to analyze audio.");
    } finally {
      setProcessing(null);
    }
  };

  if (uploadedFile) {
    return (
      <div className="w-full bg-white/80 backdrop-blur-sm rounded-xl shadow-md border border-amber-200 p-4 md:p-6">
        <div className="flex flex-col space-y-4">
          <div className="bg-amber-100 rounded-lg p-3 md:p-4 border border-amber-300">
            <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 items-center my-4 md:my-0">
              <div className="text-3xl md:text-2xl">🎵</div>
              <div className="flex-1">
                <h3 className="font-medium text-amber-900 text-lg md:text-base">
                  {uploadedFile.name}
                </h3>
                <p className="text-sm text-center md:text-sm text-amber-700">
                  {(uploadedFile.size / (1024 * 1024)).toFixed(2)} MB
                </p>
              </div>
              {uploadedFileURL && (
                <div className="ml-8 w-full items-center flex justify-center my-4 md:my-0">
                  <audio controls src={uploadedFileURL} className="my-auto" />
                </div>
              )}
              {!processing && (
                <button
                  onClick={() => {
                    setUploadedFile(null);
                    setResult(null);
                  }}
                  className="bg-white text-red-600 px-2 md:px-3 py-1 rounded-md hover:bg-red-50 transition border border-red-200 text-sm md:text-sm"
                >
                  Remove
                </button>
              )}
            </div>
          </div>

          <div className="flex flex-col items-center pt-1 md:pt-2">
            {processing && (
              <div className="flex flex-col items-center gap-2 md:gap-3 py-4 md:py-6">
                <Spinner />
                <p className="text-amber-800 text-sm md:text-base">
                  {processing === "training"
                    ? "Evaluating..."
                    : processing === "synthesis"
                    ? "Synthesizing your audio..."
                    : "Analyzing your music..."}
                </p>
              </div>
            )}
            {result && !processing && (
              <div className="w-full md:w-1/2 bg-gradient-to-br from-amber-50 to-amber-100 rounded-lg p-4 md:p-5 border border-amber-300">
                <h3 className="text-xl md:text-lg font-semibold text-amber-800 mb-3 md:mb-4">
                  {result.resultType} Result
                </h3>
                {result.resultType === "Analysis" && result.analysisResult && (
                  <div className="space-y-2 md:space-y-3 text-sm md:text-base">
                    <div className="flex items-center">
                      <span className="w-16 md:w-20 font-medium text-amber-900">
                        Genre:
                      </span>
                      <span className="text-gray-700">
                        {result.analysisResult.genre}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <span className="w-16 md:w-20 font-medium text-amber-900">
                        Taal:
                      </span>
                      <span className="text-gray-700">
                        {result.analysisResult.taal}
                      </span>
                    </div>
                    {result.analysisResult.tonic && (
                      <div className="flex items-center">
                        <span className="w-16 md:w-20 font-medium text-amber-900">
                          Tonic:
                        </span>
                        <span className="text-gray-700">
                          {result.analysisResult.tonic}
                        </span>
                      </div>
                    )}
                  </div>
                )}
                {result.resultType === "Synthesis" &&
                  result.synthesisResult && (
                    <div className="space-y-2 md:space-y-3 text-sm md:text-base">
                      <div className="mt-4">
                        <h3 className="md:text-lg font-semibold">
                          Synthesised Audio:
                        </h3>
                        <audio
                          controls
                          src={result.synthesisResult.audioURL}
                          className="mt-2 w-full"
                        />
                      </div>
                    </div>
                  )}
                {result.resultType === "Training" && result.trainingResult && (
                  <div className="space-y-2 md:space-y-3 text-sm md:text-base">
                    <div className="mt-4">
                      <h3 className="text-lg font-semibold">
                        Training Result:
                      </h3>
                      <p className="text-gray-700">
                        {result.trainingResult.message}
                      </p>
                    </div>
                  </div>
                )}
                <button
                  onClick={() => {
                    setUploadedFile(null);
                    setResult(null);
                  }}
                  className="mt-4 md:mt-6 w-full bg-amber-600 text-white py-1.5 md:py-2 rounded-md hover:bg-amber-700 transition text-sm md:text-base"
                >
                  Choose Another File
                </button>
              </div>
            )}
            {!processing && (
              <div className="flex flex-col gap-2 md:gap-3 py-4 md:py-6 w-full">
                <button
                  onClick={() => analyzeMusic()}
                  className="w-full bg-gradient-to-r from-amber-600 to-amber-700 text-white py-2 md:py-3 rounded-lg font-medium hover:from-amber-700 hover:to-amber-800 transition-all shadow-md hover:shadow-lg flex items-center justify-center text-lg md:text-base hover:cursor-pointer"
                >
                  <span className="">Analyze Music</span>
                </button>
                <button
                  onClick={() => synthesiseAudio()}
                  className="w-full bg-gradient-to-r from-amber-600 to-amber-700 text-white py-2 md:py-3 rounded-lg font-medium hover:from-amber-700 hover:to-amber-800 transition-all shadow-md hover:shadow-lg flex items-center justify-center text-lg md:text-base hover:cursor-pointer"
                >
                  <span className="">Synthesise Music</span>
                </button>
                <button
                  onClick={
                    // () => training()
                    () => {
                      router.push("/PracticeWithAI");
                    }
                  }
                  className="w-full bg-gradient-to-r from-amber-600 to-amber-700 text-white py-2 md:py-3 rounded-lg font-medium hover:from-amber-700 hover:to-amber-800 transition-all shadow-md hover:shadow-lg flex items-center justify-center text-lg md:text-base hover:cursor-pointer"
                >
                  <span className="">Train with AI</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto my-2 sm:my-4 md:my-8">
      <div className="flex flex-col md:flex-row min-h-[500px] md:h-auto text-black bg-gradient-to-br from-amber-50/90 to-amber-100/90 rounded-xl backdrop-blur-sm shadow-xl border border-amber-200/50">
        <div className="w-full md:w-1/2 p-4 md:p-6 lg:p-10 flex items-center justify-center">
          <div className="relative w-full max-w-lg">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-100 to-amber-200 rounded-2xl opacity-50"></div>
            <div className="relative z-10 p-4 md:p-8 rounded-xl bg-white/80 backdrop-blur-sm shadow-lg border border-amber-200">
              <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 text-amber-800">
                🎵 Indian Classical Music Analyzer
              </h2>
              <p className="text-gray-700 mb-4 md:mb-6 text-sm md:text-base">
                Upload an audio file, and our AI will analyze its
                characteristics:
              </p>
              <ul className="space-y-2 md:space-y-3 mb-4 md:mb-6 text-sm md:text-base">
                <li className="flex items-center text-gray-700">
                  <span className="mr-2 text-amber-600 text-lg md:text-xl">
                    🎼
                  </span>
                  <span>
                    <span className="font-semibold">Genre:</span> Identify the
                    musical style
                  </span>
                </li>
                <li className="flex items-center text-gray-700">
                  <span className="mr-2 text-amber-600 text-lg md:text-xl">
                    🥁
                  </span>
                  <span>
                    <span className="font-semibold">Taal:</span> Recognize the
                    rhythmic cycle
                  </span>
                </li>
                <li className="flex items-center text-gray-700">
                  <span className="mr-2 text-amber-600 text-lg md:text-xl">
                    🎵
                  </span>
                  <span>
                    <span className="font-semibold">Tonic:</span> Detect the
                    base pitch
                  </span>
                </li>
              </ul>
              <p className="text-gray-700 font-medium mt-4 md:mt-6 text-sm md:text-base">
                Experience the rich traditions of Indian classical music through
                advanced AI analysis.
              </p>
            </div>
          </div>
        </div>
        <div className="w-full md:w-1/2 p-4 md:p-6 lg:p-10 flex items-center justify-center">
          <div className="w-full max-w-lg">
            {!uploadedFile && (
              <div
                {...getRootProps()}
                className="w-full h-48 md:h-64 flex flex-col items-center justify-center border-2 border-dashed border-amber-400 rounded-lg cursor-pointer p-4 md:p-6 transition duration-300 hover:bg-amber-200/50 hover:border-amber-600 bg-white/60 backdrop-blur-sm"
              >
                <input {...getInputProps()} />
                <div className="text-amber-800 text-center">
                  {isDragActive ? (
                    <div className="space-y-2">
                      <div className="text-3xl md:text-4xl">📁</div>
                      <p className="font-medium text-sm md:text-base">
                        Drop your file here...
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3 md:space-y-4">
                      <div className="text-3xl md:text-4xl">🎵</div>
                      <p className="font-medium text-base md:text-lg">
                        Drag & drop a MP3 or WAV file here
                      </p>
                      <p className="text-xs md:text-sm text-amber-700">
                        or click to browse files
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
