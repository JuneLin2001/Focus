import React, { useEffect, useState, useCallback } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";
import useAuthStore from "../../store/authStore";
import { useAnalyticsStore } from "../../store/analyticsStore";
import { UserAnalytics } from "../../types/type";
import dayjs from "dayjs"; // 用來處理日期
import { Bar } from "react-chartjs-2"; // 引入長條圖
import { ChartData } from "chart.js"; // 引入 ChartData 型別
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const AanalyticsPage: React.FC = () => {
  const { user } = useAuthStore();
  const {
    filteredAnalytics,
    setAnalyticsList,
    setFilteredAnalytics,
    setLast30DaysFocusDuration, // 新增
    last30DaysFocusDuration, // 新增
  } = useAnalyticsStore();

  const [filterType, setFilterType] = useState<string>("daily"); // "daily", "weekly", "monthly"
  const [totalFocusDuration, setTotalFocusDuration] = useState<number>(0); // 專注總時長
  const [currentDate, setCurrentDate] = useState(dayjs()); // 當前選中的日期，用 dayjs 來管理
  const [chartData, setChartData] = useState<ChartData<"bar">>({
    labels: [],
    datasets: [],
  });

  const calculateDateRange = useCallback(() => {
    let start, end;

    if (filterType === "daily") {
      start = currentDate.startOf("day");
      end = currentDate.endOf("day");
    } else if (filterType === "weekly") {
      start = currentDate.startOf("week");
      end = currentDate.endOf("week");
    } else if (filterType === "monthly") {
      start = currentDate.startOf("month");
      end = currentDate.endOf("month");
    }

    return { start, end };
  }, [filterType, currentDate]);

  useEffect(() => {
    if (user) {
      const fetchAnalytics = async () => {
        try {
          const analyticsCollectionRef = collection(
            db,
            "users",
            user.uid,
            "analytics"
          );
          const analyticsSnapshot = await getDocs(analyticsCollectionRef);

          if (!analyticsSnapshot.empty) {
            const data = analyticsSnapshot.docs.map((doc) =>
              doc.data()
            ) as UserAnalytics[];

            const sortedAnalytics = data.sort((a, b) =>
              a.startTime.seconds < b.startTime.seconds ? 1 : -1
            );

            setAnalyticsList(sortedAnalytics);
            setLast30DaysFocusDuration(); // 更新最近 30 天的專注時長

            const { start, end } = calculateDateRange();
            const filteredData = sortedAnalytics.filter((analytics) => {
              const analyticsDate = dayjs.unix(analytics.startTime.seconds);
              return (
                analyticsDate.isAfter(start) && analyticsDate.isBefore(end)
              );
            });

            setFilteredAnalytics(filteredData);

            const totalDuration = filteredData.reduce(
              (acc, analytics) => acc + analytics.focusDuration,
              0
            );
            setTotalFocusDuration(totalDuration);

            const chartLabels = filteredData.map((analytics) =>
              dayjs.unix(analytics.startTime.seconds).format("YYYY-MM-DD")
            );
            const chartFocusDurations = filteredData.map(
              (analytics) => analytics.focusDuration
            );

            setChartData({
              labels: chartLabels,
              datasets: [
                {
                  label: "專注時長（分鐘）",
                  data: chartFocusDurations,
                  backgroundColor: "rgba(75, 192, 192, 0.6)",
                },
              ],
            });
          }
        } catch (error) {
          console.error("Error fetching user analytics", error);
        }
      };

      fetchAnalytics();
    }
  }, [
    user,
    calculateDateRange,
    setAnalyticsList,
    setFilteredAnalytics,
    setLast30DaysFocusDuration,
  ]);

  const handlePrev = () => {
    if (filterType === "daily") {
      setCurrentDate(currentDate.subtract(1, "day"));
    } else if (filterType === "weekly") {
      setCurrentDate(currentDate.subtract(1, "week"));
    } else if (filterType === "monthly") {
      setCurrentDate(currentDate.subtract(1, "month"));
    }
  };

  const handleNext = () => {
    if (filterType === "daily") {
      setCurrentDate(currentDate.add(1, "day"));
    } else if (filterType === "weekly") {
      setCurrentDate(currentDate.add(1, "week"));
    } else if (filterType === "monthly") {
      setCurrentDate(currentDate.add(1, "month"));
    }
  };

  if (!user) {
    return <div className="p-96">Please login to see analytics.</div>;
  }

  return (
    <div className="p-96">
      <h2>Total Focus Duration: {totalFocusDuration} minutes</h2>
      <h2>
        Last 30 Days Total Focus Duration: {last30DaysFocusDuration} minutes
      </h2>{" "}
      {/* 新增 */}
      <div className="mt-4">
        <label>篩選方式:</label>
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="border border-gray-300 rounded p-2 ml-2"
        >
          <option value="daily">每日</option>
          <option value="weekly">每週</option>
          <option value="monthly">每月</option>
        </select>
      </div>
      <div className="mt-4 flex items-center">
        <button onClick={handlePrev} className="bg-gray-300 p-2 rounded-l">
          ←
        </button>
        <div className="px-4">
          {filterType === "daily"
            ? currentDate.format("YYYY-MM-DD")
            : filterType === "weekly"
              ? `${currentDate.startOf("week").format("YYYY-MM-DD")} - ${currentDate
                  .endOf("week")
                  .format("YYYY-MM-DD")}`
              : `${currentDate.format("YYYY-MM")}`}
        </div>
        <button onClick={handleNext} className="bg-gray-300 p-2 rounded-r">
          →
        </button>
      </div>
      {chartData && (
        <div className="mt-6">
          <Bar
            data={chartData}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  position: "top",
                },
                title: {
                  display: true,
                  text: `專注時長（${filterType === "daily" ? "每日" : filterType === "weekly" ? "每週" : "每月"}）`,
                },
              },
            }}
          />
        </div>
      )}
      <br />
      <h3>Completed Todos:</h3>
      <ul>
        {filteredAnalytics.length > 0 ? (
          filteredAnalytics.map((analytics, index) => (
            <li key={index}>
              <ul>
                {analytics.todos.length > 0
                  ? analytics.todos.map((todo) => (
                      <li key={todo.id}>{todo.title}</li>
                    ))
                  : ""}
              </ul>
            </li>
          ))
        ) : (
          <p>找不到資料：（</p>
        )}
      </ul>
    </div>
  );
};

export default AanalyticsPage;
