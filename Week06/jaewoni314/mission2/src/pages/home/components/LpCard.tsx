import { useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import type { Lp } from '../../../types/lp';
import Skeleton from '../../../components/skeleton/Skeleton';
import clsx from 'clsx';

interface LpCardProps {
  lp: Lp;
}

const LpCard = ({ lp }: LpCardProps) => {
  const navigate = useNavigate();
  const [loaded, setLoaded] = useState(false);
  const [hovered, setHovered] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const img = imgRef.current;
    if (!img) return;

    if (img.complete && img.naturalWidth > 0) {
      setLoaded(true);
      return;
    }

    const onLoad = () => setLoaded(true);
    const onError = () => setLoaded(true);

    img.addEventListener('load', onLoad);
    img.addEventListener('error', onError);

    return () => {
      img.removeEventListener('load', onLoad);
      img.removeEventListener('error', onError);
    };
  }, [lp.thumbnail]);

  const handleClick = () => navigate(`/lp/${lp.id}`);

  return (
    <div
      className="relative rounded-lg overflow-hidden cursor-pointer"
      onClick={handleClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="relative aspect-square">
        <img
          ref={imgRef}
          src={lp.thumbnail}
          alt={lp.title}
          loading="lazy"
          className={clsx(
            'absolute inset-0 h-full w-full object-cover transition-opacity duration-300',
            loaded ? 'opacity-100' : 'opacity-0'
          )}
        />

        {!loaded && <Skeleton className="absolute inset-0" />}

        {/* hover 오버레이 */}
        <div
          className={clsx(
            'absolute inset-0 bg-black flex flex-col justify-end p-3 transition-opacity duration-300',
            hovered ? 'opacity-80' : 'opacity-0'
          )}
        >
          <p className="text-white font-bold text-sm truncate">{lp.title}</p>
          <p className="text-gray-300 text-xs mt-1">{lp.author?.name}</p>
          <p className="text-pink-400 text-xs mt-1">❤️ {lp.likes?.length ?? 0}</p>
        </div>
      </div>
    </div>
  );
};

export default LpCard;