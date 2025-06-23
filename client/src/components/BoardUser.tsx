interface UserType {
    id: string;
    email: string;
    canEdit: boolean;
}

interface BoardUserProps {
    currentUserId: string;
    user: UserType;
    ownerId: string;
    onSetCanEdit: (userId: string, newValue: boolean) => void;
    isLoading: boolean;
}

const BoardUser = ({currentUserId, user, ownerId, onSetCanEdit, isLoading}: BoardUserProps) => {
    return (
        <div className="board-user">
            <p>{user.email}</p>
            {currentUserId === ownerId && (
                user.id !== ownerId && (
                    <input
                        type="checkbox"
                        checked={user.canEdit}
                        disabled={isLoading}
                        onChange={(e) => onSetCanEdit(user.id, e.target.checked)}
                    />
                )
            )}
        </div>
  )
};

export default BoardUser;