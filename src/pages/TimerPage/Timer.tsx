import { useEffect, useState } from "react";
import {
  CircularProgressbarWithChildren,
  buildStyles,
} from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { useTimerStore } from "../../store/timerStore";
import {
  DefaultButton,
  ResetButton,
  AddOrSubtractButton,
} from "../../components/Button";
import LoginButton from "../../components/LoginButton";
import { requestNotificationPermission } from "../../utils/NotificationService";

const Timer = () => {
  const {
    secondsLeft,
    isPaused,
    mode,
    inputMinutes,
    startTimer,
    resetTimer,
    addFiveMinutes,
    minusFiveMinutes,
    setInputMinutes,
    setTimer,
    showLoginButton,
    toggleLoginButton,
  } = useTimerStore();

  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    requestNotificationPermission();
  }, []);

  const handleStartTimer = () => {
    startTimer();
    setIsEditing(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isPaused) {
      const value = e.target.value;
      const numericValue = parseInt(value);

      if (!isNaN(numericValue)) {
        const clampedValue = Math.min(Math.max(numericValue, 1), 120);
        setInputMinutes(clampedValue);
        setTimer(clampedValue);
      }
    }
  };

  const handleInputClick = () => {
    if (isPaused) {
      setIsEditing(true);
    }
  };

  const handleInputBlur = () => {
    setIsEditing(false);
  };

  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <div>
        <CircularProgressbarWithChildren
          value={
            mode === "work"
              ? (secondsLeft / (inputMinutes * 60)) * 100
              : (secondsLeft / (5 * 60)) * 100
          }
          styles={buildStyles({
            textColor: "#000",
            pathColor: mode === "work" ? "blue" : "green",
            trailColor: "#d6d6d6",
          })}
        >
          {isPaused && (
            <AddOrSubtractButton onClick={addFiveMinutes} disabled={!isPaused}>
              +
            </AddOrSubtractButton>
          )}

          <div className="flex items-center">
            {isEditing ? (
              <input
                type="text"
                value={`${Math.floor(secondsLeft / 60)}`}
                onChange={handleInputChange}
                disabled={!isPaused}
                className="text-5xl border-4 border-black w-24 bg-transparent focus:outline-none text-center"
                onBlur={handleInputBlur}
              />
            ) : (
              <div
                className="text-5xl cursor-pointer"
                onClick={handleInputClick}
              >
                {`${Math.floor(secondsLeft / 60)}:${secondsLeft % 60 < 10 ? "0" + (secondsLeft % 60) : secondsLeft % 60}`}
              </div>
            )}
          </div>
          {isPaused && (
            <AddOrSubtractButton
              onClick={minusFiveMinutes}
              disabled={!isPaused}
            >
              -
            </AddOrSubtractButton>
          )}
        </CircularProgressbarWithChildren>
        <div className="mt-5 flex justify-center">
          {isPaused ? (
            <DefaultButton onClick={handleStartTimer}>開始</DefaultButton>
          ) : mode === "break" ? (
            <ResetButton onClick={resetTimer}>跳過休息</ResetButton>
          ) : (
            <ResetButton onClick={resetTimer}>放棄</ResetButton>
          )}
        </div>

        {showLoginButton && (
          <div className="flex justify-center items-center bg-gray-800 bg-opacity-50 fixed inset-0">
            <div className="bg-white p-5 rounded shadow-lg">
              <h2 className="text-xl mb-4">請登入以保存數據</h2>
              <LoginButton onLoginSuccess={toggleLoginButton} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Timer;
