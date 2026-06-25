declare module "react-apexcharts" {
  import type { ComponentType } from "react";
  import type { ApexOptions } from "apexcharts";

  export interface Props {
    type?: "line" | "area" | "bar" | "pie" | "donut" | "radialBar" | "scatter";
    series: unknown[];
    options?: ApexOptions;
    height?: number | string;
    width?: number | string;
  }

  const Chart: ComponentType<Props>;
  export default Chart;
}
