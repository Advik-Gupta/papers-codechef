const AddPapers = ({ onClick }: { onClick?: () => void }) => {
  return (
    <div
      onClick={onClick}
      className="flex h-full w-full cursor-pointer items-center justify-center rounded-md border-2 border-dashed border-purple-500 bg-transparent transition hover:border-gray-400 hover:bg-[#2a2a2a] hover:text-gray-300"
    >
      <span className="text-4xl text-purple-500 transition-colors duration-200 group-hover:text-gray-300">
        +
      </span>
    </div>
  );
};

export default AddPapers;
