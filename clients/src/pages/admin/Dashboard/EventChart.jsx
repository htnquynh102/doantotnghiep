import { useMemo } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import { useEvents } from "../../../hooks/useEvent";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

export default function SuKienChart({ monthRange }) {
  const { data: events = [], isLoading, isError } = useEvents();

  console.log(monthRange);

  const chartData = useMemo(() => {
    if (!events || events.length === 0) return null;

    const now = new Date();
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(now.getMonth() - (monthRange - 1));

    const recentEvents = events.filter((event) => {
      const d = new Date(event.ngayDangKy);
      return d >= sixMonthsAgo && d <= now;
    });

    const monthMap = {};
    for (let i = 0; i < monthRange; i++) {
      const temp = new Date(sixMonthsAgo);
      temp.setMonth(sixMonthsAgo.getMonth() + i);
      const key = `${temp.getFullYear()}-${(temp.getMonth() + 1)
        .toString()
        .padStart(2, "0")}`;
      const label = `${temp.getMonth() + 1}/${temp.getFullYear()}`;
      monthMap[key] = { label, choDuyet: 0, daDuyet: 0, khongDuyet: 0 };
    }

    recentEvents.forEach((event) => {
      const d = new Date(event.ngayDangKy);
      const key = `${d.getFullYear()}-${(d.getMonth() + 1)
        .toString()
        .padStart(2, "0")}`;
      const status = event.trangThaiDuyet;

      if (!monthMap[key]) return;
      if (status === 0) monthMap[key].choDuyet++;
      else if (status === 1) monthMap[key].daDuyet++;
      else if (status === 2) monthMap[key].khongDuyet++;
    });

    const labels = Object.values(monthMap).map((m) => m.label);
    return {
      labels,
      datasets: [
        {
          label: "Chờ duyệt",
          data: Object.values(monthMap).map((m) => m.choDuyet),
          backgroundColor: "#f0ad4e",
          stack: "stack1",
          borderRadius: 10,
          borderSkipped: false,
          barThickness: 30,
        },
        {
          label: "Đã duyệt",
          data: Object.values(monthMap).map((m) => m.daDuyet),
          backgroundColor: "#009fda",
          stack: "stack1",
          borderRadius: 10,
          borderSkipped: false,
          barThickness: 30,
        },
        {
          label: "Không duyệt",
          data: Object.values(monthMap).map((m) => m.khongDuyet),
          backgroundColor: "#ccc",
          stack: "stack1",
          borderRadius: 10,
          borderSkipped: false,
          barThickness: 30,
        },
      ],
    };
  }, [events, monthRange]);

  if (isLoading) {
    return <p>Đang tải...</p>;
  }

  if (isError || !chartData) {
    return <p style={{ color: "red" }}>Lỗi khi tải hoặc xử lý dữ liệu.</p>;
  }

  const options = {
    responsive: true,
    plugins: { legend: { position: "bottom" } },
    scales: {
      x: {
        stacked: true,
        grid: {
          display: false,
        },
      },
      y: {
        stacked: true,
        beginAtZero: true,
        ticks: { stepSize: 1 },
      },
    },
  };

  return (
    <div style={{ width: "100%" }}>
      <Bar
        data={chartData}
        options={options}
        style={{ width: "100%", height: "auto" }}
      />
    </div>
  );
}
