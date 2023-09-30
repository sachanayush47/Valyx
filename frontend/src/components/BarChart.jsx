import React from "react";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";
import { Line, Bar } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);
export const options = {
    responsive: true,
};

export default function BarChart({ data }) {
    return <Bar options={options} data={data} />;
}
