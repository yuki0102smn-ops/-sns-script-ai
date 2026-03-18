"use client";

import { useState } from "react";

const PLATFORMS = ["Threads", "Instagram Reels", "TikTok", "YouTube Shorts", "X(Twitter)"];

export default function Home() {
  const [product, setProduct] = useState("");
  const [target, setTarget] = useState("");
  const [platform, setPlatform] = useState(PLATFORMS[0]);
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResult("");

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ product, target, platform }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "エラーが発生しました");
        return;
      }

      setResult(data.result);
    } catch {
      setError("ネットワークエラーが発生しました");
    } finally {
      setLoading(false);
    }
  }

  async function handleCopy() {
    await navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <main className="max-w-2xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          ScriptAI
        </h1>
        <p className="text-gray-400 text-lg">
          バズるショート動画のスクリプトを30秒で生成
        </p>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-gray-900 rounded-2xl p-6 space-y-5 mb-6"
      >
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            商品・サービス
          </label>
          <input
            type="text"
            value={product}
            onChange={(e) => setProduct(e.target.value)}
            placeholder="例：オーガニックスキンケアクリーム"
            required
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            ターゲット
          </label>
          <input
            type="text"
            value={target}
            onChange={(e) => setTarget(e.target.value)}
            placeholder="例：20〜30代の肌荒れに悩む女性"
            required
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            プラットフォーム
          </label>
          <select
            value={platform}
            onChange={(e) => setPlatform(e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition"
          >
            {PLATFORMS.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition"
        >
          {loading ? "生成中..." : "スクリプトを生成する"}
        </button>
      </form>

      {/* Error */}
      {error && (
        <div className="bg-red-900/40 border border-red-700 text-red-300 rounded-xl p-4 mb-6">
          {error}
        </div>
      )}

      {/* Result */}
      {result && (
        <div className="bg-gray-900 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-200">
              生成されたスクリプト
            </h2>
            <button
              onClick={handleCopy}
              className="text-sm bg-gray-700 hover:bg-gray-600 px-4 py-1.5 rounded-lg transition"
            >
              {copied ? "コピー済み ✓" : "コピー"}
            </button>
          </div>
          <pre className="text-gray-300 whitespace-pre-wrap text-sm leading-relaxed font-sans">
            {result}
          </pre>
        </div>
      )}

      {/* Footer */}
      <p className="text-center text-gray-600 text-sm mt-10">
        ScriptAI — Powered by Claude
      </p>
    </main>
  );
}
