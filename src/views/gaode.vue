<template>
  <div style="overflow: hidden; position: relative;">
    <happy-button1></happy-button1>
    <happy-button2></happy-button2>
    <div ref="mapRef" id="container" class="container"></div>
    <div id="cssrender" class="cssrender"></div>
  </div>
</template>

<script setup lang='ts'>
import { ref, reactive, onMounted } from 'vue'
import AMapLoader from '@amap/amap-jsapi-loader';
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { CSS3DRenderer, CSS3DObject } from "three/examples/jsm/renderers/CSS3DRenderer";
// 加入轨道控制
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
// 导入动画库
import gsap from 'gsap'


let aMap:any = ref(null)

function initAMapLoader () {
  // console.log('AMapLoader', AMapLoader)
  (window as any)._AMapSecurityConfig = {
    securityJsCode: "9b516ba8549bf6c5950d05e52db533e6",
  };
  AMapLoader.load({
    key: "f33121dd1c903ed02c3ffaf33edbc9b3", //申请好的Web端开发者key，调用 load 时必填
    version: "2.0", //指定要加载的 JS API 的版本，缺省时默认为 1.4.15
  })
    .then((AMap) => {
      //JS API 加载完成后获取AMap对象
      initAMap(AMap)
      getAmap(AMap)
      
    })
    .catch((e) => {
      console.error(e); //加载错误提示
    });
}

function initAMap(AMap:any){
  console.log('AMap', AMap);
  // 创建默认图层（啥都没）
  // const layer = new AMap.createDefaultLayer({
  //   zooms: [3, 20], //可见级别
  //   visible: true, //是否可见
  //   opacity: 1, //透明度
  //   zIndex: 0, //叠加层级
  // });

  // 创建地图实例
  const map = new AMap.Map("container", {
    viewMode: '3D', //默认使用 2D 模式
    turboMode: false, // 开启地形图，beta2.1才有
    showBuildingBlock: false, // 是否展示地图 3D 楼块，默认 true 
    showLabel: true, // 是否展示地图文字和 POI 信息
    terrain: true, //开启地形图
    zoom: 11, //地图级别
    center: [113.289987, 23.075032], //地图中心点
    mapStyle: "amap://styles/normal", //设置地图的显示样式
    // layers: [layer], //layer为创建的默认图层
    zIndex: 1,
  });
  aMap.value = map


  // 交通图层
  const traffic = new AMap.TileLayer.Traffic({
    autoRefresh: true, //是否自动刷新，默认为false
    interval: 180, //刷新间隔，默认180s
  });
  aMap.value.add(traffic); //通过add方法添加图层

  //异步加载控件
  AMap.plugin(['AMap.ToolBar', 'AMap.Scale'],function(){ 
    const toolbar = new AMap.ToolBar(); //缩放工具条实例化
    const Scale = new AMap.Scale()
    aMap.value.addControl(toolbar);
    aMap.value.addControl(Scale);
  });

  initMarker(AMap) // 创建自定义点标记
  initThree(AMap)
}
let count = 0

