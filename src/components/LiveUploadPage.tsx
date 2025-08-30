'use client';

import React, { useState } from 'react';

type Props = {
  onUpload: (content: string) => void;
};

export default function LiveUploadPage({ onUpload }: Props) {
  const [manualContent, setManualContent] = useState('');

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      onUpload(text);
    } catch (err) {
      console.error('读取文件失败:', err);
    }
  };

  const handleManualSubmit = () => {
    if (manualContent.trim()) {
      onUpload(manualContent);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block mb-1 font-medium text-gray-700">上传 M3U 文件</label>
        <input
          type="file"
          accept=".m3u"
          onChange={handleFileChange}
          className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-white"
        />
      </div>

      <div>
        <label className="block mb-1 font-medium text-gray-700">或粘贴 M3U 内容</label>
        <textarea
          rows={6}
          value={manualContent}
          onChange={(e) => setManualContent(e.target.value)}
          placeholder="#EXTM3U\n#EXTINF:-1,Channel Name\nhttp://example.com/stream"
          className="w-full border border-gray-300 rounded p-2 text-sm font-mono"
        />
        <button
          onClick={handleManualSubmit}
          className="mt-2 px-4 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          使用粘贴内容
        </button>
      </div>
    </div>
  );
}
