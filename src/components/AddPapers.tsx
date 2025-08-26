const AddPapers = ({ onClick }: { onClick?: () => void }) => {
  return (
    <div
      onClick={onClick}
      className="flex h-full w-full cursor-pointer items-center justify-center rounded-md border-2 border-dashed border-purple-500 bg-transparent text-purple-500 transition hover:border-gray-400 hover:bg-[#e8e9ff] hover:text-gray-700 dark:hover:bg-[#2a2a2a] dark:hover:text-gray-300"
    >
      <span className="text-4xl transition-colors duration-200">+</span>
    </div>
  );
};

export default AddPapers;
