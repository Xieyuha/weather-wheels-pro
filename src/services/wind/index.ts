import type MapAdapter from '@/adapter/map';
import { WindLayer } from './WindLayer';
import WindService from './WindService';
import { CanvasWindRenderer } from './renderers/CanvasWindRenderer';
// 用类更合适??
// TODO:暴露resize方法
export async function createWindLayer(mapAdapter: MapAdapter) {
  const windField = await new WindService().getWindData();
  const container = mapAdapter.getOverlayContainer!();
  const { w: width, h: height } = mapAdapter.getViewportSize!();
  const projector = mapAdapter.getProjector!();
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
}
