import { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import ClickOutside from '../ClickOutside';
import languages from '../Dropdowns/languages';
import { get, map } from 'lodash';
import i18n from '../../i18n';
import { useRecoilState } from 'recoil';
import { selectLanguageState } from '../../store/selectLanguageAtom';

const SimpleDropdownLanguage = () => {
  const languageRef = useRef<null | HTMLDivElement>(null);
  const [selectedLanguage, setSelectedLanguage] =
    useRecoilState(selectLanguageState);
  const [isLanguageMenuOpen, setLanguageMenuOpen] = useState<boolean>(false);

  // 외부 클릭 시 닫기
  const handleUserClose = useCallback(
    (e: any) => {
      if (
        isLanguageMenuOpen &&
        languageRef.current !== null &&
        !languageRef.current.contains(e.target)
      )
        setLanguageMenuOpen(false);
    },
    [isLanguageMenuOpen],
  );

  useEffect(() => {
    document.addEventListener('click', handleUserClose);
    return () => document.removeEventListener('click', handleUserClose);
  }, [handleUserClose]);

  // useEffect(() => {
  //   const currentLanguage: any = localStorage.getItem("I18N_LANGUAGE");
  //   setSelectedLang(currentLanguage);
  // }, []);

  const changeLanguageAction = (lang: string) => {
    //set language as i18n
    i18n.changeLanguage(lang);
    // localStorage.setItem("I18N_LANGUAGE", lang);
    setSelectedLanguage(lang);
    setLanguageMenuOpen(false);
  };

  return (
    <ClickOutside
      onClick={() => setLanguageMenuOpen(false)}
      className="relative"
    >
      <Link
        onClick={() => {
          setLanguageMenuOpen(!isLanguageMenuOpen);
        }}
        to="#"
        className="relative flex h-8.5 w-8.5 items-center justify-center rounded-full border-[0.5px] border-stroke bg-teal-400 hover:text-primary dark:border-strokedark dark:bg-meta-4 dark:text-white"
      >
        <img
          src={get(languages, `${selectedLanguage}.flag`)}
          alt="dashonic"
          className="h-3.5"
        />
      </Link>

      {isLanguageMenuOpen && (
        <div
          className={`absolute left-0 z-10 mt-2.5 flex rounded border border-stroke bg-teal-300 opacity-90 shadow-default dark:border-strokedark dark:bg-boxdark sm:right-0 sm:w-80`}
        >
          <div className="h-auto overflow-y-auto sm:flex">
            {map(Object.keys(languages), (key) => (
              <div
                key={key}
                onClick={() => changeLanguageAction(key)}
                className={`notify-item flex w-20 cursor-pointer justify-center gap-3 border-t border-stroke px-3 py-2 hover:bg-teal-400 dark:border-strokedark dark:hover:bg-meta-4 ${
                  selectedLanguage === key ? 'active' : 'none'
                }`}
              >
                <div>
                  <div className="flex justify-center">
                    <img
                      src={get(languages, `${key}.flag`)}
                      alt="dashonic"
                      className="mt-0.5 h-5"
                    />
                  </div>
                  {/* <p className="text-sm text-black">
                    {get(languages, `${key}.label`)}
                  </p> */}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </ClickOutside>
  );
};

export default SimpleDropdownLanguage;
