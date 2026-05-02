import type { IMapAdapter } from '@/adapter/map/types';
import { WindLayer } from './WindLayer';
import WindService from './WindService';
import { CanvasWindRenderer } from './renderers/CanvasWindRenderer';
// 用类更合适??
// TODO:暴露resize方法
export async function createWindLayer(mapAdapter: IMapAdapter) {
  const windField = await new WindService().getWindData();
  console.log('Wind data loaded:', windField);
  const container = mapAdapter.getOverlayContainer();
  const { w: width, h: height } = mapAdapter.getViewportSize();
  const projector = mapAdapter.getProjector();
  // linewidth和fadeOpacity可以根据粒子年龄或者速度做成渐变的，暂时先写死
  const render = new CanvasWindRenderer(
    { fadeOpacity: 0.88, lineWidth: 1.5 },
  )
  render.init(container, width, height)
  // 用视口 bounds 约束粒子撒点；全局数据下不收敛视口会导致粒子散布全球、相机内看不见
  const spawnBounds = mapAdapter.getViewBounds?.() ?? windField.meta.bounds;
  const windlayer = new WindLayer(
    windField,
    render,
    projector,
    spawnBounds,
  )
  windlayer.start()
  return windlayer
}
