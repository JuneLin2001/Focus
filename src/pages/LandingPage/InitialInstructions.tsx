import React, { useEffect, useState } from "react";

interface InitialInstructionsProps {
  showInstructions: boolean;
  handleCloseInstructions: () => void;
}

const InitialInstructions: React.FC<InitialInstructionsProps> = ({
  showInstructions,
  handleCloseInstructions,
}) => {
  const [isVisible, setIsVisible] = useState(showInstructions);

  useEffect(() => {
    setIsVisible(showInstructions);
  }, [showInstructions]);

  const handleClose = () => {
    setIsVisible(false); // 隱藏組件
    handleCloseInstructions(); // 呼叫父組件的關閉函數
  };

  return (
    <>
      {isVisible && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: 40,
          }}
        >
          <div className="fixed inset-0 flex justify-center items-center bg-transparent z-40">
            <div className="bg-white p-5 rounded shadow-lg">
              <h2 className="text-xl mb-4">場景介紹</h2>
              <p className="mb-4">
                歡迎來到我們的互動場景！以下是一些關於場景的介紹：
              </p>
              <ul className="list-disc ml-5 mb-4">
                <li>您現在身處一個虛擬的環境中，充滿了各種互動元素。</li>
                <li>可以通過移動鏡頭來查看周圍的景觀和模型。</li>
                <li>點擊不同的物體可以觸發互動效果，例如計時器和遊戲。</li>
              </ul>

              <div className="flex justify-center">
                <button
                  className="bg-blue-500 text-white p-2 rounded"
                  onClick={handleClose}
                >
                  不再顯示
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default InitialInstructions;
