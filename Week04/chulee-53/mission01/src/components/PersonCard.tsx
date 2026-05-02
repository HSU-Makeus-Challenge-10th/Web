interface PersonCardProps {
    name: string;
    description: string;
    profilePath: string | null;
}

export default function PersonCard({ name, description, profilePath }: PersonCardProps) {
    const imageUrl = profilePath
        ? `https://image.tmdb.org/t/p/w200${profilePath}`
        : 'https://www.themoviedb.org/assets/2/v4/glyphicons/basic/glyphicons-basic-4-user-grey-d8fe5773344b1f91d6e079e96d5a910577.svg';

    return (
        <div className="flex flex-col items-center group">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden mb-3 border-2 border-[#FFF8F0]">
                <img
                    src={imageUrl}
                    alt={name}
                    className="w-full h-full object-cover"
                />
            </div>
            <p className="font-bold text-sm text-center mb-1 text-[#FFF8F0] line-clamp-1">{name}</p>
            <p className="text-[11px] text-gray-500 text-center">{description}</p>
        </div>
    );
}
