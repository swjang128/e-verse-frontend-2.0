import React, { useEffect, useRef, useState } from 'react';
import ChatbotIcon from '../path/ChatbotIcon';
import { t } from 'i18next';
import ChatbotCounselorIcon from '../path/ChatbotCounselorIcon';
import { useRecoilValue } from 'recoil';
import { loggedInUserState } from '../store/loggedInUserAtom';
import ChattingInput from './ChattingInput';

const Chatbot: React.FC = () => {
  const loggedInUser = useRecoilValue(loggedInUserState);
  const [open, setOpen] = useState(false);
  const chatEndRef = useRef<any>(null);

  // chatting 저장소 = browser indexedDB
  const [browserDB, setBrowserDB] = useState();
  const [chatData, setChatData] = useState<any>([]);

  const openDatabase = () => {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('chatDB');

      request.onupgradeneeded = (event: any) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains('chats')) {
          db.createObjectStore('chats', {
            keyPath: 'chatId',
            autoIncrement: true,
          });
        }
      };

      request.onsuccess = (event: any) => {
        resolve(event.target.result);
      };

      request.onerror = (event: any) => {
        reject('IndexedDB error: ' + event.target.errorCode);
      };
    });
  };

  const getAllChats = (db: any) => {
    return new Promise((resolve, reject) => {
      const transaction = db.transaction('chats', 'readonly');
      const chatStore = transaction.objectStore('chats');

      const getAllRequest = chatStore.getAll();

      getAllRequest.onsuccess = () => {
        resolve(getAllRequest.result);
      };

      getAllRequest.onerror = (event: any) => {
        reject('Error getting data: ' + event.target.errorCode);
      };
    });
  };

  const addChat = (db: any, chatData: any) => {
    return new Promise((resolve, reject) => {
      const transaction = db.transaction('chats', 'readwrite');
      const chatStore = transaction.objectStore('chats');

      const addRequest = chatStore.add(chatData);

      addRequest.onsuccess = () => {
        resolve('Data added successfully');
      };

      addRequest.onerror = (event: any) => {
        reject('Error adding data: ' + event.target.errorCode);
      };
    });
  };

  // 스크롤을 맨 아래로 내리는 함수
  const scrollToBottom = () => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const initChatData = () => {
    if (loggedInUser) {
      openDatabase().then((db: any) => {
        setBrowserDB(db);
        getAllChats(db).then((allChats: any) => {
          try {
            // 현재 사용자와 관련된 chatting Data만 가져옴
            setChatData(
              allChats.filter((a: any) => {
                if (a.sender === 'chatbot') {
                  return a.to === loggedInUser.email;
                } else if (a.sender === loggedInUser.email) {
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
    }
  };

  return (
    <>
      <div className="grid-row fixed bottom-0 right-10 z-10 grid gap-2 transition-all duration-300 ease-in-out">
        <div
          className={`${open === true ? '' : 'hidden'} border border-l border-t border-l-primary border-t-primary bg-whiten shadow-8`}
        >
          <div className="flex items-center justify-center gap-2 border-b border-stroke bg-white px-4 py-5">
            <span>
              <ChatbotCounselorIcon />
            </span>
            <h3 className="text-center text-title-lg text-black">
              E-VERSE CHAT
            </h3>
          </div>
          <div className="no-scrollbar grid-row grid max-h-100 w-150 gap-4 space-y-3.5 overflow-auto px-6 py-7.5">
            <div className="flex w-full justify-start">
              <div className="grid-row grid w-8/12 gap-2">
                <div className="flex items-end gap-2">
                  <span className="font-semibold text-e_green">CHATBOT</span>
                  {/* <span className="text-xs">{chat.time}</span> */}
                </div>
                <div className="rounded-2xl rounded-tl-none bg-white px-5 py-3 dark:bg-boxdark-2">
                  <span>
                    {t(
                      'Your subscription has been confirmed. You can use Chatbot.',
                    )}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex w-full justify-start">
              <div className="grid-row grid w-8/12 gap-2">
                <div className="flex items-end gap-2">
                  <span className="font-semibold text-e_green">CHATBOT</span>
                  {/* <span className="text-xs">{chat.time}</span> */}
                </div>
                <div className="rounded-2xl rounded-tl-none bg-white px-5 py-3 dark:bg-boxdark-2">
                  <span>
                    {t(
                      'Welcome. What are you curious about? Please enter your question.',
                    )}
                  </span>
                </div>
              </div>
            </div>
            {chatData &&
              chatData.map((chat: any) => {
                return chat.sender === 'chatbot' ? (
                  <div className="flex w-full justify-start">
                    <div className="grid-row grid w-8/12 gap-2">
                      <div className="flex items-end gap-2">
                        <span className="font-semibold text-e_green">
                          CHATBOT
                        </span>
                        <span className="text-xs">{chat.time}</span>
                      </div>
                      <div className="rounded-2xl rounded-tl-none bg-white px-5 py-3 dark:bg-boxdark-2">
                        <span>{chat.message}</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex w-full justify-end">
                    <div className="grid-row max-w-8/12 grid gap-2">
                      <div className="flex items-end justify-end gap-2">
                        {/* <span className="font-semibold text-black">
                          {loggedInUser?.name}
                        </span> */}
                        <span className="text-xs">{chat.time}</span>
                      </div>
                      <div className="rounded-2xl rounded-tr-none bg-primary px-5 py-3 text-white">
                        <span className="block max-w-full text-wrap break-words">
                          {chat.message}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            <div ref={chatEndRef}></div>
          </div>
          <div className="sticky bottom-0 right-0 border-t border-stroke bg-white px-6 py-5 dark:border-strokedark dark:bg-boxdark">
            <div className="relative flex w-full gap-2">
              <ChattingInput
                setChatData={setChatData}
                browserDB={browserDB}
                addChat={addChat}
                getAllChats={getAllChats}
                scrollToBottom={scrollToBottom}
              />
            </div>
          </div>
        </div>
        <div
          className={`${open === true ? 'hidden' : ''} cursor-pointer rounded-lg border bg-white p-5 shadow-8`}
          onClick={() => {
            initChatData();
            setOpen(!open);
          }}
        >
          <span className="text-black">
            {t('This is E-VERSE CHAT. How can I help you?')}
          </span>
        </div>
        <div className="grid justify-end">
          <button
            onClick={() => {
              initChatData();
              setOpen(!open);
            }}
          >
            <ChatbotIcon />
          </button>
        </div>
      </div>
    </>
  );
};

export default Chatbot;
