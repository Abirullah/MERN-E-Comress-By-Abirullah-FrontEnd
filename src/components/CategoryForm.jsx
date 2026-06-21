const CategoryForm = ({
  value,
  setValue,
  handleSubmit,
  buttonText = "Submit",
  handleDelete,
}) => {
  return (
    <div className="p-3">
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="text"
          className="w-full rounded-lg border border-[#1e1e1e] bg-[#0e0e0e] py-3 px-4 text-sm text-[#ddd4be] outline-none placeholder:text-[#5a5a5a] transition-all duration-200 focus:border-[#d4a544]/50 focus:ring-4 focus:ring-[#d4a544]/5"
          placeholder="Write category name"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />

        <div className="flex justify-between gap-3">
          <button
            type="submit"
            className="rounded-lg bg-[#d4a544] px-5 py-2.5 text-[11px] font-bold uppercase tracking-[0.2em] text-[#080808] transition-all duration-300 hover:bg-[#c19a3e] hover:-translate-y-0.5 focus:outline-none focus:ring-4 focus:ring-[#d4a544]/20 shadow-lg shadow-[#d4a544]/10 hover:shadow-xl hover:shadow-[#d4a544]/20"
          >
            {buttonText}
          </button>

          {handleDelete && (
            <button
              type="button"
              onClick={handleDelete}
              className="rounded-lg border border-[#4a2d2d] bg-[#2e1a1a] px-5 py-2.5 text-[11px] font-bold uppercase tracking-[0.2em] text-[#e57373] transition-all duration-300 hover:bg-[#4a2d2d] hover:border-[#e57373]/50 hover:-translate-y-0.5 focus:outline-none focus:ring-4 focus:ring-[#e57373]/20"
            >
              Delete
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default CategoryForm;