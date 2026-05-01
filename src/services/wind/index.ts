import type { IMapAdapter } from '@/adapter/map/types';
import { WindLayer } from './WindLayer';
import WindService from './WindService';
import { CanvasWindRenderer } from './renderers/CanvasWindRenderer';
// 用类更合适??
// TODO:暴露resize方法
export async function createWindLayer(mapAdapter: IMapAdapter) {
  const windField = await new WindService().getWindData();
  const container = mapAdapter.getOverlayContainer();
  const { w: width, h: height } = mapAdapter.getViewportSize();
  const projector = mapAdapter.getProjector();
  // linewidth和fadeOpacity可以根据粒子年龄或者速度做成渐变的，暂时先写死
  const render = new CanvasWindRenderer(
    { fadeOpacity: 0.88, lineWidth: 1.5 },
  )
  render.init(container, width, height)
  const windlayer = new WindLayer(
    windField,
    render,
    projector
  )
  windlayer.start()
  return windlayer
}
