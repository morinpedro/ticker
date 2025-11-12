const localId = 'ticker_by_pedro'

export function storageSet (key, payload) {
  return localStorage.setItem((localId ? localId + '_' + key : key), payload)
}

export function storageGet (key) {
  return localStorage.getItem(localId ? localId + '_' + key : key)
}

export function storageRemove (key) {
  return localStorage.removeItem(localId ? localId + '_' + key : key)
}
