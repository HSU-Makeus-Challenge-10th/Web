import { useParams } from 'react-router-dom';
import useLpDetail from '../../hooks/useLpDetail';
// import { useAuthStore } from '../store/authStore';
import LoadingSpinner from '../../components/spinner/LoadingSpinner';
import Error from '../../components/error/Error';
import { Heart, Pencil, Trash2 } from 'lucide-react';
import CommentSection from './components/comments/CommentSection';

const LpDetailPage = () => {
  const { lpId } = useParams<{ lpId: string }>();
  // const { user } = useAuthStore();
  const numericLpId = Number(lpId);

  const { data: lp, isLoading, isError, error } = useLpDetail(numericLpId);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (isError) {
    return <Error message={error.message} />;
  }

  if (!lp) {
    return <Error message="LP 정보를 찾을 수 없습니다." />;
  }

  // const isAuthor = user?.id === lp.authorId;

  return (
    <div className="min-h-full max-w-[60vw] mx-auto py-[3vh] px-[3vw]">
      <div className="bg-[#2c2c2c] rounded-lg p-[3vw] text-white">
        <div className="flex justify-between items-start mb-[3vh]">
          <div>
            <div className="flex items-center gap-[1vw]">
              <img
                src={lp.author?.avatar || '/default-avatar.png'}
                className="w-[3vw] h-[3vw] min-w-10 min-h-10 rounded-full"
              />
              <span className="font-bold text-[1.1vw]">{lp.author?.name}</span>
            </div>
            <h1 className="text-[2.5vw] font-bold mt-[1.5vh]">{lp.title}</h1>
          </div>
          <div className="text-right">
            <p className="text-[0.9vw] text-gray-400 whitespace-nowrap">
              {new Date(lp.createdAt).toLocaleDateString()}
            </p>
            {/* {isAuthor && ( */}
            <div className="flex mt-[1vh] gap-[1.5vw] text-gray-400">
              <button className="hover:text-white">
                <Pencil size={20} />
              </button>
              <button className="hover:text-white">
                <Trash2 size={20} />
              </button>
            </div>
            {/* )} */}
          </div>
        </div>

        <div className="flex justify-center my-[5vh]">
          <div className="relative w-[25vw] h-[25vw]">
            <img
              src={lp.thumbnail}
              className="w-full h-full rounded-full object-cover shadow-2xl shadow-gray-900 spinner"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-[6vw] h-[6vw] min-w-20 min-h-20 bg-[#2c2c2c] shadow-xl rounded-full border-2 border-gray-600 " />
            </div>
          </div>
        </div>

        <p className="text-center mb-[1.5vh] leading-relaxed text-[1vw]">
          {lp.content}
        </p>

        <div className="flex justify-center gap-[0.8vw] flex-wrap mb-[5vh]">
          {lp.tags?.map((tag) => (
            <span
              key={tag.id}
              className="bg-gray-600 text-gray-300 px-[1.5vw] py-[0.5vh] rounded-full text-[0.9vw]"
            >
              #{tag.name}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-center gap-[0.8vw]">
          <button className="text-red-500 hover:text-red-400 transition-colors">
            <Heart size={32} fill="none" /> {/* 내가 눌렀으면 채우기 */}
          </button>
          <span className="font-bold text-[1.3vw]">{lp.likes.length}</span>
        </div>
        <CommentSection lpId={numericLpId} />
      </div>
    </div>
  );
};

export default LpDetailPage;
