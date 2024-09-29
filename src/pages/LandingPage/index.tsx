import { useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment, GizmoHelper, GizmoViewport } from "@react-three/drei";
import TimerPage from "../TimerPage/index";
import AnalyticsPage from "../AnalyticsPage";
import Mainland from "../../models/Mainland";
import GamePage from "../GamePage/index";
import Igloo from "../../models/Igloo";
import FloatingIce from "../../models/floatingIce";
import Analytics from "../../models/AnalyticsCube";
import OceanModel from "../../models/OceanModel";
import CameraController from "./CameraController";
import ResponsiveAppBar from "../../components/Header/ResponsiveAppBar";
import { useAnalyticsStore } from "../../store/analyticsStore";
import { useLast30DaysFocusDurationStore } from "../../store/last30DaysFocusDurationStore";
import TimerDisplay from "../TimerPage/TimerDisplay";

import Sign from "../LandingPage/Sign";
import SignInstructions from "../LandingPage/SignInstructions";

import Snowflakes from "./Snowflakes";

const LandingPage = () => {
  const [targetPosition, setTargetPosition] = useState<
    [number, number, number]
  >([-50, 12, -150]);
  const [lookAtPosition, setLookAtPosition] = useState<
    [number, number, number]
  >([0, 0, 0]);
  const [page, setPage] = useState<
    "timer" | "analytics" | "game" | "SignInstructions" | null
  >(null);

  const { analyticsList } = useAnalyticsStore();
  const { setLast30DaysFocusDuration, last30DaysFocusDuration } =
    useLast30DaysFocusDurationStore();

  useEffect(() => {
    if (analyticsList.length > 0) {
      setLast30DaysFocusDuration(analyticsList);
    }
  }, [analyticsList, setLast30DaysFocusDuration]);

  const handleCloseInstructions = () => {
    setPage(null);
  };

  return (
    <>
      <ResponsiveAppBar
        pages={["Timer", "Game", "Analytics"]}
        setPage={setPage}
        setTargetPosition={setTargetPosition}
        setLookAtPosition={setLookAtPosition}
      />
      {page === null ? (
        <div className="fixed z-10"></div>
      ) : (
        <div className="fixed z-10 w-full h-full">
          {/* //TODO:頁面的透明度  */}
          {page === "timer" && <TimerPage />}
          {page === "analytics" && <AnalyticsPage />}
          {page === "SignInstructions" && (
            <SignInstructions
              showInstructions={true}
              last30DaysFocusDuration={last30DaysFocusDuration}
              onClose={handleCloseInstructions}
            />
          )}
        </div>
      )}
      <Canvas>
        {/* //TODO:黑夜模式 */}
        <Environment preset="warehouse" />
        <GamePage />
        <Mainland position={[-16, 2, 0]} />
        <Snowflakes />

        <Igloo
          position={[-114, 2, -16]}
          onClick={() => {
            setTargetPosition([-40, 12, -50]);
            setLookAtPosition([-4, 2, -16]);
            setPage("timer");
          }}
        />
        <FloatingIce position={[0, 2, -30]} />
        <Analytics
          position={[0, 2, 0]}
          onClick={() => {
            setPage("analytics");
            setTargetPosition([-105, 25, 100]);
            setLookAtPosition([250, 0, 0]);
          }}
        />

        <Sign
          position={[0, 20, 0]}
          onClick={() => {
            setPage("SignInstructions");
            setTargetPosition([10, 20, 10]);
            setLookAtPosition([0, 20, 0]);
          }}
        />

        <CameraController
          targetPosition={targetPosition}
          lookAtPosition={lookAtPosition}
        />
        <OceanModel position={[0, 0, 0]} />

        <GizmoHelper alignment="bottom-right" margin={[100, 100]}>
          <GizmoViewport labelColor="white" axisHeadScale={1} />
        </GizmoHelper>
      </Canvas>

      <TimerDisplay />
    </>
  );
};

export default LandingPage;
