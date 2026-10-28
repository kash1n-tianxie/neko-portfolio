import assert from 'node:assert/strict'
import test from 'node:test'
const viewport = await import('../src/components/world/pixel/viewport.ts').catch(()=>({}))

test('pixel viewport keeps integer zoom and enough phone playfield',()=>{
  assert.equal(typeof viewport.fitPixelViewport,'function')
  assert.deepEqual(viewport.fitPixelViewport(1280,800),{scale:3,width:427,height:267})
  assert.deepEqual(viewport.fitPixelViewport(390,844),{scale:2,width:195,height:422})
})
test('camera follows the cat but never exposes outside the map',()=>{
  assert.equal(typeof viewport.pixelCamera,'function')
  assert.deepEqual(viewport.pixelCamera({x:10,y:10},400,250,768,512),{x:0,y:0})
  assert.deepEqual(viewport.pixelCamera({x:760,y:510},400,250,768,512),{x:368,y:262})
  assert.deepEqual(viewport.pixelCamera({x:384,y:256},400,250,768,512),{x:184,y:131})
})
