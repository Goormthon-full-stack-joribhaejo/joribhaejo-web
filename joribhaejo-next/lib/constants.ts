import { Category } from "./types";

export const categoryLabels: Record<Category, string> = {
  [Category.WEB]: "웹 개발",
  [Category.MOBILE]: "모바일",
  [Category.BACK]: "백엔드",
  [Category.HARD]: "하드웨어",
  [Category.AI]: "AI/ML",
  [Category.NETWORK]: "네트워크",
  [Category.SECURITY]: "보안",
  [Category.DEVOPS]: "DevOps",
  [Category.ETC]: "기타",
};