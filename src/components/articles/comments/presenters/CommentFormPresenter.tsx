import { Button, TextArea } from "@/components/ui";

interface CommentFormPresenterProps {
    content: string;
    onInputChange: (value: string) => void;
    onSubmit: () => void;
}

export default function CommentFormPresenter({
    content,
    onInputChange,
    onSubmit,
}: CommentFormPresenterProps) {
    return (
        <div className="bg-white dark:bg-slate-800 border-2 border-gray-200 dark:border-slate-700 rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                💬 Ajouter un commentaire
            </h3>
            <TextArea
                label="Votre commentaire"
                value={content}
                onChange={(e) => onInputChange(e.target.value)}
                placeholder="Partagez votre opinion..."
                rows={4}
            />
            <div className="mt-4 flex justify-end">
                <Button
                    variant="primary"
                    label="Publier"
                    onClick={onSubmit}
                />
            </div>
        </div>
    );
}
