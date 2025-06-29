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
import { useAccounts } from "../../../hooks/useAccount";

ChartJS.register(
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
);

const roleMap = {
  VT000002: "Nhân viên",
  VT000003: "Công ty sự kiện",
  VT000004: "Người dùng",
};

const roleColors = {
  VT000002: "#43A047",
  VT000003: "#863093",
  VT000004: "#009FDA",
};

export default function TaiKhoanChart() {
  const { data: accounts = [], isLoading, isError } = useAccounts();

  const chartData = useMemo(() => {
    if (!accounts || accounts.length === 0) return null;

    const now = new Date();
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(now.getMonth() - 5);

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
        VT000002: 0,
        VT000003: 0,
        VT000004: 0,
      };
    }

    accounts.forEach((acc) => {
      const d = new Date(acc.ngayTao);
      const key = `${d.getFullYear()}-${(d.getMonth() + 1)
        .toString()
        .padStart(2, "0")}`;
      if (monthMap[key] && roleMap[acc.maVaiTro]) {
        monthMap[key][acc.maVaiTro]++;
      }
    });

    const labels = Object.values(monthMap).map((m) => m.label);

    const datasets = Object.keys(roleMap).map((roleKey) => ({
      label: roleMap[roleKey],
      data: Object.values(monthMap).map((m) => m[roleKey]),
      borderColor: roleColors[roleKey],
      backgroundColor: roleColors[roleKey],
      tension: 0.4,
      fill: false,
      borderWidth: 1,
    }));

    return {
      labels,
      datasets,
    };
  }, [accounts]);

  if (isLoading) return <p>Đang tải...</p>;
  if (isError || !chartData)
    return <p style={{ color: "red" }}>Lỗi khi tải dữ liệu.</p>;

  const options = {
    responsive: true,
    plugins: { legend: { position: "bottom" } },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { stepSize: 1 },
      },
    },
  };

  return (
    <div style={{ width: "100%" }}>
      <Line
        data={chartData}
        options={options}
        style={{ width: "100%", height: "auto" }}
      />
    </div>
  );
}
