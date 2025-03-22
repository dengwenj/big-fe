export default function CustomLoader(source) {
  const options = this.getOptions() || {}
  return `
    // ${options.name} ${options.age} 
    ${source}
  `
}
