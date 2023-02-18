import styles from './ManaCost.module.scss'

export const manaColors = ['colorless', 'white', 'red', 'blue', 'black', 'green']
export type ManaColor = typeof manaColors[number]
export type ManaCostDef = Partial<Record<ManaColor, number>>

export function parseManaCost (text: string): ManaCostDef {
  const accumulator: ManaCostDef = {}

  text.split(',').map(it => it.trim())
    .filter(it => it.length > 0)
    .forEach(value => {
      const [countStr, colorStr] = value.match(/(\d*)\s*(\w*)/)?.slice(1) ?? []

      let countNum = parseInt(countStr)
      if (isNaN(countNum)) countNum = 1

      if (manaColors.includes(colorStr)) {
        accumulator[colorStr] = (accumulator[colorStr] ?? 0) + countNum
      } else {
        accumulator.colorless = (accumulator.colorless ?? 0) + countNum
      }
    })

  return accumulator
}

export function ManaColorIcons ({ color, count }: {
  color: ManaColor
  count: number
}) {
  return <>
    {
      (color === 'colorless')
        ? <div className={styles.mana + ' ' + styles['mana-colorless']}>{count}</div>
        : Array(count).fill(0).map((_, i) => <div key={i} className={styles.mana + ' ' + styles['mana-' + color]}></div>)
    }
  </>
}

export function ManaCost ({ cost }: {
  cost: ManaCostDef
}) {
  return <div className={styles.manaCost}>
    { manaColors.map(color => <ManaColorIcons key={color} color={color} count={cost[color] ?? 0}></ManaColorIcons>) }
  </div>
}