function initMarker (AMap:any) {
  const markerContent =
  `
  <div class="custom-content-marker">
    <img src="//a.amap.com/jsapi_demos/static/demo-center/icons/dir-via-marker.png" >
    <div class="close-btn" onclick="clearMarker()">X</div>
  </div>
  `
  const list = ref([{
    x: 113.29068,
    y: 23.074317
  },{
    x: 113.289884,
    y: 23.074725
  },{
    x: 113.28962,
    y: 23.075054
  },{
    x: 113.289987,
    y: 23.075032
  }])
  list.value.forEach((item, index) => {
    const position = new AMap.LngLat(item.x, item.y); //Marker 经纬度
    const marker = new AMap.Marker({
      position: position,
      // content: markerContent, //将 html 传给 content
      // offset: new AMap.Pixel(-13, -30), //以 icon 的 [center bottom] 为原点
    });
    aMap.value.add(marker);
    marker.on('click', () => {
      console.log('点击了marker', index + 1);
    });
  })
  
  
  // (window as any).clearMarker = () => {
  //   aMap.value.remove(marker); //清除 marker
  //   console.log(123);
  // }
  aMap.value.setFitView()

  aMap.value.on("click", function (event:any) {
    console.log('click-amap', event);
    let getBoundingClientRect = mapRef.value.getBoundingClientRect()
    // console.log('getBoundingClientRect', getBoundingClientRect);
    // 全屏
    // mouse.x = (event.originEvent.clientX / window.innerWidth) * 2 - 1
    // mouse.y = -(event.originEvent.clientY / window.innerHeight) * 2 + 1
    // 局部
    mouse.x = ((event.originEvent.clientX - getBoundingClientRect.left) / getBoundingClientRect.width) * 2 - 1
    mouse.y = -((event.originEvent.clientY - getBoundingClientRect.top) / getBoundingClientRect.height) * 2 + 1
    // console.log('mouse', mouse);
    
    // 给正方体添加点击事件
    // 设置射线起点为鼠标位置，射线的方向为相机视角方向
    raycaster.setFromCamera(mouse, camera)
    // 计算射线相交
    // console.log('scene', scene);

    raycaster.linePrecision = 3 // 默认值为1，越大越容易选中线模型

    const intersects = raycaster.intersectObjects(scene.children, true)
    // console.log('intersects', intersects);
    if (intersects.length > 0) {
      // 选中物体
      const selectedObject = intersects[0].object
      const { modelName, modelParent } = findTopParent(selectedObject, 'modelName');
      // console.log('modelName', modelName);
      // console.log('modelParent', modelParent);
      // console.log('parentObj', parentObj);
      let animatel = null
      let animatel2 = null
      switch (modelName) {
        case '方块':
          console.log('点击了方块');
          modelParent.position.x += 1
          modelParent.material.color.set(0xff62e258)
          setTimeout(() => {
            modelParent.material.color.set(0x1e2f97)
          }, 3000);
          break;
        case '房子模型2':
          console.log('点击了房子模型2');
          break;
        case '房子模型1':
          console.log('点击了房子模型1');
          
          animatel = gsap.to(modelParent.position, { 
            // x: modelParent.position.x + 10, 
            // z: modelParent.position.z + 10, 
            x: comLocation[0] - comLocation2[0], 
            z: comLocation2[1] - comLocation[1], 
            y: 80, 
            duration: 5,
            ease: "power1.inOut", 
            repeat: 0,  // 设置重复次数，-1即无限循环
            // yoyo: true, // 是否往返运动
            delay: 0, // 延迟时间
            onStart: () => {
              console.log('动画开始');
              updateMapCamera(modelParent.position)
            },
            onUpdate: () => {
              // console.log('动画进行中');
            },
            onComplete: () => {
              gsap.to(modelParent.position, { delay: 0, x: 0, y: 10, z: 0, duration: 1 })
              // gsap.to(modelParent.scale, { delay: 2,duration: 1, x: 1.2, y: 1.2, z: 1.2, repeat: 5, yoyo: true, ease: "power2.inOut" });
              updateMapCameraEnd(modelParent.position)
              console.log('动画结束');
            },
          })
          gsap.to(modelParent.rotation, { 
            // x: Math.PI * 2, 
            // y: Math.PI * 2,  
            z: Math.PI * 2, 
            duration: 5, 
            ease: "power2.inOut", 
            repeat: 0,  // 设置重复次数，-1即无限循环
            yoyo: true, // 是否往返运动
            delay: 0, // 延迟时间
            onStart: () => {
              console.log('动画开始');
            },
            onUpdate: () => {
              // console.log('动画进行中');
            },
            onComplete: () => {
              // gsap.to(modelParent.scale, { x: 2, y: 0.5, z: 1, duration: 1 })
              // console.log('(modelParent', modelParent);
              // console.log('(modelParent.position', modelParent.position);
              console.log('动画结束');
            },
          })
          // modelParent.rotation.set(-Math.PI / 2, 0, 0); // 重置
          modelParent.rotation.set(0, 0, 0); // 重置

          // count += 1
          // gsap.to(camera.position, { 
          //   x: camera.position.x + 10, 
          //   y: camera.position.y + 10, 
          //   onStart: () => {
          //     console.log('动画开始');
          //   },
          //   onUpdate: () => {
          //     console.log('动画进行中');
          //   },
          //   onComplete: () => {
          //     console.log('动画结束');
          //   },
          // })
          // 使用 GSAP 控制相机
          // gsap.to(camera.position, { duration: 2, x: 20, y: 20, z: -20, onUpdate: updateMapCamera });
          // gsap.to(camera.rotation, { duration: 2, x: Math.PI * 0.5, y: Math.PI * 0.5, z: Math.PI * 0.5 });
          
          // gsap.to(modelParent.position, { duration: 2, x: 11, y: 22, z: 5, repeat: 0, ease: "power2.inOut" });
          // gsap.to(modelParent.rotation, { duration: 5, x: Math.PI * 1.5, y: Math.PI * 2, repeat: 0, ease: "power2.inOut" });
          // gsap.to(modelParent.scale, { duration: 2, x: 2, y: 0.5, z: 1, repeat: 1, yoyo: true, ease: "power2.inOut" });
          // gsap.to(modelParent.rotation, { x: 2 * Math.PI, duration: 7, ease: "power1.inOut" })
          // modelParent.position.x += 1
          break;
        default:
          console.log('没点击中目标');
          break;
      }
      
      // if(modelName == '房子模型'){
      //   console.log('点击了房子模型');
      // }else {
      //   // alert(`点击了${selectedObject.name}`)
      //   // 改变当前被点击物体的颜色
      //   selectedObject.material.color.set(0xff62e258)
      //   setTimeout(() => {
      //     selectedObject.material.color.set(0x1e2f97)
      //   }, 3000);
      // }
    }
    
  });

  // setTimeout(() => {
  //   console.log('开始移动');
  //   aMap.value.setCenter([113.289987, 23.075032]); //简写 设置地图中心点
  //   aMap.value.setZoom(20, false, 1000);
  // }, 1000);
}

