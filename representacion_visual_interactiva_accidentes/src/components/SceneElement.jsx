import { Group, Rect, Circle, RegularPolygon, Text, Line } from 'react-konva'

/* Top-down view. Origin (0,0) = element center. */

const Car = ({ color }) => (
  <Group>
    {/* Wheels */}
    <Rect x={-36} y={-42} width={13} height={24} fill="#1f2937" cornerRadius={4} />
    <Rect x={23} y={-42} width={13} height={24} fill="#1f2937" cornerRadius={4} />
    <Rect x={-36} y={18} width={13} height={24} fill="#1f2937" cornerRadius={4} />
    <Rect x={23} y={18} width={13} height={24} fill="#1f2937" cornerRadius={4} />
    {/* Wheel rims */}
    <Circle x={-29} y={-30} radius={4} fill="#374151" />
    <Circle x={29} y={-30} radius={4} fill="#374151" />
    <Circle x={-29} y={30} radius={4} fill="#374151" />
    <Circle x={29} y={30} radius={4} fill="#374151" />
    {/* Body */}
    <Rect x={-26} y={-46} width={52} height={92} fill={color} cornerRadius={9} />
    {/* Front windshield */}
    <Rect x={-18} y={-30} width={36} height={22} fill="rgba(186,230,253,0.82)" cornerRadius={3} />
    {/* Rear windshield */}
    <Rect x={-18} y={14} width={36} height={17} fill="rgba(186,230,253,0.62)" cornerRadius={3} />
    {/* Door divider */}
    <Line points={[-26, -2, 26, -2]} stroke="rgba(0,0,0,0.22)" strokeWidth={1.5} />
    {/* Headlights */}
    <Rect x={-23} y={-44} width={9} height={5} fill="#fef08a" cornerRadius={[2,2,0,0]} />
    <Rect x={14} y={-44} width={9} height={5} fill="#fef08a" cornerRadius={[2,2,0,0]} />
    {/* Taillights */}
    <Rect x={-23} y={39} width={9} height={5} fill="#fca5a5" cornerRadius={[0,0,2,2]} />
    <Rect x={14} y={39} width={9} height={5} fill="#fca5a5" cornerRadius={[0,0,2,2]} />
  </Group>
)

const Truck = ({ color }) => (
  <Group>
    {/* Rear dual axle wheels */}
    <Rect x={-44} y={32} width={13} height={24} fill="#1f2937" cornerRadius={3} />
    <Rect x={31} y={32} width={13} height={24} fill="#1f2937" cornerRadius={3} />
    <Rect x={-44} y={58} width={13} height={24} fill="#1f2937" cornerRadius={3} />
    <Rect x={31} y={58} width={13} height={24} fill="#1f2937" cornerRadius={3} />
    {/* Front axle wheels */}
    <Rect x={-44} y={-64} width={13} height={24} fill="#1f2937" cornerRadius={3} />
    <Rect x={31} y={-64} width={13} height={24} fill="#1f2937" cornerRadius={3} />
    {/* Cargo trailer */}
    <Rect x={-34} y={-8} width={68} height={100} fill={color} cornerRadius={3} />
    {/* Cargo slat lines */}
    {[0, 1, 2, 3, 4].map((i) => (
      <Line key={i} points={[-34, 10 + i * 18, 34, 10 + i * 18]} stroke="rgba(0,0,0,0.14)" strokeWidth={1} />
    ))}
    {/* Cab-trailer separator */}
    <Line points={[-34, -6, 34, -6]} stroke="rgba(0,0,0,0.35)" strokeWidth={2} />
    {/* Cab */}
    <Rect x={-30} y={-76} width={60} height={70} fill={color} cornerRadius={6} />
    {/* Windshield */}
    <Rect x={-21} y={-70} width={42} height={26} fill="rgba(186,230,253,0.82)" cornerRadius={3} />
    {/* Headlights */}
    <Rect x={-27} y={-74} width={10} height={6} fill="#fef08a" cornerRadius={2} />
    <Rect x={17} y={-74} width={10} height={6} fill="#fef08a" cornerRadius={2} />
    {/* Rear lights */}
    <Rect x={-32} y={88} width={10} height={6} fill="#fca5a5" cornerRadius={2} />
    <Rect x={22} y={88} width={10} height={6} fill="#fca5a5" cornerRadius={2} />
  </Group>
)

