import { useState, useEffect } from 'react';

const CountdownTimer = ({ reset, isActive, setIsActive }: any) => {
  const [timeLeft, setTimeLeft] = useState(180); // 3분 (180초)으로 초기화

  useEffect(() => {
    setTimeLeft(180); // 3분으로 초기화
    setIsActive(true); // 타이머 시작
  }, [reset]);

  useEffect(() => {
    if (!isActive) return; // 타이머가 활성화된 경우만 동작

    const countdown = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(countdown); // 시간이 0이 되면 카운트다운 정지
          setIsActive(false); // 타이머 비활성화
          return 0;
        }
        return prevTime - 1; // 1초씩 감소
      });
    }, 1000);

    return () => clearInterval(countdown); // 컴포넌트 언마운트 시 interval 정리
  }, [isActive]);

  // 분과 초로 변환
  const minutes = String(Math.floor(timeLeft / 60)).padStart(2, '0');
  const seconds = String(timeLeft % 60).padStart(2, '0');

  return <span className="text-red-500">{`${minutes}:${seconds}`}</span>;
};

export default CountdownTimer;