// 更新高德地图相机
function updateMapCamera(position:any) {
  aMap.value.setZoomAndCenter(18.5, [113.289717, 23.075469], false, 5000);
  aMap.value.setRotation(-45, false, 2000);
  aMap.value.setPitch(30, false, 2000);
  console.log('position', position);
}
function updateMapCameraEnd(position:any) {
  aMap.value.setRotation(0, false, 1000);
  aMap.value.setPitch(60, false, 1000);
  // aMap.value.setZoomAndCenter(19.5, [113.289717, 23.075469], false, 1000);
  aMap.value.setZoomAndCenter(19.5, [113.289983, 23.07501], false, 1000);
  console.log('position', position);
}

function createTag(object3d:any) {
  // 创建各个区域的元素
  const element = document.createElement("div");
  element.style.padding = "5px 10px";
  element.style.border = "1px solid skyblue";
  element.style.borderRadius = '5px';
  element.style.height = '20px';
  element.style.pointerEvents = 'none';
  element.className = "elementTag";
  element.innerHTML = `
    <div class="elementContent">
      <h3>${object3d.children[0].userData.modelName}</h3>
      <p>温度：26℃</p>
      <p>湿度：50%</p>
    </div>
  `;
  const objectCSS3D = new CSS3DObject(element);
  console.log('object3d.position', object3d.position);
  const { x, y, z } = object3d.position
  console.log('aMap',aMap.value);
  const { lng, lat } = aMap.value.coordsToLngLat([x, y])
  
  // const a = new THREE.Vector3({x: lng, y: z , z: lat});
  const a = {x: lng, y: z - 20 , z: lat + 40} // 这里的z是高度
  console.log(a);
  
  objectCSS3D.rotation.x = Math.PI / 2; // 下载的glft已经在上面旋转90度所以不需要，但下载的glb需要旋转90度
  objectCSS3D.position.copy(a);
  objectCSS3D.scale.set(0.1, 0.1, 0.1);
  return objectCSS3D;
  // scene.add(objectCSS3D);
}


// 递归查找最顶层的父级
const findTopParent:any = (object: any, target: string) => {
  // 如果当前对象没有父级，说明它已经是最顶层的父级了
  if (object.parent === null) {
    return {
      modelName: '',
      modelParent: null
    };
  }
  else if (object.userData.modelName){
    // 如果当前对象的父级是目标对象，说明找到了最顶层的父级
    const modelParent = object.type == 'Group' ? object.parent : object
    return {
      modelName: object.userData.modelName,
      modelParent: modelParent
    };
  } else {
    // 递归调用，继续查找父级
    return findTopParent(object.parent, target);
  }
}

/* refs */
// 地图dom
const mapRef = ref()

//地图中心点
const center = [121.407394, 37.424985]
// 地图对象
let map = null
// 高德地图类
let AMap = null
// 渲染器
let render:any = null
// 场景
let scene:any = null
// 相机
let camera:any = null
// 坐标转换器（经纬度转three位置）
let customCoords:any = null
// 转化后的中心点坐标
let comLocation:any = null
let comLocation2:any = null
// 创建射线投射器
let raycaster = new THREE.Raycaster()
// 鼠标位置
let mouse = new THREE.Vector2()