const Motorcycle = ({ color }) => (
  <Group>
    {/* Rear wheel */}
    <Rect x={-11} y={20} width={22} height={30} fill="#1f2937" cornerRadius={6} />
    {/* Body/frame */}
    <Rect x={-9} y={-22} width={18} height={48} fill={color} cornerRadius={5} />
    {/* Tank/engine area */}
    <Rect x={-7} y={-8} width={14} height={18} fill="rgba(0,0,0,0.18)" cornerRadius={3} />
    {/* Front wheel */}
    <Rect x={-11} y={-50} width={22} height={30} fill="#1f2937" cornerRadius={6} />
    {/* Handlebars */}
    <Rect x={-24} y={-36} width={48} height={5} fill="#374151" cornerRadius={2} />
    {/* Headlight */}
    <Circle x={0} y={-50} radius={5} fill="#fef08a" />
  </Group>
)

const Van = ({ color }) => (
  <Group>
    {/* Wheels */}
    <Rect x={-40} y={-46} width={14} height={26} fill="#1f2937" cornerRadius={4} />
    <Rect x={26} y={-46} width={14} height={26} fill="#1f2937" cornerRadius={4} />
    <Rect x={-40} y={20} width={14} height={26} fill="#1f2937" cornerRadius={4} />
    <Rect x={26} y={20} width={14} height={26} fill="#1f2937" cornerRadius={4} />
    {/* Wheel rims */}
    <Circle x={-33} y={-33} radius={5} fill="#374151" />
    <Circle x={33} y={-33} radius={5} fill="#374151" />
    <Circle x={-33} y={33} radius={5} fill="#374151" />
    <Circle x={33} y={33} radius={5} fill="#374151" />
    {/* Body */}
    <Rect x={-28} y={-54} width={56} height={108} fill={color} cornerRadius={5} />
    {/* Front windshield */}
    <Rect x={-20} y={-48} width={40} height={22} fill="rgba(186,230,253,0.82)" cornerRadius={3} />
    {/* Rear doors/window */}
    <Rect x={-20} y={30} width={40} height={18} fill="rgba(186,230,253,0.55)" cornerRadius={3} />
    {/* Sliding door line */}
    <Line points={[16, -54, 16, 54]} stroke="rgba(0,0,0,0.15)" strokeWidth={1} />
    {/* Body mid-line */}
    <Line points={[-28, 2, 28, 2]} stroke="rgba(0,0,0,0.18)" strokeWidth={1.5} />
    {/* Headlights */}
    <Rect x={-25} y={-52} width={10} height={6} fill="#fef08a" cornerRadius={2} />
    <Rect x={15} y={-52} width={10} height={6} fill="#fef08a" cornerRadius={2} />
    {/* Taillights */}
    <Rect x={-25} y={46} width={10} height={6} fill="#fca5a5" cornerRadius={2} />
    <Rect x={15} y={46} width={10} height={6} fill="#fca5a5" cornerRadius={2} />
  </Group>
)

const Cone = ({ color }) => (
  <Group>
    {/* Base shadow */}
    <Circle x={2} y={3} radius={24} fill="rgba(0,0,0,0.18)" />
    {/* Base */}
    <Circle x={0} y={0} radius={23} fill={color} />
    {/* White reflective band */}
    <Circle x={0} y={0} radius={17} fill="white" opacity={0.45} />
    {/* Orange inner body */}
    <Circle x={0} y={0} radius={13} fill={color} />
    {/* Second white band */}
    <Circle x={0} y={0} radius={8} fill="white" opacity={0.35} />
    {/* Tip */}
    <Circle x={0} y={0} radius={4} fill={color} />
  </Group>
)

const Barrier = () => (
  <Group>
    {/* Shadow */}
    <Rect x={-44} y={-15} width={92} height={36} fill="rgba(0,0,0,0.2)" cornerRadius={5} />
    {/* Body */}
    <Rect x={-46} y={-18} width={92} height={36} fill="#9ca3af" cornerRadius={5} />
    {/* Stripe segments */}
    {[-32, -16, 0, 16, 32].map((xOff, i) => (
      <Rect
        key={i}
        x={xOff - 7}
        y={-18}
        width={10}
        height={36}
        fill={i % 2 === 0 ? '#ef4444' : '#ffffff'}
        opacity={0.75}
      />
    ))}
    {/* Top edge highlight */}
    <Rect x={-46} y={-18} width={92} height={4} fill="rgba(255,255,255,0.25)" cornerRadius={[5,5,0,0]} />
  </Group>
)

