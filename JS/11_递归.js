function f(x) {
  if (x === 1) {
    return 1
  }
  return x * f(x - 1)
}
// 4 * 3 * 2 * 1
console.log(f(4))

// 菲波那切数列
// 0 1 1 2 3 5 8 13 21 34
function r(x) {
  if (x === 1) {
    return 0
  } else if (x === 2) {
    return 1
  } else {
    return r(x - 1) + r(x - 2)
  }
}
console.log(r(5))

// 计算 1 到 100 累加
// 100 + 99 + 98 + 97
// 1 + 2 + 3 + 4 ... + 100
function z(x, y) {
  if (x === y) {
    return y
  } else {
    return x + z(x + 1, y)
  }
}
console.log(z(1, 100))