// 渲染器
let css3drender:any = null

function initScene() {
  // 初始化场景
  scene = new THREE.Scene();
}

// 初始化光源
function initLight() {
  // 创建环境光
  let light = new THREE.AmbientLight(0xffffff, 1);
  light.position.set(0, 0, 0); //点光源位置
  scene.add(light);
}

// 初始化相机
function initCamera() {
  camera = new THREE.PerspectiveCamera(
    75,
    mapRef.value.offsetWidth / mapRef.value.offsetHeight,
    0.1,
    // 1 << 30
    1000000
  );
}

// 添加盒子
function addBox() {
  let mat = new THREE.MeshLambertMaterial({
    side: THREE.DoubleSide,
    color: 0x1e2f97,
    transparent: true,
    opacity: 1,
    depthWrite: true
  });
  let geo = new THREE.BoxBufferGeometry(30, 30, 30);
  let mesh = new THREE.Mesh(geo, mat);
  mesh.position.set(comLocation[0], comLocation[1], 50);
  mesh.userData.modelName = '方块'
  scene.add(mesh);
  
}
let floorGroup:any = null
let floorTags:any = []

const addGLFT = () => {
  const loader = new GLTFLoader();
  console.log('loader', loader);
  const list = ['/model/house/scene.gltf', '/model/house/scene2.gltf']
  list.forEach((url, index) => {
    loader.load(url, function (glb: any) {
      scene.add(glb.scene);
      glb.scene.position.set(comLocation2[0] + index*20, comLocation2[1] + index*20, 10);
      glb.scene.rotation.x = Math.PI / 2;
      var group = glb.scene.children[0]
      group.userData.modelName = '房子模型' + index
      console.log('glb-房子模型', glb);
    })
  })
}

const addGLFT2 = () => {
  const loader = new GLTFLoader();
  console.log('loader', loader);
  // const list = ['/model/house/scene.gltf', '/model/house/scene2.gltf']
  // const list = ['/model/house/scene.gltf']
  const list = ['/model/glbmodel/中工水务.glb', '/model/glbmodel/中工水务.glb']
  list.forEach((url, index) => {
    loader.load(url, function (gltf: any) {
      console.log('comLocation2', comLocation2);
      
      console.log(gltf.scene);
      console.log(gltf);
      floorGroup = gltf.scene;
      gltf.scene.position.set(comLocation2[0] + index*100, comLocation2[1] + index*100, 1);
      // gltf.scene.rotation.x = Math.PI / 2; // 下载的glft要旋转90度，glb不用
      // gltf.scene.rotateOnAxis(new THREE.Vector3(1, 0, 0),  Math.PI / 2);
      var group = gltf.scene.children[0]
      group.userData.modelName = '房子模型' + (index + 1)
      // group.position.set(comLocation2[0] + index*20, comLocation2[1] + index*20, 10);
      console.log('group-房子模型', group);
      console.log('glb-房子模型', gltf);

      // let array = ["小型会议室", "核心科技室", "科技展台", "设计总监办公室"];
      // 判断子元素是否是物体
      // gltf.scene.traverse((child: any) => {
          // console.log('child', child);
        // if (child.isGroup) {
          // console.log('Group', child);
          // child.material.emissiveIntensity = 15;
          // child.receiveShadow = true;
          // child.castShadow = true;
        // }
        // if (array.indexOf(child.name) != -1) {
        //   console.log("小型会议室", child);
          const css3dObject = createTag(gltf.scene);
          // css3dObject.visible = false;
          console.log('css3dObject', css3dObject);
          
          floorTags.push(css3dObject);
          floorGroup.add(css3dObject);
        // }
      // });
      // floorGroup.visible = false;
      floorGroup.visible = true;
      console.log('floorTags', floorTags);
      console.log('floorGroup', floorGroup);
      

      scene.add(floorGroup);
    })
  })
  floorTags.forEach((tag:any) => {
    tag.visible = true
  })
}

// 动画
function animate() {
  // console.log('animate');
  
  // 渲染时刷新地图
  aMap.value.render();
  // render.render(scene, camera);
  // css3drender.render(scene, camera);
  // 自动刷新
  requestAnimationFrame(animate);
}

