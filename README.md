# WeatherWheels Pro

基于 Vue 3 + TypeScript 的风场粒子可视化平台，支持 Cesium 三维地球与 OpenLayers 二维地图切换，实现 Windy 风格的粒子流动动画。

> **配套工具**：[grib2mcp](https://github.com/Xieyuha/grib2mcp) — 将 NOAA GFS GRIB2 文件转换为本项目所需的 JSON 风场格式。

---

## 效果预览

<!-- 建议放一张 GIF 或截图 -->
![alt text](demo.png)
---

## 快速开始

**前置条件**：Node.js ≥ 20.19、pnpm、[Cesium Ion Token](https://cesium.com/ion/)（免费注册，当前该项目版本对token非强制）

```bash
git clone https://github.com/Xieyuha/weather-wheels-pro.git
cd weather-wheels-pro
pnpm install
cp .env.development .env.development.local
# 编辑 .env.development.local，填入 VITE_CESIUM_TOKEN
pnpm dev
```

---

 
## 风场数据
 
项目不内置数据文件，需自行从 NOAA GFS 下载并转换。
 
**1. 下载 GRIB2 数据**
 
前往 [NOAA GFS 数据集](https://www.ncdc.noaa.gov/data-access/model-data/model-datasets/global-forcast-system-gfs) 下载所需时次的 GRIB2 文件（1.0° / 0.5° / 0.25° 三档分辨率分别对应 LOD 三个层级）。
 
也可以配合 [grib2mcp](https://github.com/your-repo/grib2mcp) 自动拉取指定时次的数据。
 
**2. 转换为 JSON**
[(https://github.com/danwild/wind-js-server)](https://github.com/danwild/wind-js-server) 是一个 Node.js 工具，可以将 GRIB2 转换为前端 `WindField` 格式的 JSON 文件。安装后运行：
 

**3. 转换为 本项目所需特定JSON**
 
```bash
pnpm run convert -- --input ./data/gfs.grib2 --output ./public/data/
```
 
**4. 启动**
 
数据就位后正常 `pnpm dev` 即可。
 
---

## 技术栈

|          |                                      |
| -------- | ------------------------------------ |
| 前端框架 | Vue 3 (Composition API) + TypeScript |
| 构建工具 | Vite 7                               |
| 三维地图 | CesiumJS 1.138                       |
| 二维地图 | OpenLayers 10                        |
| 状态管理 | Pinia                                |
| 包管理   | pnpm                                 |

---

## License

MIT