import axios from 'axios';

const TRANSLATE_API_KEY = import.meta.env.VITE_TRANSLATE_API_KEY;

export const translate = async (
  text: string,
  targetLanguage: string | null,
) => {
  const response = await axios.post(
    `https://translation.googleapis.com/language/translate/v2?key=${TRANSLATE_API_KEY}`,
    {
      q: text,
      target: targetLanguage,
    },
  );
  return response.data.data.translations[0].translatedText;
};

export const translates = async (
  texts: string[],
  targetLanguage: string | null,
) => {
  const response = await axios.post(
    `https://translation.googleapis.com/language/translate/v2?key=${TRANSLATE_API_KEY}`,
    {
      q: texts, // 문자열 배열을 보냅니다.
      target: targetLanguage,
    },
  );
  return response.data.data.translations.map((t: any) => t.translatedText);
};
