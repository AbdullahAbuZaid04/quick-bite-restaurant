import { useState, useEffect, useCallback } from "react";
import { getDashboardApi } from "../api/dashboardService";

export function useDashboard() {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [dashboardError, setDashboardError] = useState(null);

  const fetchDashboard = useCallback(async () => {
    setIsLoading(true);
    setDashboardError(null);
    try {
      const result = await getDashboardApi();
      if (result.success) {
        setData(result.data);
      } else {
        setDashboardError(result.message || 'Failed to load dashboard data');
      }
    } catch (error) {
      setDashboardError(error.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  return {
    data,
    isLoading,
    dashboardError,
    refetchDashboard: fetchDashboard
  };
}
