import { storageGet, storageSet } from 'src/services/storage.js'

export function loadSongs () {
  const s = storageGet('songs')
  if (s) {
    const songs = JSON.parse(s)
    songs.forEach(song => {
      song.blocks.forEach(block => {
        block.bpc = Number(block.bpc)
        block.speed = Number(block.speed)
        block.repeat = Number(block.repeat)
      })
    })
    return songs

  } else {
    return []
  }
}

export function saveSongs (songs) {
  storageSet('songs', JSON.stringify(songs))
}

export function renumberElements (arr) {
  let i = 1
  arr.forEach(el => {
    el.id = i
    i++
  })

}