const Tree = ({ color }) => (
  <Group>
    {/* Shadow */}
    <Circle x={4} y={6} radius={32} fill="rgba(0,0,0,0.2)" />
    {/* Outer canopy clusters */}
    <Circle x={-14} y={-10} radius={24} fill={color} />
    <Circle x={14} y={-10} radius={24} fill={color} />
    <Circle x={0} y={-22} radius={22} fill={color} />
    <Circle x={0} y={4} radius={22} fill={color} />
    {/* Center highlight */}
    <Circle x={0} y={-8} radius={14} fill="rgba(255,255,255,0.12)" />
    {/* Trunk */}
    <Rect x={-5} y={10} width={10} height={14} fill="#78350f" cornerRadius={2} />
  </Group>
)

const TrafficLight = () => (
  <Group>
    {/* Pole */}
    <Rect x={-4} y={-8} width={8} height={56} fill="#374151" cornerRadius={2} />
    {/* Pole base */}
    <Rect x={-8} y={44} width={16} height={8} fill="#4b5563" cornerRadius={2} />
    {/* Housing */}
    <Rect x={-17} y={-54} width={34} height={52} fill="#111827" cornerRadius={6} />
    {/* Housing frame */}
    <Rect x={-17} y={-54} width={34} height={52} fill="transparent" stroke="#374151" strokeWidth={1} cornerRadius={6} />
    {/* Red light */}
    <Circle x={0} y={-44} radius={11} fill="#1f2937" />
    <Circle x={0} y={-44} radius={9} fill="#ef4444" />
    <Circle x={-3} y={-47} radius={3} fill="rgba(255,255,255,0.25)" />
    {/* Amber light */}
    <Circle x={0} y={-28} radius={11} fill="#1f2937" />
    <Circle x={0} y={-28} radius={9} fill="#f59e0b" />
    <Circle x={-3} y={-31} radius={3} fill="rgba(255,255,255,0.25)" />
    {/* Green light */}
    <Circle x={0} y={-12} radius={11} fill="#1f2937" />
    <Circle x={0} y={-12} radius={9} fill="#22c55e" />
    <Circle x={-3} y={-15} radius={3} fill="rgba(255,255,255,0.25)" />
  </Group>
)

const StopSign = ({ color }) => (
  <Group>
    {/* Pole */}
    <Rect x={-4} y={12} width={8} height={38} fill="#374151" cornerRadius={2} />
    {/* Pole base */}
    <Rect x={-8} y={46} width={16} height={8} fill="#4b5563" cornerRadius={2} />
    {/* Sign shadow */}
    <RegularPolygon sides={8} radius={28} fill="rgba(0,0,0,0.2)" x={2} y={2} rotation={22.5} />
    {/* Sign */}
    <RegularPolygon sides={8} radius={28} fill={color} stroke="white" strokeWidth={3} rotation={22.5} />
    {/* Inner border */}
    <RegularPolygon sides={8} radius={22} fill="transparent" stroke="white" strokeWidth={1.5} rotation={22.5} />
    <Text
      text="STOP"
      x={-20}
      y={-8}
      width={40}
      height={16}
      align="center"
      fontSize={12}
      fontStyle="bold"
      fill="white"
    />
  </Group>
)

const Crosswalk = ({ color }) => (
  <Group>
    {/* Background area */}
    <Rect x={-44} y={-44} width={88} height={88} fill="#374151" cornerRadius={3} />
    {/* Zebra stripes */}
    {[0, 1, 2, 3, 4].map((i) => (
      <Rect
        key={i}
        x={-40}
        y={-38 + i * 17}
        width={80}
        height={11}
        fill="white"
        opacity={0.9}
        cornerRadius={1}
      />
    ))}
    {/* Border */}
    <Rect x={-44} y={-44} width={88} height={88} fill="transparent" stroke={color} strokeWidth={2} cornerRadius={3} />
  </Group>
)

const RENDERERS = {
  car: Car,
  truck: Truck,
  motorcycle: Motorcycle,
  van: Van,
  cone: Cone,
  barrier: Barrier,
  tree: Tree,
  traffic_light: TrafficLight,
  stop_sign: StopSign,
  crosswalk: Crosswalk,
}

export const SceneElementShape = ({ type, color }) => {
  const Renderer = RENDERERS[type]
  return Renderer ? <Renderer color={color} /> : <Circle radius={20} fill={color} />
}
