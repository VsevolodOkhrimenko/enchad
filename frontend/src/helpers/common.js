export function checkIfIdExists(array, id) {
  for (let i = 0, length = array.length; i < length; i += 1) {
    if (array[i]['id'] === id) {
      return true
    }
  }
  return false
}

export function findIndexById(array, id) {
  for (let i = 0, length = array.length; i < length; i += 1) {
    if (array[i]['id'] === id) {
      return i
    }
  }
  return -1
}

export function getItemById(array, id) {
  for (let i = 0, length = array.length; i < length; i += 1) {
    if (array[i]['id'] === id) {
      return array[i]
    }
  }
  return null
}

export function moveToFirstById(arrayInit, id) {
  const array = [...arrayInit]
  const elementToMove = array.find((element) => {
    return element['id'] === id
  })
  const index = array.indexOf(elementToMove)
  array.splice(index, 1)
  array.unshift(elementToMove)
  return array
}
