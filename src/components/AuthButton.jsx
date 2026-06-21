const AuthButton = ({ children, loading, ...props }) => {
  return (
    <button
      {...props}
      disabled={loading || props.disabled}
      className={`w-full rounded-lg bg-[#d4a544] p-3 text-[11px] font-bold uppercase tracking-[0.22em] text-[#080808] transition-opacity disabled:cursor-not-allowed disabled:opacity-70 ${props.className || ""}`}
    >
      {loading ? "Please wait..." : children}
    </button>
  );
};

export default AuthButton;
