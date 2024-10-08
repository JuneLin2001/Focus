import React from "react";
import { UserAnalytics } from "../../types/type";
import dayjs from "dayjs";
import { Card } from "@/components/ui/card";

interface CompletedTodosProps {
  filteredAnalytics: UserAnalytics[];
}

const CompletedTodos: React.FC<CompletedTodosProps> = ({
  filteredAnalytics,
}) => {
  const completedTodosCount = filteredAnalytics.reduce(
    (acc, analytics) => acc + analytics.todos.length,
    0
  );

  const hasData = completedTodosCount > 0;

  return (
    <>
      {hasData && (
        <h2 className="font-semibold mb-2 text-gray-800 dark:text-white">
          總共完成了 {completedTodosCount} 個 Todo
        </h2>
      )}
      <div className="h-full max-h-[60vh] overflow-y-auto">
        {hasData ? (
          <>
            {filteredAnalytics.map((analytics, index) => {
              if (analytics.todos.length > 0) {
                return (
                  <Card
                    key={index}
                    className="border border-gray-300 rounded-lg mb-4 bg-gray-100 dark:bg-gray-500 p-4"
                  >
                    <div className="space-y-2">
                      {analytics.todos.map((todo) => (
                        <div
                          key={todo.id}
                          className="border-b border-gray-300 dark:border-gray-600 py-2 last:border-b-0"
                        >
                          <h3 className="font-semibold text-gray-800 dark:text-white">
                            {todo.title}
                          </h3>
                          <p className="text-gray-600 dark:text-gray-400 text-sm">
                            {`完成時間：${
                              todo.doneTime
                                ? dayjs(todo.doneTime.toDate()).format(
                                    "MM-DD HH:mm"
                                  )
                                : "error"
                            }`}
                          </p>
                        </div>
                      ))}
                    </div>
                  </Card>
                );
              }
              return null;
            })}
          </>
        ) : (
          <div className="w-full h-full flex-1 flex justify-center items-center">
            <p className="text-gray-500 text-center">沒有完成的 Todos</p>
          </div>
        )}
      </div>
    </>
  );
};

export default CompletedTodos;
