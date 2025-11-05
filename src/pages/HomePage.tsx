import React, { useState } from 'react';
import { PostForm } from '../components/PostForm';
import { PostCard } from '../components/PostCard';
import { KindMission } from '../components/KindMission';
import { Donation } from '../components/Donation';
import { usePosts, useCurrentUser } from '../hooks/useRepository';

export const HomePage: React.FC = () => {
  const { posts, refresh } = usePosts();
  const { user: currentUser } = useCurrentUser();
  const [, forceUpdate] = useState({});

  const handlePostCreated = () => {
    refresh();
    forceUpdate({});
  };

  return (
    <div className="container">
      <div className="grid grid-2 gap-lg">
        <div>
          {currentUser && <PostForm onPostCreated={handlePostCreated} />}
          <div>
            {posts.length === 0 ? (
              <div className="text-center text-light py-2xl">
                まだ投稿がありません。最初の投稿をしてみましょう！
              </div>
            ) : (
              posts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  onEncouragementAdded={handlePostCreated}
                />
              ))
            )}
          </div>
        </div>
        <div>
          {currentUser && (
            <>
              <KindMission />
              <div className="mt-lg">
                <Donation />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

