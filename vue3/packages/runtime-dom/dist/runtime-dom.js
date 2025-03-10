// packages/runtime-dom/src/nodeOps.ts
var nodeOps = {
  // 如果 anchor 为空，就相当于 appendChild
  insert: (el, parent, anchor) => parent.insertBefore(el, anchor || null),
  remove(el) {
    const parent = el.parentNode;
    parent && parent.removeChild(el);
  },
  createElement: (type) => document.createElement(type),
  createText: (text) => document.createTextNode(text),
  setText: (node, text) => node.nodeValue = text,
  setElementText: (el, text) => el.textContent = text,
  parentNode: (node) => node.parentNode,
  nextSibling: (node) => node.nextSibling
};

// packages/runtime-dom/src/modules/patchAttr.ts
function patchAttr(el, key, value) {
  if (!value) {
    el.removeAttribute(key);
  } else {
    el.setAttribute(key, value);
  }
}

// packages/runtime-dom/src/modules/patchClass.ts
function patchClass(el, value) {
  if (!value) {
    el.removeAttribute("class");
  } else {
    el.className = value;
  }
}

// packages/runtime-dom/src/modules/patchEvent.ts
function createInovker(eventCb) {
  const inovker = (e) => {
    inovker.value(e);
  };
  inovker.value = eventCb;
  return inovker;
}
function patchEvent(el, key, value) {
  const inovkers = el.vei || (el.vei = {});
  const exisitInvoker = inovkers[key];
  if (exisitInvoker && value) {
    exisitInvoker.value = value;
    return;
  }
  const eventName = key.slice(2).toLowerCase();
  if (value) {
    const inovker = createInovker(value);
    inovkers[key] = inovker;
    el.addEventListener(eventName, inovker);
    return;
  }
  if (exisitInvoker) {
    el.removeEventListener(eventName, exisitInvoker);
    inovkers[key] = void 0;
  }
}

// packages/runtime-dom/src/modules/patchStyle.ts
function patchStyle(el, preVal, value) {
  const style = el.style;
  for (const key in value) {
    style[key] = value[key];
  }
  if (preVal) {
    for (const key in preVal) {
      if (value) {
        if (value[key] === null) {
          style[key] = null;
        }
      }
    }
  }
}

// packages/runtime-dom/src/patchProp.ts
function patchProp(el, key, preVal, value) {
  if (key === "class") {
    return patchClass(el, value);
  } else if (key === "style") {
    return patchStyle(el, preVal, value);
  } else if (/^on[^a-z]/.test(key)) {
    return patchEvent(el, key, value);
  } else {
    return patchAttr(el, key, value);
  }
}

// packages/shared/src/index.ts
function isObject(obj) {
  return typeof obj === "object" && obj !== null;
}
function isString(val) {
  return typeof val === "string";
}

// packages/runtime-core/src/createVnode.ts
function isVnode(vnode) {
  return !!vnode.__v_isVnode;
}
function isSameVnode(n1, n2) {
  return n1.type === n2.type && n1.key === n2.key;
}
function createVnode(type, props, children) {
  const shapeFlag = isString(type) ? 1 /* ELEMENT */ : 0;
  const vnode = {
    __v_isVnode: true,
    type,
    props,
    children,
    shapeFlag,
    el: null,
    // 虚拟节点对应的真实节点是谁
    key: props?.key
    // diff 算法后面需要的 key
  };
  if (Array.isArray(children)) {
    vnode.shapeFlag |= 16 /* ARRAY_CHILDREN */;
  } else {
    vnode.shapeFlag |= 8 /* TEXT_CHILDREN */;
  }
  return vnode;
}

// packages/runtime-core/src/h.ts
function h(type, propsOrChildren, children) {
  const len = arguments.length;
  if (len === 2) {
    if (isObject(propsOrChildren) && !Array.isArray(propsOrChildren)) {
      if (isVnode(propsOrChildren)) {
        return createVnode(type, null, [propsOrChildren]);
      }
      return createVnode(type, propsOrChildren, null);
    }
    return createVnode(type, null, propsOrChildren);
  } else {
    if (len > 3) {
      children = [...arguments].slice(2);
    }
    if (len === 1) {
      propsOrChildren = null;
      children = null;
    } else if (len === 3 && isVnode(children)) {
      children = [children];
    }
    return createVnode(type, propsOrChildren, children);
  }
}

