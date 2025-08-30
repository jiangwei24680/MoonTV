'use client';
import { useState } from 'react';
import LiveChannelList from '@/components/LiveChannelList';

export default function LiveUploadPage() {
  const [m3uContent, setM3uContent] = useState<string>('');

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        setM3uContent(text);
      };
      reader.readAsText(file);
    }
  };

  return (
    <>
      <input
        type="file"
        accept=".m3u"
        onChange={handleFileUpload}
        className="mb-6"
      />
      {m3uContent ? (
        <LiveChannelList m3uContent={m3uContent} />
      ) : (
        <p className="text-gray-500">请上传一个 .m3u 播单文件以查看频道列表。</p>
      )}
    </>
  );
}
