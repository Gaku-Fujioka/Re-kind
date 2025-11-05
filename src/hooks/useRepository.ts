import { useEffect, useState } from 'react';
import { repository } from '../storage/repository';
import type {
  User,
  Post,
  Encouragement,
  KindCoinTransaction,
  ThankYouBloom,
  EmpathyCalendarEntry,
  KindMission,
} from '../types';

export const useRepository = () => {
  const [, forceUpdate] = useState({});

  const refresh = () => {
    forceUpdate({});
  };

  return {
    repository,
    refresh,
  };
};

// ユーザー関連フック
export const useCurrentUser = () => {
  const { repository, refresh } = useRepository();
  const user = repository.getCurrentUser();
  return { user, refresh };
};

// 投稿関連フック
export const usePosts = () => {
  const { repository, refresh } = useRepository();
  const posts = repository.getPosts();
  return { posts, refresh };
};

export const usePost = (postId: string) => {
  const { repository, refresh } = useRepository();
  const post = repository.getPost(postId);
  return { post, refresh };
};

// 励まし関連フック
export const usePostEncouragements = (postId: string) => {
  const { repository, refresh } = useRepository();
  const encouragements = repository.getPostEncouragements(postId);
  return { encouragements, refresh };
};

// KindCoin関連フック
export const useUserBalance = (userId: string) => {
  const { repository, refresh } = useRepository();
  const balance = repository.getUserBalance(userId);
  return { balance, refresh };
};

// Thank You Bloom関連フック
export const useUserBlooms = (userId: string) => {
  const { repository, refresh } = useRepository();
  const blooms = repository.getUserBlooms(userId);
  return { blooms, refresh };
};

// カレンダー関連フック
export const useUserCalendar = (userId: string) => {
  const { repository, refresh } = useRepository();
  const entries = repository.getUserCalendarEntries(userId);
  return { entries, refresh };
};

// Kind Mission関連フック
export const useTodayMissions = (userId: string) => {
  const { repository, refresh } = useRepository();
  const missions = repository.getTodayMissions(userId);
  return { missions, refresh };
};

