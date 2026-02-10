<template>
  <div class="about-container">
    <h1>关于 WindWise Demo</h1>

    <section>
      <h2>🛠 技术栈</h2>
      <ul>
        <li><strong>核心框架:</strong> Vue 3 (Script Setup) + TypeScript 5.x</li>
        <li><strong>构建工具:</strong> Vite 7</li>
        <li><strong>状态管理:</strong> Pinia (管理地图实例与 UI 状态)</li>
        <li><strong>UI 组件:</strong> Element Plus</li>
      </ul>
    </section>

    <section>
      <h2>💡 核心实现 (亮点)</h2>
      <p>本项目未使用现成的可视化库(如 EChartsGL)，而是基于原生 <strong>Canvas 2D API</strong> 实现了高性能粒子系统。</p>
      <ul>
        <li>手写粒子生命周期管理与对象池优化。</li>
        <li>实现了栅格数据的<strong>双线性插值(Bilinear Interpolation)</strong>算法，计算任意点风速。</li>
        <li>使用 Offscreen Canvas 进行渲染性能优化。</li>
        <li>设计了适配器模式(Adapter Pattern)以隔离地图引擎依赖。</li>
      </ul>
    </section>

     <section>
      <h2>🔗 源码</h2>
      <a href="https://github.com/Xieyuha/weather-wheels-pro" target="_blank">GitHub Repository</a>
    </section>
  </div>
</template>