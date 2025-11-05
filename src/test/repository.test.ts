import { describe, it, expect, beforeEach } from 'vitest';
import { repository } from '../storage/repository';

describe('Repository', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should create and get user', () => {
    const user = repository.createUser({ name: 'Test User' });
    expect(user.id).toBeTruthy();
    expect(user.name).toBe('Test User');

    const retrieved = repository.getUser(user.id);
    expect(retrieved?.name).toBe('Test User');
  });

  it('should create and get post', () => {
    const user = repository.createUser({ name: 'Test User' });
    const post = repository.createPost({
      userId: user.id,
      content: 'Test post',
    });

    expect(post.id).toBeTruthy();
    expect(post.content).toBe('Test post');

    const retrieved = repository.getPost(post.id);
    expect(retrieved?.content).toBe('Test post');
  });

  it('should create encouragement and thank it', () => {
    const user1 = repository.createUser({ name: 'User 1' });
    const user2 = repository.createUser({ name: 'User 2' });
    const post = repository.createPost({
      userId: user1.id,
      content: 'Test post',
    });

    const encouragement = repository.createEncouragement({
      postId: post.id,
      userId: user2.id,
      content: 'Keep going!',
    });

    expect(encouragement.thanked).toBe(false);

    repository.thankEncouragement(encouragement.id);
    const updated = repository.getEncouragements().find((e) => e.id === encouragement.id);
    expect(updated?.thanked).toBe(true);
  });

  it('should calculate user balance correctly', () => {
    const user1 = repository.createUser({ name: 'User 1' });
    const user2 = repository.createUser({ name: 'User 2' });

    // 送金
    repository.createTransaction({
      fromUserId: user1.id,
      toUserId: user2.id,
      amount: 10,
      type: 'flower',
    });

    expect(repository.getUserBalance(user1.id)).toBe(-10);
    expect(repository.getUserBalance(user2.id)).toBe(10);
  });
});

