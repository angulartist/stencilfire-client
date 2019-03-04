export const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

export const mmToCm = (value: number) => {
  if (value) return (value / 10).toFixed(1)
}

export const mmToInches = (value: number) => {
  if (value) return (value / 25.4).toFixed(2)
}
