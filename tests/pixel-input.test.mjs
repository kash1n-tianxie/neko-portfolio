import assert from 'node:assert/strict'
import test from 'node:test'
const input = await import('../src/components/world/pixel/input.ts').catch(()=>({}))
test('opposite directions cancel and virtual input combines with keyboard deterministically',()=>{
  assert.equal(typeof input.readMovement,'function')
  assert.deepEqual(input.readMovement(new Set(['KeyW','KeyS','ArrowRight']),{x:0,y:0}),{x:1,y:0})
  assert.deepEqual(input.readMovement(new Set(['KeyA']),{x:1,y:-1}),{x:0,y:-1})
})
test('typing or focusing interface controls never captures game keys',()=>{
  assert.equal(typeof input.acceptsGameKeys,'function')
  for(const tag of ['INPUT','TEXTAREA','SELECT','BUTTON','A']) assert.equal(input.acceptsGameKeys(tag,false),false)
  assert.equal(input.acceptsGameKeys('CANVAS',false),true)
  assert.equal(input.acceptsGameKeys('BODY',false),true)
  assert.equal(input.acceptsGameKeys('CANVAS',true),false)
})
