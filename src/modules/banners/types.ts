export type BannerStatus = "ACTIVE" | "INACTIVE";
export type BannerPosition =
  | "HOME_HERO"
  | "HOME_TOP"
  | "HOME_MIDDLE"
  | "HOME_BOTTOM"
  | "CATEGORY_TOP"
  | "PRODUCT_DETAIL"
  | string;

export type Banner = {
  _id?: string;
  id: string;
  title: string;
  imageUrl: string;
  linkUrl?: string | null;
  position: BannerPosition;
  startDate: string;
  endDate: string;
  status: BannerStatus;
  sortOrder: number;
};

export type BannerFormPayload = {
  title: string;
  imageUrl: string;
  linkUrl?: string;
  position: BannerPosition;
  startDate: string;
  endDate: string;
  status: BannerStatus;
  sortOrder: number;
};
