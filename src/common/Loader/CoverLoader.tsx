// 조건에 따라 originView를 보여주는 Loader
const CoverLoader = ({
  originView,
  condition,
}: {
  originView: JSX.Element;
  condition: boolean;
}) => {
  return condition ? (
    <div className="flex h-screen items-center justify-center bg-transparent opacity-80">
      <div className="h-16 w-16 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent"></div>
    </div>
  ) : (
    originView
  );
};

export default CoverLoader;