// packages/runtime-core/src/renderer.ts
function createRenderer(renderOptions2) {
  const {
    insert: hostInsert,
    remove: hostRemove,
    createElement: hostCreateElement,
    createText: hostCreateText,
    setText: hostSetText,
    setElementText: hostSetElementText,
    parentNode: hostParentNode,
    nextSibling: hostNextSibling,
    patchProp: hostPatchProp
  } = renderOptions2;
  const mountChildren = (ele, children) => {
    for (const item of children) {
      patch(null, item, ele);
    }
  };
  const mountElement = (n2, container) => {
    const { shapeFlag, type, children, props } = n2;
    const ele = hostCreateElement(type);
    n2.el = ele;
    if (props) {
      for (const key in props) {
        hostPatchProp(ele, key, null, props[key]);
      }
    }
    if (shapeFlag & 8 /* TEXT_CHILDREN */) {
      hostSetElementText(ele, children);
    } else if (shapeFlag & 16 /* ARRAY_CHILDREN */) {
      mountChildren(ele, children);
    }
    hostInsert(ele, container);
  };
  const processElement = (n1, n2, container) => {
    if (n1 === null) {
      mountElement(n2, container);
    } else {
      patchElement(n1, n2, container);
    }
  };
  const patchProps = (oldProps, newProps, el) => {
    for (const key in newProps) {
      hostPatchProp(el, key, oldProps[key], newProps[key]);
    }
    for (const key in oldProps) {
      if (!newProps[key]) {
        hostPatchProp(el, key, oldProps[key], null);
      }
    }
  };
  const unmountChildren = (children) => {
    for (const vnode of children) {
      hostRemove(vnode.el);
    }
  };
  const patchChildren = (n1, n2, el) => {
    const c1 = n1.children;
    const c2 = n2.children;
    const preShapeFlag = n1.shapeFlag;
    const shapeFlag = n2.shapeFlag;
    if (shapeFlag & 8 /* TEXT_CHILDREN */) {
      if (preShapeFlag & 16 /* ARRAY_CHILDREN */) {
        unmountChildren(c1);
        hostSetElementText(el, c2);
      } else if (preShapeFlag & 8 /* TEXT_CHILDREN */) {
        hostSetElementText(el, c2);
      }
    } else {
      if (preShapeFlag & 16 /* ARRAY_CHILDREN */) {
        if (shapeFlag & 16 /* ARRAY_CHILDREN */) {
        } else {
          unmountChildren(c1);
        }
      } else {
        if (preShapeFlag & 8 /* TEXT_CHILDREN */) {
          hostSetElementText(el, "");
        }
        if (shapeFlag & 16 /* ARRAY_CHILDREN */) {
          mountChildren(el, c2);
        }
      }
    }
  };
  const patchElement = (n1, n2, container) => {
    const el = n2.el = n1.el;
    const oldProps = n1.props || {};
    const newProps = n2.props || {};
    patchProps(oldProps, newProps, el);
    patchChildren(n1, n2, el);
  };
  const patch = (n1, n2, container) => {
    if (n1 === n2) {
      return;
    }
    if (n1 && !isSameVnode(n1, n2)) {
      unmount(n1);
      n1 = null;
      container._vnode = n2;
    }
    processElement(n1, n2, container);
  };
  const unmount = (vnode) => {
    hostRemove(vnode.el);
  };
  const render2 = (vnode, container) => {
    if (vnode === null) {
      if (container._vnode) {
        unmount(container._vnode);
      }
    }
    patch(container._vnode || null, vnode, container);
    container._vnode = vnode;
  };
  return {
    render: render2
  };
}

// packages/runtime-dom/src/index.ts
var renderOptions = {
  ...nodeOps,
  patchProp
};
var render = (vNode, container) => {
  return createRenderer(renderOptions).render(vNode, container);
};
export {
  createRenderer,
  createVnode,
  h,
  isSameVnode,
  isVnode,
  render
};
//# sourceMappingURL=runtime-dom.js.map
