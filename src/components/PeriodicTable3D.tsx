
import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import {
  CSS3DObject,
  CSS3DRenderer
} from 'three/addons/renderers/CSS3DRenderer.js'
import { TrackballControls } from 'three/addons/controls/TrackballControls.js'

type Person = {
  name: string
  photo: string
  age: number
  country: string
  interest: string
  networth: number
}

type Props = {
  people: Person[]
}

function getNetWorthColor(networth: number) {
  if (networth < 100000) return '#ff4444'
  if (networth <= 200000) return '#ff9800'
  return '#4caf50'
}

type Layout = 'table' | 'sphere' | 'helix' | 'grid'

export default function PeriodicTable3D({ people }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
 const [layout, setLayout] = useState<Layout>('table')
const changeLayoutRef = useRef<
  ((type: Layout) => void) | null
>(null)


  useEffect(() => {

    changeLayoutRef.current = changeLayout

    const container = containerRef.current
    if (!container || people.length === 0) return

    // Maximum 200 tiles for 20x10 and 5x4x10
    const records = people.slice(0, 200)

    const scene = new THREE.Scene()

    const camera = new THREE.PerspectiveCamera(
      40,
      container.clientWidth / container.clientHeight,
      1,
      10000
    )

    camera.position.z = 3000

    const renderer = new CSS3DRenderer()

    renderer.setSize(
      container.clientWidth,
      container.clientHeight
    )

    container.appendChild(renderer.domElement)

    const controls = new TrackballControls(
      camera,
      renderer.domElement
    )

    controls.minDistance = 500
    controls.maxDistance = 6000

    const objects: CSS3DObject[] = []

    // Create tiles using Google Sheets data
    records.forEach((person) => {
      const element = document.createElement('div')

      element.className = 'person-tile'

      element.style.backgroundColor =
        getNetWorthColor(person.networth)

      const photo = document.createElement('img')
      photo.src = person.photo
      photo.alt = person.name
      photo.className = 'person-photo'

      const name = document.createElement('h3')
      name.textContent = person.name

      const age = document.createElement('p')
      age.textContent = `Age: ${person.age}`

      const country = document.createElement('p')
      country.textContent = person.country

      const interest = document.createElement('p')
      interest.textContent = person.interest

      const networth = document.createElement('strong')
      networth.textContent =
        `$${person.networth.toLocaleString()}`

      element.append(
        photo,
        name,
        age,
        country,
        interest,
        networth
      )

      const object = new CSS3DObject(element)

      scene.add(object)
      objects.push(object)
    })

    // TABLE: 20 columns x 10 rows
    function getTablePosition(i: number) {
      const x = (i % 20 - 9.5) * 150
      const y = (4.5 - Math.floor(i / 20)) * 190

      return new THREE.Vector3(x, y, 0)
    }

    // SPHERE
    function getSpherePosition(i: number) {
      const total = records.length

      const phi = Math.acos(
        -1 + (2 * (i + 0.5)) / total
      )

      const theta = Math.sqrt(total * Math.PI) * phi
      const radius = 900

      return new THREE.Vector3(
        radius * Math.cos(theta) * Math.sin(phi),
        radius * Math.cos(phi),
        radius * Math.sin(theta) * Math.sin(phi)
      )
    }

    // DOUBLE HELIX: Two spiral strands
    function getHelixPosition(i: number) {
      const strand = i % 2
      const strandIndex = Math.floor(i / 2)
      const total = Math.ceil(records.length / 2)

      const angle = strandIndex * 0.45 + strand * Math.PI
      const radius = 550

      const y =
        (strandIndex - (total - 1) / 2) * 45

      return new THREE.Vector3(
        radius * Math.cos(angle),
        y,
        radius * Math.sin(angle)
      )
    }

    // GRID: 5 columns x 4 rows x 10 layers
    function getGridPosition(i: number) {
      const x = (i % 5 - 2) * 220

      const y =
        (2 - Math.floor(i / 5) % 4) * 220

      const z =
        (Math.floor(i / 20) - 4.5) * 220

      return new THREE.Vector3(x, y, z)
    }

    function getPositions(type: Layout) {
      return objects.map((_, i) => {
        switch (type) {
          case 'sphere':
            return getSpherePosition(i)

          case 'helix':
            return getHelixPosition(i)

          case 'grid':
            return getGridPosition(i)

          default:
            return getTablePosition(i)
        }
      })
    }

    // Initial arrangement
    objects.forEach((object, i) => {
      object.position.copy(getTablePosition(i))
    })

    // Animate between layouts
    function changeLayout(type: Layout) {
      const targets = getPositions(type)

      const starts = objects.map(object => ({
        position: object.position.clone(),
        rotation: object.rotation.clone()
      }))

      const duration = 1000
      const startTime = performance.now()

      function animate() {
        const elapsed = performance.now() - startTime
        const progress = Math.min(elapsed / duration, 1)

        const eased =
          1 - Math.pow(1 - progress, 3)

        objects.forEach((object, i) => {
          object.position.lerpVectors(
            starts[i].position,
            targets[i],
            eased
          )
        })

        if (progress < 1) {
          requestAnimationFrame(animate)
        }
      }

      requestAnimationFrame(animate)
      setLayout(type)
    }

    // Render scene
    let animationId = 0

    function render() {
      animationId = requestAnimationFrame(render)

      controls.update()
      renderer.render(scene, camera)
    }

    render()

    // Responsive screen
    function handleResize() {
      if (!container) return

      camera.aspect =
        container.clientWidth / container.clientHeight

      camera.updateProjectionMatrix()

      renderer.setSize(
        container.clientWidth,
        container.clientHeight
      )
    }

    window.addEventListener('resize', handleResize)

    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener('resize', handleResize)

      controls.dispose()

      objects.forEach(object => {
        scene.remove(object)
        object.element.remove()
      })

      renderer.domElement.remove()
    }
  }, [people])

  return (
    <div className="visualization-section">

      <h2>3D Data Visualization</h2>

      <div className="layout-buttons">
        {(['table', 'sphere', 'helix', 'grid'] as Layout[]).map(
          (type) => (
            <button
              key={type}
              className={layout === type ? 'active' : ''}
             onClick={() => changeLayoutRef.current?.(type)}
            >
              {type.toUpperCase()}
            </button>
          )
        )}
      </div>

      <div
        ref={containerRef}
        className="three-container"
      />

      <p>
        Total 3D tiles: {Math.min(people.length, 200)}
      </p>

      {people.length > 200 && (
        <p>Only the first 200 records are displayed.</p>
      )}

    </div>
  )
}
