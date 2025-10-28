import { Comment } from "@/types/Comment";
import { Button, TextArea, LikeDislikeButtons } from "@/components/ui";
import ConfirmModal from "@/components/ConfirmModal";

interface CommentsListPresenterProps {
    comments: Comment[];
    currentUserId?: string;
    editingId: string | null;
    editContent: string;
    deleteConfirmId: string | null;
    onStartEditing: (comment: Comment) => void;
    onCancelEditing: () => void;
    onEditContentChange: (value: string) => void;
    onSaveEdit: (commentId: string) => void;
    onShowDeleteConfirm: (commentId: string) => void;
    onConfirmDelete: () => void;
    onCancelDelete: () => void;
    onCommentLike: (commentId: string) => void;
    onCommentDislike: (commentId: string) => void;
}

export default function CommentsListPresenter({
    comments,
    currentUserId,
    editingId,
    editContent,
    deleteConfirmId,
    onStartEditing,
    onCancelEditing,
    onEditContentChange,
    onSaveEdit,
    onShowDeleteConfirm,
    onConfirmDelete,
    onCancelDelete,
    onCommentLike,
    onCommentDislike,
}: CommentsListPresenterProps) {
    if (comments.length === 0) {
        return (
            <div className="text-center py-8 text-gray-500 dark:text-slate-400">
                Aucun commentaire pour le moment. Soyez le premier à commenter !
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                💬 Commentaires ({comments.length})
            </h3>
            {comments.map((comment) => {
                const isAuthor = currentUserId === comment.authorId;
                const isEditing = editingId === comment.id;

                return (
                    <div
                        key={comment.id}
                        className={`border rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow ${
                            isAuthor
                                ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
                                : 'bg-gray-50 dark:bg-slate-800 border-gray-200 dark:border-slate-700'
                        }`}
                    >
                        <div className="flex justify-between items-start mb-3">
                            <div>
                                <p className="font-semibold text-gray-900 dark:text-white">
                                    {comment.authorName}
                                </p>
                                <p className="text-sm text-gray-500 dark:text-slate-400">
                                    {new Date(comment.date).toLocaleDateString("fr-FR", {
                                        day: "numeric",
                                        month: "long",
                                        year: "numeric",
                                        hour: "2-digit",
                                        minute: "2-digit",
                                    })}
                                </p>
                            </div>
                            {isAuthor && !isEditing && (
                                <div className="flex gap-2">
                                    <Button
                                        variant="primary"
                                        size="sm"
                                        onClick={() => onStartEditing(comment)}
                                        label=""
                                        icon={
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                            </svg>
                                        }
                                    />
                                    <Button
                                        variant="danger"
                                        size="sm"
                                        onClick={() => onShowDeleteConfirm(comment.id)}
                                        label=""
                                        icon={
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        }
                                    />
                                </div>
                            )}
                        </div>

                        {isEditing ? (
                            <div className="space-y-3">
                                <TextArea
                                    label=""
                                    value={editContent}
                                    onChange={(e) => onEditContentChange(e.target.value)}
                                    rows={3}
                                />
                                <div className="flex gap-2 justify-end">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        label="Annuler"
                                        onClick={onCancelEditing}
                                    />
                                    <Button
                                        variant="primary"
                                        size="sm"
                                        label="Sauvegarder"
                                        onClick={() => onSaveEdit(comment.id)}
                                    />
                                </div>
                            </div>
                        ) : (
                            <>
                                <p className="text-gray-700 dark:text-slate-300 leading-relaxed mb-3">
                                    {comment.content}
                                </p>
                                {currentUserId && !isAuthor && (
                                    <div className="flex justify-end">
                                        <LikeDislikeButtons
                                            likesCount={comment.likes.length}
                                            dislikesCount={comment.dislikes.length}
                                            hasLiked={comment.likes.includes(currentUserId)}
                                            hasDisliked={comment.dislikes.includes(currentUserId)}
                                            onLike={() => onCommentLike(comment.id)}
                                            onDislike={() => onCommentDislike(comment.id)}
                                        />
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                );
            })}

            
            {deleteConfirmId && (
                <ConfirmModal
                    message="Êtes-vous sûr de vouloir supprimer ce commentaire ? Cette action est irréversible."
                    onConfirm={onConfirmDelete}
                    onCancel={onCancelDelete}
                />
            )}
        </div>
    );
}
