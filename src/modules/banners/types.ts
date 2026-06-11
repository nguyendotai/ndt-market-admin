export type BannerStatus = "ACTIVE" | "INACTIVE";
export type BannerPosition =
  | "HOME_TOP"
  | "HOME_MIDDLE"
  | "CATEGORY"
  | "POPUP"
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
  isActive?: boolean;
  sortOrder: number;
};

export type BannerFormPayload = {
  title: string;
  imageUrl: string;
  linkUrl: string;
  position: BannerPosition;
  startDate: string;
  endDate: string;
  status: BannerStatus;
  sortOrder: number;
};
