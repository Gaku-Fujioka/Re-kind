import { useParams, Navigate } from 'react-router-dom';
import { useAppStore } from '../app/store/useAppStore';
import { ProfileView } from '../features/profile/ProfileView';

export const Profile = () => {
  const { id } = useParams<{ id: string }>();
  const currentUser = useAppStore((state) => state.getCurrentUser());
  const targetUser = useAppStore((state) => (id ? state.getUser(id) : null));

  // idが指定されていない場合は現在のユーザーのプロフィールにリダイレクト
  if (!id) {
    if (currentUser) {
      return <Navigate to={`/profile/${currentUser.id}`} replace />;
    }
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">ログインしてください</p>
      </div>
    );
  }

  if (!targetUser) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">ユーザーが見つかりません</p>
      </div>
    );
  }

  return <ProfileView userId={targetUser.id} />;
};

