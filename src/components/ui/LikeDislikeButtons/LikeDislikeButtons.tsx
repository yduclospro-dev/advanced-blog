interface LikeDislikeButtonsProps {
    likesCount: number;
    dislikesCount: number;
    hasLiked: boolean;
    hasDisliked: boolean;
    onLike: () => void;
    onDislike: () => void;
}

export default function LikeDislikeButtons({
    likesCount,
    dislikesCount,
    hasLiked,
    hasDisliked,
    onLike,
    onDislike,
}: LikeDislikeButtonsProps) {
    return (
        <div className="flex items-center gap-4">
            <button
                onClick={onLike}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                    hasLiked
                        ? 'bg-blue-100 text-blue-700 border-2 border-blue-700'
                        : 'bg-gray-100 text-gray-700 border-2 border-transparent hover:bg-gray-200'
                }`}
            >
                <span className="text-lg">{hasLiked ? '👍' : '👍🏻'}</span>
                <span className="font-semibold">{likesCount}</span>
            </button>

            <button
                onClick={onDislike}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                    hasDisliked
                        ? 'bg-red-100 text-red-700 border-2 border-red-700'
                        : 'bg-gray-100 text-gray-700 border-2 border-transparent hover:bg-gray-200'
                }`}
            >
                <span className="text-lg">{hasDisliked ? '👎' : '👎🏻'}</span>
                <span className="font-semibold">{dislikesCount}</span>
            </button>
        </div>
    );
}
