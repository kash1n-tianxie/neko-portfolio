import assert from 'node:assert/strict'
import test from 'node:test'
import { TOWN_MAP } from '../src/components/world/pixel/town-map.ts'
import { canStand, findPath, createWorldState, stepWorld, interactWorld } from '../src/components/world/pixel/simulation.ts'

test('pond water and cottage walls are solid while the spawn path is walkable',()=>{
  assert.equal(canStand(TOWN_MAP,377,425),true)
  assert.equal(canStand(TOWN_MAP,600,350),false)
  assert.equal(canStand(TOWN_MAP,200,100),false)
})
test('resident cats have solid footprints so the player cannot stand inside them',()=>{
  for(const spot of TOWN_MAP.spots.filter(spot=>spot.kind==='npc')) {
    assert.equal(canStand(TOWN_MAP,spot.x,spot.y),false)
  }
})
for(const spot of TOWN_MAP.spots) test(`walk from town entrance to ${spot.id} and interact without teleporting`,()=>{
  const state=createWorldState(TOWN_MAP)
  state.path=findPath(TOWN_MAP,state.player,spot)
  assert.ok(state.path.length,`${spot.id} must have a route`)
  for(let i=0;i<1800&&state.path.length;i++) stepWorld(state,{x:0,y:0},1/60,TOWN_MAP)
  const distance=Math.hypot(state.player.x-spot.x,state.player.y-spot.y)
  assert.ok(distance<=(spot.kind==='npc'?spot.radius:2),`${spot.id} route must complete within interaction range`)
  if(spot.kind==='npc') assert.ok(distance>=14,`${spot.id} must not overlap the player`)
  interactWorld(state,TOWN_MAP)
  if(spot.kind==='pond') assert.equal(state.fishing,'waiting')
  else assert.equal(state.activeId,spot.id)
})
