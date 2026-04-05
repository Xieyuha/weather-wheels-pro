import { WindLayer } from './WindLayer';
import WindService from './WindService';
import { CanvasWindRenderer } from './renderers/CanvasWindRenderer';
// 用类更合适??
// TODO:暴露resize方法
export async function createWindLayer() {
  const windField = await new WindService().getWindData();
  const container = document.getElementById('mapContainer')!;
  const width = container.clientWidth;
  const height = container.clientHeight;
  const render = new CanvasWindRenderer(
    { fadeOpacity: 0.88, lineWidth: 1.5 },
  )
  render.init(container, width, height)
  const bounds = windField.meta.bounds;
  const windlayer = new WindLayer(
    windField,
    render,
    bounds,
    width, height
  )
  windlayer.start()
}
