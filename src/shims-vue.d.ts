/* eslint-disable */
declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare module 'three'
declare module 'three/examples/jsm/loaders/GLTFLoader';
declare module 'three/examples/jsm/renderers/CSS3DRenderer';
declare module 'happy-happy-ui'
