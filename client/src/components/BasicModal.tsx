interface BasicModalProps {
    title: string;
    placeholder: string;
    inputValue: string;
    onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onClose: () => void;
    onConfirm: () => void;
    confirmText: string;
}

const BasicModal = ({title, placeholder, inputValue, onInputChange, onClose, onConfirm, confirmText}: BasicModalProps) => {
    return (
        <div id="dashboard-modal-overlay">
            <div id="dashboard-modal">
                <button id="dashboard-modal-close" onClick={onClose}>
                    x
                </button>
                <h3>{title}</h3>
                <input
                    type="text"
                    placeholder={placeholder}
                    value={inputValue}
                    onChange={onInputChange}
                />
                <button id="dashboard-modal-create" onClick={onConfirm}>
                    {confirmText}
                </button>
            </div>
        </div>
    )
};

export default BasicModal;