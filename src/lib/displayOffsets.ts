/** 展示层口径：在接口返回值基础上叠加的历史缺口（上线前未入库数据） */
export const DISPLAY_OFFSET = {
  cumulativeCheckIns: 145,
  totalRevenue: 57_610,
  homestayRevenue: 57_610,
} as const;

export function withDisplayOffset(
  value: number | undefined,
  offset: number,
): number {
  const base = value ?? 0;
  if (Number.isNaN(base)) return offset;
  return base + offset;
}
