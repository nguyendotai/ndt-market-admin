import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import { env } from "@/configs/env";

export type DashboardSummary = {
  revenue: number;
  orders: number;
  customers: number;
  lowStockProducts: number;
};

export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: fetchBaseQuery({
    baseUrl: env.NEXT_PUBLIC_API_URL,
    prepareHeaders: (headers) => {
      headers.set("accept", "application/json");
      return headers;
    },
  }),
  tagTypes: ["Dashboard", "Orders", "Products", "Customers"],
  endpoints: (builder) => ({
    getDashboardSummary: builder.query<DashboardSummary, void>({
      query: () => "/dashboard/summary",
      providesTags: ["Dashboard"],
    }),
  }),
});

export const { useGetDashboardSummaryQuery } = baseApi;

