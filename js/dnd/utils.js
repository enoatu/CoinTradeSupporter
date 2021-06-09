export const Reorder = (list, startIndex, endIndex) => {
  //console.log(list,startIndex,endIndex);
  const result = Array.from(list)
  const [removed] = result.splice(startIndex, 1)
  result.splice(endIndex, 0, removed)
  //console.log(result);
  return result
}

const grid = 6
export const getUrlStyle = (isDragging, draggableStyle) => {
  return {
    userSelect: 'none',
    padding: grid * 2,
    textAlign: 'right',
    background: isDragging ? 'grey' : 'white',

    ...draggableStyle,
  }
}

export const getGroupListStyle = (isDraggingOver) => ({
  background: isDraggingOver ? 'lightblue' : 'lightgrey',
  padding: 8,
  width: '100%',
})

export const getListStyle = (isDraggingOver) => ({
  background: isDraggingOver ? 'lightblue' : 'rgba(0, 0,0,0)',
  padding: 4,
  width: '100%',
  margin: 5,
})
