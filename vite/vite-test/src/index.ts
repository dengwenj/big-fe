interface User {
  name: string
  age: number,
  say: () => void
}

const person: User = {
  name: "朴睦",
  age: 25,
  say: function (): void {
    console.log("你好世界")
  }
}
console.log(person)
