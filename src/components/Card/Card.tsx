// export const sizeType = { SMALL: 'sm', MEDIUM: 'md', LARGE: 'lg' };

interface CardProps {
  id: string; // node 요소별 id
  titleUse?: boolean; // 제목 사용 여부 - 옵션을 넣지 않았을 시 기본값은 true
  titleType?: 'type1' | 'type2'; // 제목 표시 타입 - 옵션을 넣지 않았을 시 기본값은 type1
  title?: string; // 제목명
  subTitle?: string; // 서브제목명. titleType이 type2일때 필수
  buttonArea?: React.ReactNode; // Card내에 들어갈 버튼 에어리어 (또다른 컴포넌트 사용가능)
  size?: 'sm' | 'md' | 'lg'; // Card의 size (풀스크린 (1280px이상) 기준) - 'sm', 'md', 'lg' 사용가능, 옵션을 넣지 않았을시 기본값은 'lg'
  childrenPxUse?: boolean;
  children: React.ReactNode; // Card내에 들어갈 요소 (또다른 컴포넌트 사용가능)
}

const Card: React.FC<CardProps> = ({
  id,
  titleUse = true,
  titleType = 'type1',
  title,
  subTitle = '',
  size = 'lg',
  buttonArea = <></>,
  childrenPxUse = true,
  children,
}: CardProps) => {
  // 런타임 검증: titleUse가 true이고 titleType이 'type2'일 때 subTitle이 없으면 오류 발생
  if (titleUse && titleType === 'type2' && !subTitle) {
    throw new Error(
      "'subTitle'은 필수입니다. : 'titleUse'를 사용하며 'titleType'이 'type2'일때",
    );
  }

  let genratedSizeClass = '';

  switch (size) {
    case 'sm':
      genratedSizeClass = 'xl:col-span-4'; // 1/3 size
      break;
    case 'md':
      genratedSizeClass = 'xl:col-span-8'; // 1/2 size
      break;
    case 'lg':
      genratedSizeClass = ''; // 1/1 size
      break;
    default:
      throw new Error(
        "'size'가 올바르지 않습니다. : 'size'는 'sm','md','lg' 만 선택할 수 있습니다.",
      );
  }

  return (
    <div
      id={id}
      className={`col-span-12 flex min-h-100 flex-col gap-2 rounded-sm border border-stroke bg-white py-4 shadow-default dark:border-strokedark dark:bg-boxdark ${genratedSizeClass}`}
    >
      {titleUse && (
        <div
          className={`
          ${
            titleType === 'type2'
              ? `flex items-baseline justify-start`
              : `flex min-h-15 items-center justify-between px-7`
          }`}
        >
          {titleType === 'type1' ? (
            <h3 className="text-xl font-semibold text-black dark:text-white">
              {title}
            </h3>
          ) : (
            titleType === 'type2' && (
              <>
                <h3 className="text-lg font-semibold text-black dark:text-white">
                  {title}
                </h3>
                <span className="text-gray-200 pl-2 text-miniTitle-sm">
                  {subTitle}
                </span>
              </>
            )
          )}
          <div className="flex items-center gap-3">{buttonArea}</div>
        </div>
      )}
      <div className={`${childrenPxUse ? 'px-7' : ''} flex h-full flex-col`}>
        {children}
      </div>
    </div>
  );
};

export default Card;
