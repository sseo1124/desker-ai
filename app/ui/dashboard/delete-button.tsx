"use client";
type DeletedButtonProps = {
  onClick: () => void;
};

const DeletedButton = ({ onClick }: DeletedButtonProps) => {
  return (
    <button
      onClick={onClick}
      className="rounded-md px-4 py-2 text-sm
        bg-brown-100 text-brown-800
        hover:bg-brown-800 hover:text-brown-100
        transition-colors"
    >
      삭제
    </button>
  );
};

export default DeletedButton;
