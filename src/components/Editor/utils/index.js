/** 生成唯一标识 */
export function guid() {
  return 'xxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

export const wrapEventName = guid => eventName => `[${guid}]${eventName}`
export const unwrapEventName = wrapEventName => wrapEventName.split(']')[1]
