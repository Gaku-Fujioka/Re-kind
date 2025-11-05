import { Card } from '../components/ui/Card';

export const About = () => {
  return (
    <Card>
      <h1 className="text-2xl font-bold mb-4">Re:kindについて</h1>
      <div className="prose prose-sm max-w-none">
        <p className="text-gray-600 mb-4">
          Re:kind は、ネガティブになりがちなSNSを「共感→感謝→支援→共感」の優しさの循環に変える体験を提供するSNSアプリケーションです。
        </p>
        <h2 className="text-xl font-semibold mt-6 mb-3">特徴</h2>
        <ul className="list-disc list-inside space-y-2 text-gray-600">
          <li>投稿（悩み/気持ち）</li>
          <li>励まし/共感メッセージ</li>
          <li>KindCoinシステム</li>
          <li>Thank You Bloom（感謝の花）</li>
          <li>共感カレンダー</li>
          <li>Kind Mission</li>
        </ul>
      </div>
    </Card>
  );
};