// 初始化树
function initThree(AMap:any) {
  // 初始化数据转换工具
  customCoords = aMap.value.customCoords;
  // 数据使用转换工具进行转换，这个操作必须要提前执行（在获取镜头参数 函数之前执行），否则将会获得一个错误信息。
  comLocation = customCoords.lngLatToCoord([113.289987, 23.075032]);
  comLocation2 = customCoords.lngLatToCoord([113.289717, 23.075469]);
  // console.log('comLocation', comLocation);
  // console.log('comLocation2', comLocation2);
  
  let controls:any = null
  // 创建webgl layer
  let glLayer = new AMap.GLCustomLayer({
    // 图层的层级 这里写的太大模型会消失
    zIndex: 100,
    opacity: 5,
    // 初始化的操作，创建图层过程中执行一次。
    init: (gl:any) => {
      console.log('gl', gl);
      
      render = new THREE.WebGLRenderer({
        context: gl
      })
      // 自动清空画布这里必须设置为 false，否则地图底图将无法显示
      render.autoClear = false;
      
      css3drender = new CSS3DRenderer();
      console.log('css3drender', css3drender);
      
      // css3drender.setSize(window.innerWidth, window.innerHeight);
      css3drender.setSize(mapRef.value.offsetWidth, mapRef.value.offsetHeight);
      document.getElementById('cssrender').appendChild(css3drender.domElement);
          
      // 创建轨道控制器(相机、元素)
      // controls = new OrbitControls(camera, render.domElement)
      // 设置控制器阻尼，让控制器更有真实效果,必须在动画循环里调用.update()。
      // controls.enableDamping = true

      initScene()
      initLight()
      initCamera()

      // 添加盒子 如果不延迟 或者延迟时间少了会保一个警告（Vertex buffer is not big enough for the draw call）
      setTimeout(() => {
        // addBox()
        // addGLFT()
        addGLFT2()
      }, 0)
    },
    render: () => {
      render.state.reset()
      // console.log('customCoords', customCoords);
      // console.log('customCoords',  customCoords.getCameraParams());
      
      const {near, far, fov, up, lookAt, position} =
          customCoords.getCameraParams();

      camera.near = near;
      camera.far = far;
      camera.fov = fov;
      camera.position.set(...position);
      camera.up.set(...up);
      camera.lookAt(...lookAt);
      camera.updateProjectionMatrix();

      // console.log('scene', scene);
      // console.log('camera', camera);
      

      // controls.update()
      // console.log('render123123');
      
      render.render(scene, camera);
      css3drender.render(scene, camera);
      // console.log('scene', scene);
      
    },
  })

  aMap.value.add(glLayer)
  animate()
}
const getAmap = (AMap:any) => {
  AMap.plugin("AMap.Geolocation", () => {
    var geolocation = new AMap.Geolocation({
      // 是否使用高精度定位，默认：true
      enableHighAccuracy: true,
      // 设置定位超时时间，默认：无穷大
      timeout: 10000,
    });
    geolocation.getCurrentPosition((status:any, result:any) => {  //获取用户当前的精确位置
      console.log('status', status);
      console.log('result', result);
      geolocation.getCityInfo((status:any, result:any) => {   //只能获取当前用户所在城市和城市的经纬度
        console.log('status2', status);
        console.log('result2', result);
      })
    })
  })
}

onMounted(() => {
  initAMapLoader()
  // 要放在public下
  const worker = new Worker('/webWorker/webworker.js');
  console.log('worker', worker);

  worker.onmessage = (event:any) => {
    console.log('worker--onmessage', event.data);
  };
  worker.onerror = (event:any) => {
    console.log('onerror', event);
  };
  worker.postMessage('worker开始啦');
})
</script>

<style scoped lang="scss">
.container{
  // margin: 0 auto;
  width: 800px;
  height: 600px;
  // width: 100%;
  // height: 100vh;
  border: 1px solid #000;
}
.cssrender{
  width: 800px;
  height: 600px;
  margin-top: 79px;
}
.custom-content-marker {
  position: relative;
  width: 25px;
  height: 34px;
}

.custom-content-marker img {
  width: 100%;
  height: 100%;
}

.custom-content-marker .close-btn {
  position: absolute;
  top: -6px;
  right: -8px;
  width: 15px;
  height: 15px;
  font-size: 12px;
  background: #ccc;
  border-radius: 50%;
  color: #fff;
  text-align: center;
  line-height: 15px;
  box-shadow: -1px 1px 1px rgba(10, 10, 10, .2);
}

.custom-content-marker .close-btn:hover{
  background: #666;
}

</style>
