# DAO 龙潭数据概览前端

基于 `Vite + React + TypeScript + ECharts` 的后台数据看板，展示 DAO 龙潭运营核心指标。

## 功能模块

- 累计经营数据（总收入、民宿收入、活动收入、累计云租金）
- 成员申请统计（数字游民、共创人、老村民、新村民）
- 民宿入住统计（累计旅居人次、平均入住天数）
- 活动数据概览（活动总场次、报名总人次、活动列表）
- 空间使用统计（柱状图）
- 经营分析（营业额与利润趋势）
- 民宿营收统计（柱状 + 折线）

## 技术栈

- React 19
- TypeScript
- Vite 6
- Tailwind CSS v4
- ECharts (`echarts-for-react`)

## 运行方式

```bash
npm install
npm run dev
```

默认开发地址：`http://localhost:5173`

构建产物：

```bash
npm run build
```

## 环境变量

项目固定请求域名为 `https://daolongtan.cn`，默认无需配置任何环境变量。

参考 `.env.example`（可提交），`.env` 已被 `.gitignore` 忽略（不会上传）。

## 接口清单

请求前缀：`https://daolongtan.cn/daolongtan/openapi/homepage`

1. `GET /month-stats`
   - 累计经营数据
2. `GET /member-apply-overview`
   - 成员申请统计
   - 数字游民申请数 = `digitalNomadUserApplyTotal + digitalNomadFormApplyTotal`
   - 数字游民通过数 = `digitalNomadUserApplyApproved + digitalNomadFormApplyApproved`
3. `GET /activity-data-overview`
   - 活动共场次：`validActivityCount`
   - 总报名人数：`totalRegistrationCount`
   - 列表字段：`title`、`spaceName`、`registrationCount`
4. `GET /space-usage-stats`
   - 使用 `spaceName` 与 `usageCount`
5. `GET /business-trend?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD&granularity=day`
   - 默认查询区间：当前日期往前一个月
   - 默认粒度：`day`
6. `GET /homestay-revenue-stats?limit=50`
   - 默认请求参数：`limit=50`
   - 支持数组结构，名称字段支持 `homestayName`
7. `GET /homestay-stay-overview`
   - 民宿入住统计（累计旅居人次、平均入住天数）

## 说明

- 活动列表默认可视约 10 条，超出后表体可滚动查看。
- 顶部“截至”日期优先用接口返回，若无返回则显示当前日期。
