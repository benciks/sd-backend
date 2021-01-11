import { customAlphabet } from 'nanoid'

export function hideFields<T>(object: any, hidden: string[]): T {
    return Object.keys(object)
        .filter((i) => !hidden.includes(i))
        .reduce((acc: Record<string, unknown>, key: string) => {
            acc[key] = object[key]
            return acc
        }, {}) as T
}

export const randId = customAlphabet('6789BCDFGHJKLMNPQRTWbcdfghjkmnpqrtwz', 10)
