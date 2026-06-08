import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001/api";

export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: fetchBaseQuery({
    baseUrl: apiUrl,
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

export type DashboardSummary = {
  revenue: number;
  orders: number;
  customers: number;
  lowStockProducts: number;
};

export const { useGetDashboardSummaryQuery } = baseApi;
