import { t } from 'i18next';
import { useRef } from 'react';
import { useRecoilValue } from 'recoil';
import { loggedInUserState } from '../store/loggedInUserAtom';
import { usableLanguagesState } from '../store/usableLanguagesAtom';
import { getCurrentDateDetails } from '../hooks/getStringedDate';
import { postChatData, postData } from '../api';

interface ChattingInputProp {
  setChatData: any;
  browserDB: any;
  addChat: any;
  getAllChats: any;
  scrollToBottom: () => void;
}

const ChattingInput: React.FC<ChattingInputProp> = ({
  setChatData,
  browserDB,
  addChat,
  getAllChats,
  scrollToBottom,
}) => {
  const loggedInUser = useRecoilValue(loggedInUserState);
  const usableLanguages = useRecoilValue(usableLanguagesState);

  const chatMessageInput = useRef<HTMLInputElement>(null);

  const handleKeyDown = (event: any) => {
    if (event.key === 'Enter' && chatMessageInput && chatMessageInput.current) {
      event.preventDefault(); // 기본 동작(예: 폼 제출)을 방지
      sendMessage();
      chatMessageInput.current.value = ''; // 입력 초기화
    }
  };

  const sendMessage = async () => {
    const message = chatMessageInput.current?.value || '';

    const newChatData = {
      sender: loggedInUser?.email,
      time: `${getCurrentDateDetails(usableLanguages).date.fullDate} ${getCurrentDateDetails(usableLanguages).time}`,
      message,
      to: 'chatbot',
    };
    addChat(browserDB, newChatData).then(() => {
      getAllChats(browserDB).then((allChats: any) => {
        try {
          setChatData(allChats);
        } catch (error) {
        } finally {
          scrollToBottom();
          recieveMessage(message);
        }
      });
    });
  };

  const recieveMessage = async (question: string) => {
    try {
      const questionData = {
        companyId: loggedInUser?.companyId,
        question,
      };
      const response = await postChatData('/chatbot', questionData);

      const answerData = {
        sender: 'chatbot',
        time: `${getCurrentDateDetails(usableLanguages).date.fullDate} ${getCurrentDateDetails(usableLanguages).time}`,
        message: response.data.response,
        to: loggedInUser?.email,
      };
      addChat(browserDB, answerData).then(() => {
        getAllChats(browserDB).then((allChats: any) => {
          try {
            // 현재 사용자와 관련된 chatting Data만 가져옴
            setChatData(
              allChats.filter((a: any) => {
                if (a.sender === 'chatbot') {
                  return a.to === loggedInUser?.email;
                } else if (a.sender === loggedInUser?.email) {
                  return a.to === 'chatbot';
                }
              }),
            );
          } catch (error) {
          } finally {
            setTimeout(() => {
              scrollToBottom();
            }, 100);
          }
        });
      });
    } catch (error) {}
  };

  return (
    <>
      <input
        name="chatMessage"
        ref={chatMessageInput}
        onKeyDown={handleKeyDown} // 엔터 키 감지
        type="text"
        placeholder={t('Please enter your question.')}
        className="h-13 w-full rounded-md border border-stroke bg-gray px-5 text-black placeholder-body outline-none focus:border-primary dark:border-strokedark dark:bg-boxdark-2 dark:text-white"
      />
      {/* <button
        className="flex h-13 w-2/12 items-center justify-center rounded-md bg-primary text-white hover:bg-opacity-90"
        onClick={() => {
          sendMessage();
        }}
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M22 2L11 13"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M22 2L15 22L11 13L2 9L22 2Z"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button> */}
    </>
  );
};

export default ChattingInput;
