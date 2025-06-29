import { useMemo } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import { useAuth } from "../../../hooks/useAccount";
import { useEvents } from "../../../hooks/useEvent";

ChartJS.register(
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
);

export default function DoanhThuChart() {
  const { accountId } = useAuth();
  const { data: events = [], isLoading, isError } = useEvents(accountId);

  const chartData = useMemo(() => {
    if (!events || events.length === 0) return null;

    const now = new Date();
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(now.getMonth() - 5);

    // Khởi tạo 6 tháng gần nhất với doanh thu = 0
    const monthMap = {};
    for (let i = 0; i < 6; i++) {
      const temp = new Date(sixMonthsAgo);
      temp.setMonth(sixMonthsAgo.getMonth() + i);
      const key = `${temp.getFullYear()}-${(temp.getMonth() + 1)
        .toString()
        .padStart(2, "0")}`;
      const label = `${temp.getMonth() + 1}/${temp.getFullYear()}`;
      monthMap[key] = {
        label,
        total: 0,
      };
    }

    // Cộng dồn doanh thu vào từng tháng tương ứng
    events.forEach((event) => {
      const d = new Date(event.ngayDangKy);
      const key = `${d.getFullYear()}-${(d.getMonth() + 1)
        .toString()
        .padStart(2, "0")}`;
      const doanhThu = Number(event.tongDoanhThu) || 0;
      if (monthMap[key]) {
        monthMap[key].total += doanhThu;
      }
    });

    const labels = Object.values(monthMap).map((m) => m.label);
    const data = Object.values(monthMap).map((m) => m.total);

    return {
      labels,
      datasets: [
        {
          label: "Doanh thu theo tháng",
          data,
          borderColor: "#009FDA",
          backgroundColor: "#009FDA",
          tension: 0.4,
          fill: false,
          borderWidth: 2,
        },
      ],
    };
  }, [events]);

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "bottom" },
      tooltip: { mode: "index", intersect: false },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value) => value.toLocaleString() + " đ",
        },
      },
    },
  };

  if (isLoading) return <p>Đang tải...</p>;
  if (isError || !chartData)
    return <p style={{ color: "red" }}>Lỗi khi tải dữ liệu.</p>;

  return (
    <div style={{ width: "100%" }}>
      <Line data={chartData} options={options} />
    </div>
  );
}
